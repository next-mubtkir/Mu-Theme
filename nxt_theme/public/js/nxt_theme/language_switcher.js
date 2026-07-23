console.log("language switcher loaded");

$(document).ready(function () {
    const languageSwitcher = $(".language-switcher");

    if (languageSwitcher.length) {
      languageSwitcher.on("click", function (event) {
          const selectedLanguage = $(this).data("lang_code");
          $(".language_switcher").hide();
          change_language(selectedLanguage);
      });    
    }

    $(".user-manu").on("click", function () {
        $(".user_manu").hide();
    });
});

const change_language = async (lang_code) => {
  try {
    // Update the user's default language
    const userResponse = await frappe.call({
      method: "frappe.client.set_value",
      args: {
        doctype: "User",
        name: frappe.session.user,
        fieldname: "language",
        value: lang_code,
      },
      freaze: true,
      message: __("Updating user language..."),
    });

    // Reload the page to apply the new language
    if (!userResponse.message) {
      frappe.show_alert({
        message: __("Failed to update user language"),
        indicator: "red",
      });
      return;
    }

    frappe.show_alert({
      message: __("User language updated successfully."),
      indicator: "green",
    });

    frappe.ui.toolbar.clear_cache();
  } catch (error) {
    console.error("Error changing language:", error);
  }
};