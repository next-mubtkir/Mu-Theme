app_name = "nxt_theme"
app_title = "MUBTKIR Theme"
app_publisher = "MUBTKIR ERP"
app_description = "Enhanced User Interface and User Experience for Frappe Applications"
app_email = "support@mubtkir.com"
app_license = "gpl-2.0"
# required_apps = []

app_logo_url = "/assets/nxt_theme/images/small_icon.ico"

website_context = {
    "favicon": "/assets/nxt_theme/images/small_icon.ico",
    "splash_image": "/assets/nxt_theme/images/small_icon.ico",
}

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = [
    "nxt_theme.bundle.css",
    "/assets/nxt_theme/css/mubtkir_responsive.css",
]
app_include_js = [
    "nxt_theme.bundle.js",
    "/assets/nxt_theme/js/stock_entry_type_arabic.js"
]

# include js, css files in header of web template
# web_include_css = "/assets/nxt_theme/css/nxt_theme.css"
# web_include_js = "/assets/nxt_theme/js/nxt_theme.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "nxt_theme/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {
    "Calendar View" : "public/js/nxt_theme/calendar_view.js",
}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "nxt_theme/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "nxt_theme.utils.jinja_methods",
# 	"filters": "nxt_theme.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "nxt_theme.install.before_install"
after_install = "nxt_theme.install.after_install"
before_migrate = "nxt_theme.install.ensure_role"

# Uninstallation
# ------------

# before_uninstall = "nxt_theme.uninstall.before_uninstall"
# after_uninstall = "nxt_theme.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "nxt_theme.utils.before_app_install"
# after_app_install = "nxt_theme.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "nxt_theme.utils.before_app_uninstall"
# after_app_uninstall = "nxt_theme.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "nxt_theme.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"nxt_theme.tasks.all"
# 	],
# 	"daily": [
# 		"nxt_theme.tasks.daily"
# 	],
# 	"hourly": [
# 		"nxt_theme.tasks.hourly"
# 	],
# 	"weekly": [
# 		"nxt_theme.tasks.weekly"
# 	],
# 	"monthly": [
# 		"nxt_theme.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "nxt_theme.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "nxt_theme.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "nxt_theme.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["nxt_theme.utils.before_request"]
# after_request = ["nxt_theme.utils.after_request"]

# Job Events
# ----------
# before_job = ["nxt_theme.utils.before_job"]
# after_job = ["nxt_theme.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"nxt_theme.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

# ---------------------------------------------------------------------------
# MUBTKIR: صفحات الدخول / استعادة كلمة المرور / الخروج
# ---------------------------------------------------------------------------

# الصفحة الرئيسية عند فتح الرابط الجذر "/":
# المستخدم المسجّل → نظام العمل (/app)، والزائر يُحوّل تلقائياً إلى صفحة الدخول.
# ملاحظة: إن كان حقل Home Page في Website Settings معبّأً فهو يتقدّم على هذا الإعداد،
# لذا اتركه فارغاً ليعمل هذا الافتراضي من الثيم.
home_page = "app"

# توجيه صفحة الدخول القياسية إلى صفحة MUBTKIR المخصصة
website_route_rules = [
	{"from_route": "/login", "to_route": "mubtkir-login"},
]

# تحويل /forgot إلى صفحة استعادة كلمة المرور المخصصة
website_redirects = [
	{"source": "/forgot", "target": "/mubtkir_forgot"},
]

# شحن كتل Custom HTML Block الجاهزة مع التطبيق.
# لتعبئة الملف بالبيانات النظيفة: ثبّت التطبيق على الموقع الذي يحوي الكتل ثم شغّل:
#   bench --site <site> export-fixtures --app nxt_theme
# سيُنشئ ذلك ملف nxt_theme/fixtures/custom_html_block.json بمحتوى دقيق (html/script/style).
fixtures = [
	{
		"dt": "Custom HTML Block",
		"filters": [
			[
				"name",
				"in",
				[
					"Daimond Home", "Healthcare Home", "Gold Management", "Healthcare",
					"Employee Lifecycle", "Shift & Attendance", "Performance",
					"Expense Claims", "Leaves", "Recruitment", "HR", "POSNext", "Home",
					"Whatsapp", "ERPNext Integrations", "Integrations", "Build",
					"Payables", "Receivables", "Financial Reports", "ZATCA",
					"ERPNext Settings", "Tools", "Website", "Support", "CRM", "Projects",
					"Quality", "Manufacturing", "Users", "Assets", "Accunting", "stock",
					"selling", "Buying",
				],
			]
		],
	},
]

