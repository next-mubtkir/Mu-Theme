// إصلاحات واجهة عامة لثيم MUBTKIR
// المشكلة: عند فتح بعض الدوك‌تايبس لا يمكن التمرير للأسفل إلا بعد تحديث الصفحة.
// السبب المرجّح: بقاء قفل تمرير (modal-open / overflow hidden / backdrop) من تفاعل سابق،
// أو عدم إعادة حساب ارتفاع حاوية التمرير عند تغيير المسار في تطبيق الصفحة الواحدة (SPA).

(function () {
	/**
	 * إصلاح مشكلة SimpleBar: المكتبة لا تعيد حساب أبعاد شريط التمرير بعد
	 * حَقن عناصر القائمة ديناميكياً في الـ DOM.
	 * الحل: مراقبة تغيّر المحتوى عبر MutationObserver + إعادة الحساب عند تغيير الصفحة.
	 */
	function get_simplebar_instance() {
		var el = document.querySelector(".scrollable-ref");
		if (!el) return null;
		// SimpleBar يخزّن النسخ في SimpleBar.instances (WeakMap)
		if (typeof SimpleBar !== "undefined" && SimpleBar.instances && SimpleBar.instances.has(el)) {
			return SimpleBar.instances.get(el);
		}
		return null;
	}

	function recalculate_simplebar() {
		try {
			var bar = get_simplebar_instance();
			if (bar && typeof bar.recalculate === "function") {
				bar.recalculate();
			}
		} catch (e) {
			// تجاهل أي خطأ
		}
	}

	function setup_simplebar_observer() {
		var bar = get_simplebar_instance();
		if (!bar) return;

		var contentEl = null;
		try {
			contentEl = bar.getContentElement();
		} catch (e) {
			// fallback: ابحث عن العنصر يدوياً
			var el = document.querySelector(".scrollable-ref");
			if (el) contentEl = el.querySelector(".simplebar-content");
		}
		if (!contentEl) return;

		// تجنّب تكرار المراقب
		if (contentEl._muSimpleBarObserver) return;

		var observer = new MutationObserver(function () {
			recalculate_simplebar();
		});
		observer.observe(contentEl, { childList: true, subtree: true });
		contentEl._muSimpleBarObserver = observer;
	}

	function unlock_scroll() {
		document.body.classList.remove("modal-open");
		$(".modal-backdrop").remove();
		$("body").css("overflow", "");
		$("html").css("overflow", "");

		// إعادة حساب SimpleBar مباشرة بدل الاعتماد على resize event
		recalculate_simplebar();

		// احتياطي: resize event لأي حاويات أخرى
		try {
			window.dispatchEvent(new Event("resize"));
		} catch (e) {
			// متصفحات قديمة: تجاهل
		}
	}

	$(document).ready(function () {
		// تأخير بسيط للتأكد إن SimpleBar تم تهيئته من ملف الثيم
		setTimeout(function () {
			setup_simplebar_observer();
		}, 500);

		if (window.frappe && frappe.router && frappe.router.on) {
			frappe.router.on("change", function () {
				setTimeout(unlock_scroll, 300);
			});
		}
		$(document).on("page-change", function () {
			setTimeout(unlock_scroll, 300);
		});

		// مراقبة إضافية: عند تحميل أي قائمة (list view) ديناميكياً
		$(document).on("list_update", function () {
			setTimeout(recalculate_simplebar, 200);
		});
	});
})();
