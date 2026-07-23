import frappe
from frappe import _

# اسم الدور الذي يُسمح لحامله باستخدام مبدّل الشركات
ROLE_NAME = "Company Switcher Manager"

# مفتاح افتراضي لتخزين وضع المبدّل الحالي (شركة محددة أو ALL)
DEFAULT_KEY = "company_switcher_current_company"

# مفتاح افتراضي لتتبّع اسم صلاحية User Permission التي أنشأها المبدّل فقط
PERMISSION_KEY = "company_switcher_permission_name"

ALL_COMPANIES = "ALL"


def _has_switcher_access():
	user = frappe.session.user
	if user == "Administrator":
		return True
	return ROLE_NAME in frappe.get_roles(user)


def _ensure_authorized():
	if not _has_switcher_access():
		frappe.throw(_("Not permitted to use Company Switcher."), frappe.PermissionError)


def _clean_user_default(user, key):
	"""يبقي على صف DefaultValue واحد لكل مفتاح ويحذف المكرر، ويرجع اسم المتبقي."""
	names = frappe.get_all(
		"DefaultValue", filters={"parent": user, "defkey": key}, pluck="name"
	)
	for extra in names[1:]:
		frappe.db.delete("DefaultValue", {"name": extra})
	return names[0] if names else None


def _set_user_default(user, key, value):
	name = _clean_user_default(user, key)
	if name:
		frappe.db.set_value("DefaultValue", name, "defvalue", value)
		return

	frappe.get_doc(
		{
			"doctype": "DefaultValue",
			"parent": user,
			"parenttype": "User",
			"parentfield": "defaults",
			"defkey": key,
			"defvalue": value,
		}
	).insert(ignore_permissions=True)


def _remove_switcher_permission(user):
	"""يحذف فقط صلاحية Company التي أنشأها المبدّل (المتتبَّعة) دون المساس بغيرها."""
	tracked = frappe.db.get_value(
		"DefaultValue", {"parent": user, "defkey": PERMISSION_KEY}, "defvalue"
	)
	if tracked and frappe.db.exists("User Permission", tracked):
		frappe.delete_doc("User Permission", tracked, ignore_permissions=True, force=True)
	_set_user_default(user, PERMISSION_KEY, "")


@frappe.whitelist()
def get_companies():
	"""إرجاع كل الشركات لتعبئة قائمة المبدّل."""
	_ensure_authorized()
	return {
		"companies": frappe.get_all(
			"Company", pluck="name", order_by="name", ignore_permissions=True
		)
	}


@frappe.whitelist()
def get_current_company():
	"""إرجاع الشركة الحالية من وضع المبدّل، أو ALL."""
	_ensure_authorized()
	value = frappe.db.get_value(
		"DefaultValue", {"parent": frappe.session.user, "defkey": DEFAULT_KEY}, "defvalue"
	)
	return {"company": value or ALL_COMPANIES}


@frappe.whitelist()
def switch_company(company):
	"""تبديل الشركة عبر إدارة صلاحية Company وضبط الافتراضيات بشكل آمن وذرّي."""
	_ensure_authorized()
	user = frappe.session.user
	company = (company or "").strip()

	try:
		if company and company != ALL_COMPANIES:
			if not frappe.db.exists("Company", company):
				frappe.throw(_("Company not found"))

			# أزل صلاحيتنا السابقة فقط، ثم أنشئ الجديدة وتتبّعها
			_remove_switcher_permission(user)

			perm = frappe.get_doc(
				{
					"doctype": "User Permission",
					"user": user,
					"allow": "Company",
					"for_value": company,
					"apply_to_all_doctypes": 1,
				}
			).insert(ignore_permissions=True)

			_set_user_default(user, PERMISSION_KEY, perm.name)
			_set_user_default(user, DEFAULT_KEY, company)
			# يجعل الشركة افتراضية في التقارير وكل حقل يحتاج اختيار شركة
			frappe.defaults.set_user_default("company", company, user=user)
		else:
			# وضع "كل الشركات": أزل القيد وأعد افتراضياً منطقياً
			_remove_switcher_permission(user)
			_set_user_default(user, DEFAULT_KEY, ALL_COMPANIES)

			default_company = frappe.defaults.get_global_default("company")
			if not default_company:
				companies = frappe.get_all(
					"Company", pluck="name", limit=1, order_by="name"
				)
				default_company = companies[0] if companies else None

			if default_company:
				frappe.defaults.set_user_default("company", default_company, user=user)

		frappe.db.commit()
	except Exception:
		frappe.db.rollback()
		frappe.log_error(title="Company Switcher Error", message=frappe.get_traceback())
		raise

	frappe.clear_cache(user=user)
	return {"company": company or ALL_COMPANIES}
