# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE
import os

no_cache = 1

import json
import re

import frappe
import frappe.sessions
from frappe import _
from frappe.utils.jinja_globals import is_rtl
from nxt_theme.events.sidebar import get_desktop_pages

SCRIPT_TAG_PATTERN = re.compile(r"\<script[^<]*\</script\>")
CLOSING_SCRIPT_TAG_PATTERN = re.compile(r"</script\>")


def get_context(context):
	if frappe.session.user == "Guest":
		frappe.throw(_("Log in to access this page."), frappe.PermissionError)
	elif frappe.db.get_value("User", frappe.session.user, "user_type", order_by=None) == "Website User":
		frappe.throw(_("You are not permitted to access this page."), frappe.PermissionError)

	hooks = frappe.get_hooks()
	try:
		boot = frappe.sessions.get()
	except Exception as e:
		raise frappe.SessionBootFailed from e

	# this needs commit
	csrf_token = frappe.sessions.get_csrf_token()

	frappe.db.commit()

	boot_json = frappe.as_json(boot, indent=None, separators=(",", ":"))

	# remove script tags from boot
	boot_json = SCRIPT_TAG_PATTERN.sub("", boot_json)

	# TODO: Find better fix
	boot_json = CLOSING_SCRIPT_TAG_PATTERN.sub("", boot_json)
	boot_json = json.dumps(boot_json)

	include_js = hooks.get("app_include_js", []) + frappe.conf.get("app_include_js", [])
	include_css = hooks.get("app_include_css", []) + frappe.conf.get("app_include_css", [])
	include_icons = hooks.get("app_include_icons", [])
	frappe.local.preload_assets["icons"].extend(include_icons)

	if frappe.get_system_settings("enable_telemetry") and os.getenv("FRAPPE_SENTRY_DSN"):
		include_js.append("sentry.bundle.js")

	theme_settings = frappe.get_doc("Theme Settings", "Theme Settings")

	context.update(
		{
			"no_cache": 1,
			"build_version": frappe.utils.get_build_version(),
			"include_js": include_js,
			"include_css": include_css,
			"include_icons": include_icons,
			"layout_direction": "rtl" if is_rtl() else "ltr",
			"lang": frappe.local.lang,
			"sounds": hooks["sounds"],
			"boot": boot if context.get("for_mobile") else boot_json,
			"desk_theme": boot.get("desk_theme") or "Light",
			"csrf_token": csrf_token,
			"google_analytics_id": frappe.conf.get("google_analytics_id"),
			"google_analytics_anonymize_ip": frappe.conf.get("google_analytics_anonymize_ip"),
			"app_name": (
				frappe.get_website_settings("app_name") or frappe.get_system_settings("app_name") or "Frappe"
			),
			"pages": get_desktop_pages(),
			"avatar": """""",
			"navbar_settings": frappe.get_doc("Navbar Settings"),
			"logo": frappe.get_website_settings("app_logo") or frappe.get_hooks("app_logo_url")[-1] or "/assets/nxt_theme/images/shape.svg",
			"company": frappe.db.get_default("Company") or "NexTash",
			"primary": theme_settings.get("primary_color") or "#060960",
			"secondary": theme_settings.get("secondary_color") or "#5EB182",
			"color_theme_1": hex_to_rgb(theme_settings.get("primary_color") or "#060960"),
			"color_theme_2": hex_to_rgb(theme_settings.get("secondary_color") or "#5EB182"),
			"skin_name": theme_settings.get("skin") or "razor",
		}
	)

	return context

def hex_to_rgb(hex_code):
    hex_code = hex_code.lstrip('#')
    
    rgb = tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))
    return f"{rgb[0]} {rgb[1]} {rgb[2]}"