// حفظ لغة واجهة المستخدم (من الـ desk) لتقرأها صفحة الدخول لاحقاً.
// صفحة الدخول تُعرض للزائر (لا جلسة)، لذا نخزّن اللغة في localStorage أثناء استخدام النظام،
// فتظهر صفحة الدخول بلغة واجهة المستخدم. المستخدم الجديد (بلا تخزين) = العربية افتراضياً.
$(document).ready(function () {
	try {
		var lang = window.frappe && frappe.boot && frappe.boot.lang;
		if (lang) {
			var norm = String(lang).toLowerCase().indexOf("ar") === 0 ? "ar" : "en";
			localStorage.setItem("mub_lang", norm);
		}
	} catch (e) {
		// تجاهل (localStorage غير متاح)
	}
});
