import frappe

def execute():
    workspaces = frappe.get_all('Workspace', fields=['name', 'icon'])
    for workspace in workspaces:
        frappe.db.set_value('Workspace', workspace.name, 'icon', '')
    frappe.db.commit()