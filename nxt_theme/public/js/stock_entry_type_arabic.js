/**
 * MUBTKIR - Stock Entry Type Arabic Translation
 * ERPNext / Frappe v15
 *
 * الهدف:
 * - إبقاء القيمة الأصلية بالإنجليزية داخل قاعدة البيانات.
 * - إظهار الاسم العربي عندما تكون لغة الواجهة عربية.
 * - إظهار الاسم الإنجليزي عندما تكون لغة الواجهة إنجليزية.
 * - دعم النماذج والقوائم والتقارير القياسية قدر الإمكان.
 */

(() => {
    "use strict";

    // =========================================================
    // Stock Entry Type Translations
    // =========================================================

    const STOCK_ENTRY_TYPE_AR = Object.freeze({
        "Disassemble": "تفكيك منتج",
        "Manufacture": "تصنيع",
        "Material Consumption for Manufacture": "استهلاك مواد للتصنيع",
        "Material Issue": "صرف مواد",
        "Material Receipt": "استلام مواد",
        "Material Transfer": "نقل مواد",
        "Material Transfer for Manufacture": "نقل مواد للتصنيع",
        "Repack": "إعادة تعبئة"
    });


    // =========================================================
    // Check Current Language
    // =========================================================

    function isArabic() {

        const lang =
            (frappe.boot && frappe.boot.lang) ||
            (frappe.boot &&
                frappe.boot.user &&
                frappe.boot.user.language) ||
            document.documentElement.lang ||
            "";

        return String(lang)
            .toLowerCase()
            .startsWith("ar");
    }


    // =========================================================
    // Get Arabic Label
    // =========================================================

    function stockEntryTypeLabel(value) {

        if (!value) {
            return value;
        }

        if (!isArabic()) {
            return value;
        }

        return STOCK_ENTRY_TYPE_AR[value] || value;
    }


    // =========================================================
    // Make Helper Available Globally
    // =========================================================

    window.mubtkir_stock_entry_type_label =
        stockEntryTypeLabel;


    // =========================================================
    // Link Field Formatter
    // =========================================================

    function registerLinkFormatter() {

        frappe.form = frappe.form || {};

        frappe.form.link_formatters =
            frappe.form.link_formatters || {};


        const existingFormatter =
            frappe.form.link_formatters[
                "Stock Entry Type"
            ];


        frappe.form.link_formatters[
            "Stock Entry Type"
        ] = function (value, doc) {

            // Arabic interface
            if (
                isArabic() &&
                STOCK_ENTRY_TYPE_AR[value]
            ) {
                return STOCK_ENTRY_TYPE_AR[value];
            }


            // English interface
            if (existingFormatter) {
                return existingFormatter(
                    value,
                    doc
                );
            }


            return value;
        };
    }


    // =========================================================
    // Global Formatter
    // =========================================================

    function registerGlobalFormatter() {

        // Make sure frappe.format exists
        if (!frappe.format) {
            return;
        }


        // Prevent applying patch more than once
        if (
            frappe.format
                .__mubtkir_stock_entry_type_patched
        ) {
            return;
        }


        const originalFormat =
            frappe.format;


        function patchedFormat(
            value,
            df,
            options,
            doc
        ) {

            const formatted =
                originalFormat.apply(
                    this,
                    arguments
                );


            try {

                // Only Arabic
                if (!isArabic()) {
                    return formatted;
                }


                // No value
                if (!value) {
                    return formatted;
                }


                // No field definition
                if (!df) {
                    return formatted;
                }


                // Only Stock Entry Type Link fields
                if (
                    df.fieldtype !== "Link" ||
                    df.options !== "Stock Entry Type"
                ) {
                    return formatted;
                }


                // No translation available
                if (
                    !STOCK_ENTRY_TYPE_AR[value]
                ) {
                    return formatted;
                }


                const arabic =
                    STOCK_ENTRY_TYPE_AR[value];


                // =============================================
                // If Frappe returned HTML
                // =============================================

                if (
                    typeof formatted === "string" &&
                    formatted.includes("<")
                ) {

                    const div =
                        document.createElement(
                            "div"
                        );


                    div.innerHTML =
                        formatted;


                    const anchor =
                        div.querySelector("a");


                    // Preserve link but change displayed text
                    if (anchor) {

                        anchor.textContent =
                            arabic;

                        return div.innerHTML;
                    }


                    // Replace text inside HTML
                    return formatted.replace(
                        new RegExp(
                            escapeRegExp(
                                String(value)
                            ),
                            "g"
                        ),
                        arabic
                    );
                }


                // Plain text
                return arabic;

            }

            catch (error) {

                console.warn(
                    "[MUBTKIR] Stock Entry Type Arabic formatter error:",
                    error
                );

                return formatted;
            }
        }


        patchedFormat
            .__mubtkir_stock_entry_type_patched =
            true;


        patchedFormat.__original =
            originalFormat;


        frappe.format =
            patchedFormat;
    }


    // =========================================================
    // Escape Regex
    // =========================================================

    function escapeRegExp(text) {

        return text.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
    }


    // =========================================================
    // Initialize
    // =========================================================

    function init() {

        registerLinkFormatter();

        registerGlobalFormatter();

        console.log(
            "[MUBTKIR] Stock Entry Type Arabic translations loaded."
        );
    }


    // =========================================================
    // Start
    // =========================================================

    if (window.frappe) {

        init();

    }

    else {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                if (window.frappe) {
                    init();
                }

            }
        );
    }

})();
