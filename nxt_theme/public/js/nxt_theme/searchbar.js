import { openTailwiseModal, closeTailwiseModal } from "./modal_utils";

// Close through the Tailwise API so the body scroll lock
// (overflow-y-hidden + inline padding-right) is fully released.
function closeSearchModal() {
    closeTailwiseModal("#quick-search");
}

// Open through the Tailwise API (a no-op if already open thanks to the
// [data-modal-replacer] guard), then focus the search input once visible.
function openSearchModal() {
    openTailwiseModal("#quick-search");
    let tries = 0;
    let interval = setInterval(() => {
        tries += 1;
        if ($("#navbar-search").is(":visible")) {
            $("#navbar-search").trigger("focus");
            clearInterval(interval);
        } else if (tries > 20) {
            clearInterval(interval);
        }
    }, 100);
}

// Old code - kept for compatibility
$(document).on("click", "#navbar-search+ul li", (e) => {
    $("#quick-search").trigger("click");
})

// Open modal when clicking searchbar
$(".searchbar").on("click", (e) => {
    e.preventDefault();
    openSearchModal();
})

// Close modal on Enter key
$("#navbar-search").on("keydown", (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
        closeSearchModal();
    }
});

// Close modal when selecting from Awesomplete dropdown
$("#navbar-search").on("awesomplete-select", function(e) {
    // Small delay to allow navigation to complete
    setTimeout(() => {
        closeSearchModal();
    }, 150);
});

// Close modal when clicking on backdrop
$(document).on("click", "#quick-search", function(e) {
    if (e.target === this) {
        closeSearchModal();
    }
});

// اختصار فتح البحث: Ctrl/⌘ + G (وبديل M).
// ملاحظات الإصلاح:
//  - كان سابقاً يفحص metaKey فقط (Cmd على ماك) فلا يعمل على ويندوز/لينكس.
//  - Ctrl+K يخطفه المتصفح (شريط العنوان) على ويندوز، لذا استُبدل بـ G.
//  - نستخدم مرحلة الالتقاط (capture) + stopPropagation لتجاوز مستمع Frappe الافتراضي.
document.addEventListener(
    "keydown",
    function (e) {
        const mod = e.metaKey || e.ctrlKey;
        const key = (e.key || "").toLowerCase();
        if (mod && (key === "g" || key === "m")) {
            e.preventDefault();
            e.stopPropagation();
            // نحاكي نقر مربع البحث (المسار المعروف نجاحه) بدل فتح المودال يدوياً
            const sb = document.querySelector(".searchbar");
            if (sb) {
                sb.click();
            } else {
                openSearchModal();
            }
        }
    },
    true
);


  