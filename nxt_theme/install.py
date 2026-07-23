import frappe

ROLE_NAME = "Company Switcher Manager"


# ---------------------------------------------------------------------------
# دور مبدّل الشركات
# ---------------------------------------------------------------------------
def ensure_role():
	"""إنشاء دور مبدّل الشركات إن لم يكن موجوداً (يُستدعى عند التثبيت وقبل الترحيل)."""
	if not frappe.db.exists("Role", ROLE_NAME):
		frappe.get_doc(
			{
				"doctype": "Role",
				"role_name": ROLE_NAME,
				"desk_access": 1,
			}
		).insert(ignore_permissions=True)


# ---------------------------------------------------------------------------
# كتل HTML مخصّصة جاهزة (يختارها العميل داخل الورك سبيس)
# ---------------------------------------------------------------------------
# كل كتلة تُنشأ مرة واحدة إن لم تكن موجودة. الأسماء تبدأ بـ MUBTKIR ليسهل تمييزها
# وتصديرها عبر fixtures. أي فشل (اختلاف مخطط الدوك‌تايب) لا يكسر التثبيت/الترحيل.

MUBTKIR_BLOCKS = [
	{
		"name": "MUBTKIR Welcome Card",
		"html": (
			'<div class="mub-card">'
			'<h2>مرحباً بك في MUBTKIR ERP</h2>'
			'<p>لوحة عمل مخصّصة يمكنك تعديلها حسب احتياج شركتك.</p>'
			"</div>"
		),
		"style": (
			".mub-card{padding:24px;border-radius:14px;color:#fff;"
			"background:linear-gradient(135deg,#0ea5e9,#2563eb);"
			"box-shadow:0 6px 20px rgba(37,99,235,.25)}"
			".mub-card h2{margin:0 0 8px;font-size:20px;font-weight:700}"
			".mub-card p{margin:0;opacity:.9}"
		),
	},
	{
		"name": "MUBTKIR Quick Links",
		"html": (
			'<div class="mub-links">'
			'<a href="/app/sales-invoice/new">فاتورة مبيعات</a>'
			'<a href="/app/purchase-invoice/new">فاتورة مشتريات</a>'
			'<a href="/app/payment-entry/new">سند دفع</a>'
			"</div>"
		),
		"style": (
			".mub-links{display:flex;gap:12px;flex-wrap:wrap}"
			".mub-links a{flex:1;min-width:140px;text-align:center;padding:14px;"
			"border-radius:12px;background:#f1f5f9;color:#0f172a;font-weight:600;"
			"text-decoration:none;transition:.2s}"
			".mub-links a:hover{background:#e2e8f0}"
		),
	},
]


def ensure_custom_blocks():
	"""إنشاء كتل HTML مخصّصة جاهزة إن لم تكن موجودة (دفاعي بالكامل)."""
	if not frappe.db.exists("DocType", "Custom HTML Block"):
		return

	for block in MUBTKIR_BLOCKS:
		try:
			if frappe.db.exists("Custom HTML Block", block["name"]):
				continue

			doc = frappe.new_doc("Custom HTML Block")
			doc.name = block["name"]
			if doc.meta.has_field("html"):
				doc.html = block.get("html", "")
			if doc.meta.has_field("style"):
				doc.style = block.get("style", "")
			# إتاحتها للجميع إن وُجد حقل public
			if doc.meta.has_field("public"):
				doc.public = 1
			doc.insert(ignore_permissions=True)
		except Exception:
			frappe.log_error(
				title="MUBTKIR Custom Block seed failed",
				message=frappe.get_traceback(),
			)


def after_install():
	ensure_role()
	ensure_custom_blocks()
