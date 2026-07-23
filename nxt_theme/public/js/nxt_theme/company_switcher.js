// مبدّل الشركات داخل ثيم MUBTKIR
// يتعامل مع النقر على عنصر شركة، ويظهر ملاحظة للمستخدم المقيّد عند كل تحميل للصفحة.

$(document).ready(function () {
	// إخفاء القائمة المنسدلة عند اختيار عنصر (بنفس نمط بقية القوائم)
	$(document).on("click", ".company-switcher-item", function () {
		var company = $(this).data("company");
		$(".company_switcher").hide();

		frappe.confirm(
			__("This will update your company access and reload the page. Continue?"),
			function () {
				frappe.call({
					method: "nxt_theme.api.company_switcher.switch_company",
					args: { company: company },
					freeze: true,
					freeze_message: __("Switching company..."),
					callback: function () {
						location.reload();
					},
				});
			}
		);
	});

	// ملاحظة للمستخدمين المقيّدين (بلا صلاحية لكل الشركات) في كل تحميل للصفحة
	var $toggle = $(".company-switcher-toggle").first();
	if ($toggle.length && String($toggle.data("restricted")) === "1") {
		var current = $toggle.data("current");
		if (current && current !== "ALL") {
			frappe.show_alert(
				{
					message: __("You are currently viewing data for company: {0}", [
						frappe.utils.escape_html(current),
					]),
					indicator: "blue",
				},
				5
			);
		}
	}
});
