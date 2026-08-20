/**
 * MUBTKIR
 * Arabic labels for Stock Entry Type
 * ERPNext / Frappe v15
 *
 * Display Arabic only.
 * Database value remains English.
 */

(() => {
    "use strict";

    const translations = {
        "Disassemble": "تفكيك منتج",
        "Manufacture": "تصنيع",
        "Material Consumption for Manufacture": "استهلاك مواد للتصنيع",
        "Material Issue": "صرف مواد",
        "Material Receipt": "استلام مواد",
        "Material Transfer": "نقل مواد",
        "Material Transfer for Manufacture": "نقل مواد للتصنيع",
        "Repack": "إعادة تعبئة",

        // ظهر عندك في الصورة
        "Send to Subcontractor": "إرسال إلى مقاول فرعي"
    };


    // ==========================================
    // Language
    // ==========================================

    function isArabic() {
        const lang =
            frappe?.boot?.lang ||
            document.documentElement.lang ||
            "";

        return String(lang).toLowerCase().startsWith("ar");
    }


    // ==========================================
    // Translation
    // ==========================================

    function translate(value) {
        if (!isArabic() || !value) {
            return value;
        }

        return translations[value] || value;
    }


    window.mubtkir_stock_entry_type_label = translate;


    // ==========================================
    // Detect Stock Entry Type Link
    // ==========================================

    function isStockEntryTypeControl(control) {
        return (
            control &&
            control.df &&
            control.df.fieldtype === "Link" &&
            control.df.options === "Stock Entry Type"
        );
    }


    // ==========================================
    // Translate Link displayed value
    // ==========================================

    function patchLinkDisplay() {

        if (
            !frappe?.ui?.form?.ControlLink ||
            frappe.ui.form.ControlLink
                .prototype
                .__mubtkir_arabic_patched
        ) {
            return;
        }


        const proto =
            frappe.ui.form.ControlLink.prototype;


        // --------------------------------------
        // Format value inside field
        // --------------------------------------

        if (proto.format_for_input) {

            const original =
                proto.format_for_input;

            proto.format_for_input =
                function (value) {

                    if (
                        isArabic() &&
                        isStockEntryTypeControl(this) &&
                        translations[value]
                    ) {
                        return translations[value];
                    }

                    return original.apply(
                        this,
                        arguments
                    );
                };
        }


        // --------------------------------------
        // Search results
        // --------------------------------------

        if (proto.get_results) {

            const originalGetResults =
                proto.get_results;

            proto.get_results =
                async function () {

                    const result =
                        await originalGetResults.apply(
                            this,
                            arguments
                        );

                    if (
                        !isArabic() ||
                        !isStockEntryTypeControl(this)
                    ) {
                        return result;
                    }


                    if (!Array.isArray(result)) {
                        return result;
                    }


                    return result.map(item => {

                        // String result
                        if (typeof item === "string") {

                            if (translations[item]) {
                                return {
                                    value: item,
                                    label: translations[item]
                                };
                            }

                            return item;
                        }


                        // Object result
                        if (
                            item &&
                            typeof item === "object"
                        ) {

                            const originalValue =
                                item.value ||
                                item.name ||
                                item.label;


                            if (
                                originalValue &&
                                translations[originalValue]
                            ) {

                                return {
                                    ...item,

                                    // Important:
                                    // actual value remains English
                                    value:
                                        item.value ||
                                        originalValue,

                                    // User sees Arabic
                                    label:
                                        translations[
                                            originalValue
                                        ],

                                    description:
                                        item.description
                                };
                            }
                        }


                        return item;
                    });
                };
        }


        proto.__mubtkir_arabic_patched =
            true;
    }


    // ==========================================
    // Translate visible dropdown text
    // Fallback for Awesomeplete
    // ==========================================

    function translateDropdown() {

        if (!isArabic()) {
            return;
        }


        document
            .querySelectorAll(
                ".awesomplete ul li"
            )
            .forEach(li => {

                const text =
                    li.textContent
                        .trim();


                if (translations[text]) {

                    // Keep original value
                    if (!li.dataset.originalValue) {
                        li.dataset.originalValue =
                            text;
                    }


                    li.textContent =
                        translations[text];
                }

            });
    }


    // ==========================================
    // Observe dropdown changes
    // ==========================================

    function observeDropdown() {

        const observer =
            new MutationObserver(() => {

                translateDropdown();

            });


        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }


    // ==========================================
    // Global formatter for Reports / Lists
    // ==========================================

    function patchFormatter() {

        if (
            !frappe.format ||
            frappe.format
                .__mubtkir_stock_type_ar
        ) {
            return;
        }


        const original =
            frappe.format;


        function formatter(
            value,
            df,
            options,
            doc
        ) {

            const output =
                original.apply(
                    this,
                    arguments
                );


            if (
                !isArabic() ||
                !value
            ) {
                return output;
            }


            const isStockType =
                (
                    df &&
                    df.fieldtype === "Link" &&
                    df.options ===
                        "Stock Entry Type"
                ) ||
                (
                    df &&
                    (
                        df.fieldname ===
                            "stock_entry_type" ||
                        df.fieldname ===
                            "purpose"
                    )
                );


            if (
                isStockType &&
                translations[value]
            ) {

                if (
                    typeof output === "string" &&
                    output.includes("<")
                ) {

                    return output.replace(
                        value,
                        translations[value]
                    );
                }


                return translations[value];
            }


            return output;
        }


        formatter
            .__mubtkir_stock_type_ar =
            true;


        frappe.format =
            formatter;
    }


    // ==========================================
    // Init
    // ==========================================

    function init() {

        if (!window.frappe) {
            setTimeout(init, 300);
            return;
        }


        patchLinkDisplay();

        patchFormatter();

        observeDropdown();


        console.log(
            "[MUBTKIR] Stock Entry Type Arabic labels loaded"
        );
    }


    init();

})();
