import frappe
from frappe import _


@frappe.whitelist(allow_guest=True, methods=["POST"])
def reset_password(user_input=None):
    """
    استعادة كلمة المرور باستخدام:
    - البريد الإلكتروني الموجود في User.name
    - أو اسم المستخدم الموجود في User.username
    """

    user_input = (user_input or "").strip()

    if not user_input:
        return {
            "success": False,
            "message": _("Please enter your email address or username.")
        }

    generic_message = _(
        "If the account details are valid, a password reset link will be sent to the registered email address."
    )

    # البحث أولًا بالبريد الإلكتروني
    user_email = frappe.db.get_value(
        "User",
        {
            "name": user_input,
            "enabled": 1
        },
        "name"
    )

    # إذا لم يوجد، يبحث باسم المستخدم
    if not user_email:
        user_email = frappe.db.get_value(
            "User",
            {
                "username": user_input,
                "enabled": 1
            },
            "name"
        )

    # لا نكشف للزائر هل الحساب موجود أم لا
    if not user_email:
        return {
            "success": True,
            "message": generic_message
        }

    try:
        user_doc = frappe.get_doc("User", user_email)

        # إنشاء رابط الاستعادة وإرساله إلى البريد المسجل
        user_doc.reset_password(send_email=True)

        return {
            "success": True,
            "message": generic_message
        }

    except Exception:
        frappe.log_error(
            title="Password Reset Error",
            message=frappe.get_traceback()
        )

        return {
            "success": False,
            "message": _(
                "Password recovery is currently unavailable. Please try again later."
            )
        }