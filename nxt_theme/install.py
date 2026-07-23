import frappe

ROLE_NAME = "Company Switcher Manager"


# ---------------------------------------------------------------------------
# دور مبدّل الشركات
# ---------------------------------------------------------------------------
def ensure_role():
	"""إنشاء دور مبدّل الشركات إن لم يكن موجوداً (يُستدعى عند التثبيت وقبل الترحيل)."""
	if not frappe.db.exists("Role", ROLE_NAME):
		frappe.get_doc(
			{
				"doctype": "Role",
				"role_name": ROLE_NAME,
				"desk_access": 1,
			}
		).insert(ignore_permissions=True)


def after_install():
	ensure_role()


# ملاحظة: كتل Custom HTML Block تُشحن عبر آلية fixtures (راجع hooks.py + مجلد fixtures)
# بدل إنشائها برمجياً، لضمان نقل html/script/style بدقة تامة دون أي فقد أو تهريب.
