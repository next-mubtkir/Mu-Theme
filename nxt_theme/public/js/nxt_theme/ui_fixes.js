// إصلاحات واجهة عامة لثيم MUBTKIR
// المشكلة: عند فتح بعض الدوك‌تايبس لا يمكن التمرير للأسفل إلا بعد تحديث الصفحة.
// السبب المرجّح: بقاء قفل تمرير (modal-open / overflow hidden / backdrop) من تفاعل سابق،
// أو عدم إعادة حساب ارتفاع حاوية التمرير عند تغيير المسار في تطبيق الصفحة الواحدة (SPA).

(function () {
	function unlock_scroll() {
		document.body.classList.remove("modal-open");
		$(".modal-backdrop").remove();
		$("body").css("overflow", "");
		$("html").css("overflow", "");

		// إعادة حساب ارتفاع حاويات التمرير (tailwise / simplebar) بعد رسم الصفحة
		try {
			window.dispatchEvent(new Event("resize"));
		} catch (e) {
			// متصفحات قديمة: تجاهل
		}
	}

	$(document).ready(function () {
		if (window.frappe && frappe.router && frappe.router.on) {
			frappe.router.on("change", function () {
				setTimeout(unlock_scroll, 300);
			});
		}
		$(document).on("page-change", function () {
			setTimeout(unlock_scroll, 300);
		});
	});
})();
