import frappe
from frappe import _

# مفتاح افتراضي لتخزين وضع المبدّل الحالي (شركة محددة أو ALL)
DEFAULT_KEY = "company_switcher_current_company"
ALL_COMPANIES = "ALL"


def _ensure_logged_in():
	if frappe.session.user == "Guest":
		frappe.throw(_("Not permitted."), frappe.PermissionError)


def _accessible_companies():
	"""الشركات التي يملك المستخدم صلاحية عليها فقط (تحترم User Permissions)."""
	return frappe.get_list("Company", pluck="name", order_by="name")


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


@frappe.whitelist()
def get_companies():
	"""إرجاع الشركات المسموح بها للمستخدم فقط."""
	_ensure_logged_in()
	return {"companies": _accessible_companies()}


@frappe.whitelist()
def get_current_company():
	"""إرجاع الشركة الحالية من وضع المبدّل، أو ALL."""
	_ensure_logged_in()
	value = frappe.db.get_value(
		"DefaultValue", {"parent": frappe.session.user, "defkey": DEFAULT_KEY}, "defvalue"
	)
	return {"company": value or ALL_COMPANIES}


@frappe.whitelist()
def switch_company(company):
	"""يضبط الشركة الافتراضية للمستخدم (لا يمنح/يحذف صلاحيات).
	يُسمح فقط باختيار شركة يملك المستخدم صلاحية عليها."""
	_ensure_logged_in()
	user = frappe.session.user
	company = (company or "").strip()

	try:
		if company and company != ALL_COMPANIES:
			# يجب أن تكون الشركة ضمن الشركات المسموح بها للمستخدم
			if company not in _accessible_companies():
				frappe.throw(_("You are not permitted to select this company."))

			_set_user_default(user, DEFAULT_KEY, company)
			# يجعلها افتراضية في التقارير وكل حقل يحتاج اختيار شركة
			frappe.defaults.set_user_default("company", company, user=user)
		else:
			# وضع "كل الشركات": بلا شركة افتراضية محددة من المبدّل
			_set_user_default(user, DEFAULT_KEY, ALL_COMPANIES)
			companies = _accessible_companies()
			default_company = frappe.defaults.get_global_default("company")
			if default_company not in companies:
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
