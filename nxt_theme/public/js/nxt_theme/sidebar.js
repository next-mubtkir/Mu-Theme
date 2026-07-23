$(document).on("click", ".link_to_page", (e) => {
	let el = e.currentTarget;
	
	let title = $(el).data("title")
	let is_public = $(el).data("is_public")
	let is_link = $(el).data("is_link")
	
	let hasSubMenu = $(el).parent().find("ul").length > 0;

	if(is_link) {
		frappe.set_route("List", title)
		$(".side-menu").first().removeClass("side-menu--mobile-menu-open");
		$(".close-mobile-menu").first().removeClass("close-mobile-menu--mobile-menu-open");
		return;
	}

	let url = "/app/" 
	url += is_public ? frappe.router.slug(title): "private/" + frappe.router.slug(title)

	frappe.set_route(url)
	
	if (!hasSubMenu) {
		$(".side-menu").first().removeClass("side-menu--mobile-menu-open");
		$(".close-mobile-menu").first().removeClass("close-mobile-menu--mobile-menu-open");
	}
})