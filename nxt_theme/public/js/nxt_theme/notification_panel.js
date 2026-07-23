
$(document).on("click", "#mark_all_as_read", (e) => {
	frappe.call({
		method: "frappe.desk.doctype.notification_log.notification_log.mark_all_as_read",
		callback(r){
			load_notification()
		}
	})
})

$(document).on("click", ".mark_as_read", (e) => {
	let docname = $(e.currentTarget).data("docname")
	let document_type = $(e.currentTarget).data("document_type")
	let document_name = $(e.currentTarget).data("document_name")
	frappe.call({
		method: "frappe.desk.doctype.notification_log.notification_log.mark_as_read",
		args: {
			docname
		},
		callback(r){
			load_notification()

			if(document_type && document_name) {
				frappe.set_route("Form", document_type, document_name)
			}
		}
	})
})

$(document).on("click", "#notification_bell", (e) => {
	load_notification()
})

$("#user_avatar").append(frappe.avatar(frappe.session.user, "avatar-medium"))

const load_notification = () => {
	frappe.call({
		method: "nxt_theme.events.notification_log.get_notification_logs",
		callback(r) {
			const notification_logs = r.message.notification_logs
			const user_info = r.message.user_info
			
			$("#notification_list").html(`
				<div class="d-flex align-items-center justify-content-center" style="height: 100vh;">
					<span class="w-8 h-8">
						<svg width="25" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#64748b" class="w-full h-full"><g fill="none" fill-rule="evenodd" stroke-width="4"><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate></circle><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate></circle></g></svg>
					</span>
				</div>
			`)

			let notification_html = ""
			for (const notification of notification_logs) {

				notification_html += `
				<a class="flex items-center rounded-xl px-3 py-2.5 hover:bg-slate-100/80 mark_as_read" 
					data-docname="${notification.name}" data-document_type="${notification.document_type}" 
					data-document_name="${notification.document_name}" href="javascript:;">
					<div>
						<div class="image-fit h-11 w-11 overflow-hidden rounded-full border-2 border-slate-200/70">
						${frappe.avatar(notification.from_user, 'w-100 h-100')}
						</div>
					</div>
					<div class="sm:ml-5">
						<div class="font-medium">${notification.subject}</div>
						<div class="mt-0.5 text-slate-500">
							${notification.email_content}
						</div>

						<div class="mt-1.5 text-xs text-slate-500">
						${frappe.datetime.str_to_user(notification.creation)}
						</div>
					</div>
					${notification.read ? '' : '<div class="ml-auto h-2 w-2 flex-none rounded-full border border-primary/40 bg-primary/40"></div>'}
				</a>
				`
			}

			$("#notification_list").html(notification_html)
		}
	});
}