// Shared helpers for Tailwise modals.
// Tailwise's modal engine (js/tailwise/vendors/modal.js) locks body scroll on
// show(): it adds the "overflow-y-hidden" class + an inline padding-right to
// <body>, and inserts a [data-modal-replacer] placeholder. Only its hide()
// undoes all of that, so modals must be closed through the Tailwise API —
// closing them by hand leaves the body scroll permanently locked (the
// "page frozen until F5" bug).

export function openTailwiseModal(selector) {
	const el = $(selector)[0];
	if (el && window.tailwind && window.tailwind.Modal) {
		window.tailwind.Modal.getOrCreateInstance(el).show();
	}
}

export function closeTailwiseModal(selector) {
	const el = $(selector)[0];
	if (el && window.tailwind && window.tailwind.Modal) {
		window.tailwind.Modal.getOrCreateInstance(el).hide();
	}
	// Legacy cleanup for any Bootstrap-style leftovers
	$(".modal-backdrop").remove();
	$("body").removeClass("modal-open");
}

// Safety net: if no modal is visible but the body is still scroll-locked
// (e.g. a modal was closed by a code path that bypassed Tailwise's hide()),
// release the lock.
export function unlockBodyScrollIfNoModal() {
	if (!$(".modal.show").length) {
		$("body").removeClass("overflow-y-hidden").css("padding-right", "");
	}
}
