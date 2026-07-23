// توجيه المستخدم إلى صفحة خروج MUBTKIR المخصّصة بعد تسجيل الخروج.
// الطريقة القياسية في Frappe: تسجيل الخروج من الـ desk ينفّذ frappe.app.logout ثم
// يعيد التوجيه عبر frappe.app.redirect_to_login. نتجاوز إعادة التوجيه فقط (غير كاسر:
// إن تغيّرت الآلية مستقبلاً يظل الخروج يعمل، ويعود للسلوك الافتراضي).

$(document).ready(function () {
	if (!window.frappe || !frappe.app) {
		return;
	}

	var LOGOUT_PAGE = "/mubtkir_logout";

	// المسار الأساسي: تجاوز دالة إعادة التوجيه بعد الخروج
	if (typeof frappe.app.redirect_to_login === "function") {
		frappe.app.redirect_to_login = function () {
			window.location.href = LOGOUT_PAGE;
		};
	}

	// مسار احتياطي: تغليف دالة الخروج نفسها إن لم تُستخدم redirect_to_login
	if (typeof frappe.app.logout === "function" && !frappe.app._mubtkir_logout_wrapped) {
		frappe.app._mubtkir_logout_wrapped = true;
		frappe.app.logout = function () {
			return frappe.call({
				method: "logout",
				callback: function () {
					window.location.href = LOGOUT_PAGE;
				},
			});
		};
	}
});
