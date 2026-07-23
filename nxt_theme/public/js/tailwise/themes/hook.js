(() => {
  // src/js/themes/hook.js
  (function() {
    "use strict";
    setTimeout(() => {
      $(".loading-page").addClass("loading-page--hide");
      setTimeout(() => {
        $(".loading-page").removeClass("loading-page--before-hide");
        $(".loading-page").removeClass("loading-page--hide");
      }, 300);
    }, 1e3);
    $(".side-menu__link").on("click", function() {
      if ($(this).parent().find("ul").length) {
        if ($(this).parent().find("ul").first()[0].offsetParent !== null) {
          $(this).find(".side-menu__link__chevron").removeClass("transform rotate-180");
          $(this).removeClass("side-menu__link--active-dropdown");
          $(this).parent().find("ul").first().slideUp(300, function() {
            $(this).removeClass("side-menu__link__sub-open");
          });
        } else {
          $(this).find(".side-menu__link__chevron").addClass("transform rotate-180");
          $(this).addClass("side-menu__link--active-dropdown");
          $(this).parent().find("ul").first().slideDown(300, function() {
            $(this).addClass("side-menu__link__sub-open");
          });
        }
      }
    });
    new SimpleBar($(".scrollable-ref").first()[0]);
    const compactMenu = localStorage.getItem("compactMenu");
    if (compactMenu === null || compactMenu === "true") {
      localStorage.setItem("compactMenu", "true");
      $(".side-menu").first().addClass("side-menu--collapsed");
      $(".content").first().addClass("content--compact");
    } else {
      $(".side-menu").first().removeClass("side-menu--collapsed");
      $(".content").first().removeClass("content--compact");
    }
    $(".side-menu .side-menu__content").each(function() {
      $(this).on("mouseover", function() {
        $(".side-menu").first().addClass("side-menu--on-hover");
      });
    });
    $(".side-menu .side-menu__content").each(function() {
      $(this).on("mouseleave", function() {
        $(".side-menu").first().removeClass("side-menu--on-hover");
      });
    });
    $(".toggle-compact-menu").first().on("click", function(event) {
      event.preventDefault();
      const compactMenu2 = localStorage.getItem("compactMenu");
      if (compactMenu2 === null || compactMenu2 === "true") {
        localStorage.setItem("compactMenu", "false");
        $(".side-menu").first().removeClass("side-menu--collapsed");
        $(".content").first().removeClass("content--compact");
      } else {
        localStorage.setItem("compactMenu", "true");
        $(".side-menu").first().addClass("side-menu--collapsed");
        $(".content").first().addClass("content--compact");
      }
    });
    $(".open-mobile-menu").first().on("click", function(event) {
      event.preventDefault();
      $(".side-menu").first().addClass("side-menu--mobile-menu-open");
      $(".close-mobile-menu").first().addClass("close-mobile-menu--mobile-menu-open");
    });
    $(".close-mobile-menu").first().on("click", function(event) {
      event.preventDefault();
      $(".side-menu").first().removeClass("side-menu--mobile-menu-open");
      $(".close-mobile-menu").first().removeClass("close-mobile-menu--mobile-menu-open");
    });
    $(".request-full-screen").first().on("click", function(event) {
      event.preventDefault();
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen();
      }
    });
    window.onresize = () => {
      $(".side-menu").first().removeClass("side-menu--mobile-menu-open");
      $(".close-mobile-menu").first().removeClass("close-mobile-menu--mobile-menu-open");
      if (window.innerWidth <= 1600) {
        localStorage.setItem("compactMenu", "true");
        $(".side-menu").first().addClass("side-menu--collapsed");
        $(".content").f;
      }
    };
  })();
})();
