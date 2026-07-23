import frappe
from frappe.desk.desktop import get_desktop_page
from frappe.desk.desktop import get_workspace_sidebar_items
import json

@frappe.whitelist()
def get_desktop_pages():
    pages = get_workspace_sidebar_items()
    pages = pages.get("pages")
    original_pages = pages
    pages = [d for d in pages if not d.get('parent_page')]
    
    for row in pages:
        row_json = json.dumps(row)
        desktop_page = get_desktop_page(row_json)
        row["cards"] = desktop_page.get("cards")
        row["child_workspace"] = [d for d in original_pages if d.get('parent_page') == row.get("name")]

    return pages