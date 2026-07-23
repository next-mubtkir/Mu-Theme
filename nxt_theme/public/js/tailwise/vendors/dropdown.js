(() => {
  // node_modules/@left4code/tw-starter/dist/js/dropdown.js
  (function() {
    "use strict";
    function hide() {
      $(".tw-dropdown-menu").each(async function() {
        if ($(this).attr("id") !== void 0 && $('[data-dropdown-replacer="' + $(this).attr("id") + '"]').length && $(this).data("dropdown-programmatically") === void 0) {
          let randId = $(this).attr("id");
          let dropdownToggle = $('[data-dropdown-replacer="' + randId + '"]').parent().find("[data-tw-toggle='dropdown']");
          $(this).removeClass("show");
          const event = new Event("hide.tw.dropdown");
          $(dropdownToggle).parent()[0].dispatchEvent(event);
          await setTimeout(() => {
            $('[data-dropdown-replacer="' + randId + '"]').replaceWith(this);
            $(this).removeAttr("style");
            $(this).removeAttr("data-popper-placement");
            $(dropdownToggle).attr("aria-expanded", false);
            const event2 = new Event("hidden.tw.dropdown");
            $(dropdownToggle).parent()[0].dispatchEvent(event2);
          }, 200);
        } else if ($(this).attr("id") !== void 0 && !$('[data-dropdown-replacer="' + $(this).attr("id") + '"]').length && $(this).hasClass("show") && $(this).data("dropdown-programmatically") === void 0) {
          $(this).remove();
        } else if ($(this).data("dropdown-programmatically") == "initiate") {
          $(this).attr("data-dropdown-programmatically", "showed");
        } else if ($(this).data("dropdown-programmatically") == "showed") {
          $(this).removeAttr("data-dropdown-programmatically");
          hide();
        }
      });
    }

    function findVisibleDropdownToggle(dropdownToggle) {
      return dropdownToggle.filter((key, dropdownToggle2) => {
        return dropdownToggle2.offsetParent !== null;
      });
    }

    async function show(dropdown) {
      let dropdownBox = $(dropdown).find(".tw-dropdown-menu").first();
      let dropdownToggle = findVisibleDropdownToggle(
        $(dropdown).find("[data-tw-toggle='dropdown']")
      );
      let placement = $(dropdown).data("tw-placement") ? $(dropdown).data("tw-placement") : "bottom-end";
      let randId = "_" + Math.random().toString(36).substr(2, 9);
      hide();
      if ($(dropdownBox).length) {
        $(dropdownToggle).attr("aria-expanded", true);
        $(dropdown).css("position") == "static" ? $(dropdown).css("position", "relative") : "";
        $(dropdownBox).show();
        $(dropdownBox).css("width", $(dropdownBox).css("width"));
        $('<div data-dropdown-replacer="' + randId + '"></div>').insertAfter(
          dropdownBox
        );
        $(dropdownBox).attr("id", randId).appendTo("body");
        $(".modal.show").each(function() {
          if ($(this).find('[data-dropdown-replacer="' + randId + '"]')) {
            $(dropdownBox).css("z-index", $(this).css("z-index"));
          }
        });
        Popper.createPopper(dropdownToggle[0], dropdownBox[0], {
          placement
        });
        $(dropdownBox).addClass("show");
        const event = new Event("show.tw.dropdown");
        $(dropdown)[0].dispatchEvent(event);
        await setTimeout(() => {
          const event2 = new Event("shown.tw.dropdown");
          $(dropdown)[0].dispatchEvent(event2);
        }, 200);
      }
    }
    function toggleProgrammatically(dropdown) {
      let dropdownBox = $(dropdown).find(".tw-dropdown-menu").first();
      if ($(dropdownBox).length) {
        showProgrammatically(dropdown);
      } else {
        hide();
      }
    }
    function showProgrammatically(dropdown) {
      if ($(dropdown).find(".tw-dropdown-menu").length) {
        $(dropdown).find(".tw-dropdown-menu").attr("data-dropdown-programmatically", "initiate");
      } else {
        let randId = $("[data-dropdown-replacer]").data("dropdown-replacer");
        $("#" + randId).attr("data-dropdown-programmatically", "initiate");
      }
      show(dropdown);
    }
    function createInstance(dropdownToggle) {
      const dropdown = $(dropdownToggle).closest(".dropdown");
      return {
        show() {
          showProgrammatically(dropdown);
        },
        hide() {
          hide();
        },
        toggle() {
          toggleProgrammatically(dropdown);
        }
      };
    }
    $("body").on("click", function(event) {
      let dropdown = $(event.target).closest(".dropdown");
      let dropdownToggle = $(dropdown).find("[data-tw-toggle='dropdown']");
      let dropdownBox = $(dropdown).find(".tw-dropdown-menu").first();
      let activeDropdownBox = $(event.target).closest(".tw-dropdown-menu").first();
      let dismissButton = $(event.target).data("tw-dismiss");
      if (!$(dropdown).length && !$(activeDropdownBox).length || $(dropdownToggle).length && !$(dropdownBox).length || dismissButton == "dropdown") {
        hide();
      } else if (!$(activeDropdownBox).length) {
        show(dropdown);
      }
    });
    document.addEventListener("keydown", function(event) {
      if (event.code == "Escape") {
        hide();
      }
    });
    (function init() {
      $("[data-tw-toggle='dropdown']").each(function() {
        this["__dropdown"] = createInstance(this);
      });
      if (window.tailwind === void 0)
        window.tailwind = {};
      window.tailwind.Dropdown = {
        getInstance(el) {
          return el.__dropdown;
        },
        getOrCreateInstance(el) {
          return el.__dropdown === void 0 ? createInstance(el) : el.__dropdown;
        }
      };
    })();
  })();
})();
