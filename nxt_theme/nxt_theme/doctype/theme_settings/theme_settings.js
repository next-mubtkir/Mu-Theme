// Copyright (c) 2024, NexTash (SMC-PVT) Ltd and contributors
// For license information, please see license.txt

frappe.ui.form.on("Theme Settings", {
	after_save: function (frm) {
		frappe.ui.toolbar.clear_cache();
	},
});
