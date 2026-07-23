(() => {
  // node_modules/@left4code/tw-starter/dist/js/modal.js
  (function() {
    function getHighestZindex() {
      let zIndex = 9999;
      $(".modal").each(function() {
        if ($(this).css("z-index") !== "auto" && $(this).css("z-index") > zIndex) {
          zIndex = parseInt($(this).css("z-index"));
        }
      });
      return zIndex;
    }
    function getScrollbarWidth(el) {
      return window.innerWidth - $(el)[0].clientWidth;
    }
    function show(el) {
      if (!$("[data-modal-replacer='" + $(el).attr("id") + "']").length) {
        $(
          '<div data-modal-replacer="' + $(el).attr("id") + '"></div>'
        ).insertAfter(el);
        $(el).css({
          "margin-top": 0,
          "margin-left": 0
        });
        $(el).attr("aria-hidden", false).appendTo("body");
        setTimeout(() => {
          $(el).addClass("show").css("z-index", getHighestZindex() + 1);
          const event2 = new Event("shown.tw.modal");
          $(el)[0].dispatchEvent(event2);
        }, 200);
        $("body").css(
          "padding-right",
          parseInt($("body").css("padding-right")) + getScrollbarWidth("html") + "px"
        ).addClass("overflow-y-hidden");
        $(".modal").removeClass("overflow-y-auto").css("padding-left", "0px");
        $(el).addClass("overflow-y-auto").css("padding-left", getScrollbarWidth(el) + "px").addClass($(".modal.show").length ? "modal-overlap" : "");
        const event = new Event("show.tw.modal");
        $(el)[0].dispatchEvent(event);
      }
    }
    function hide(el) {
      if ($(el).hasClass("modal") && $(el).hasClass("show")) {
        let transitionDuration = parseFloat($(el).css("transition-duration").split(",")[1]) * 1e3;
        $(el).attr("aria-hidden", true).removeClass("show");
        setTimeout(() => {
          $(el).removeAttr("style").removeClass("modal-overlap").removeClass("overflow-y-auto");
          $(".modal").each(function() {
            if (parseInt($(this).css("z-index")) === getHighestZindex()) {
              $(this).addClass("overflow-y-auto").css("padding-left", getScrollbarWidth(this) + "px");
            }
          });
          if (getHighestZindex() == 9999) {
            $("body").removeClass("overflow-y-hidden").css("padding-right", "");
          }
          $('[data-modal-replacer="' + $(el).attr("id") + '"]').replaceWith(el);
          const event2 = new Event("hidden.tw.modal");
          $(el)[0].dispatchEvent(event2);
        }, transitionDuration);
        const event = new Event("hide.tw.modal");
        $(el)[0].dispatchEvent(event);
      }
    }
    function toggle(el) {
      if ($(el).hasClass("modal") && $(el).hasClass("show")) {
        hide(el);
      } else {
        show(el);
      }
    }
    function createInstance(el) {
      return {
        show() {
          show(el);
        },
        hide() {
          hide(el);
        },
        toggle() {
          toggle(el);
        }
      };
    }
    $("body").on("click", '[data-tw-toggle="modal"]', function() {
      show($(this).attr("data-tw-target"));
    });
    $("body").on("click", (event) => {
      if ($(event.target).hasClass("modal") && $(event.target).hasClass("show")) {
        if ($(event.target).data("tw-backdrop") !== "static") {
          hide(event.target);
        } else {
          $(event.target).addClass("modal-static");
          setTimeout(() => {
            $(event.target).removeClass("modal-static");
          }, 600);
        }
      }
    });
    $("body").on("click", '[data-tw-dismiss="modal"]', function() {
      let modal = $(this).closest(".modal")[0];
      hide(modal);
    });
    document.addEventListener("keydown", (event) => {
      if (event.code == "Escape") {
        let el = $(".modal.show").last();
        if ($(el).hasClass("modal") && $(el).hasClass("show") && ($(el).data("tw-keyboard") === void 0 || $(el).data("tw-keyboard") !== "false")) {
          if ($(el).data("tw-backdrop") !== "static") {
            hide(el);
          } else {
            $(el).addClass("modal-static");
            setTimeout(() => {
              $(el).removeClass("modal-static");
            }, 600);
          }
        }
      }
    });
    (function init() {
      $(".modal").each(function() {
        this["__modal"] = createInstance(this);
      });
      if (window.tailwind === void 0)
        window.tailwind = {};
      window.tailwind.Modal = {
        getInstance(el) {
          return el.__modal;
        },
        getOrCreateInstance(el) {
          return el.__modal === void 0 ? createInstance(el) : el.__modal;
        }
      };
    })();
  })();
})();
