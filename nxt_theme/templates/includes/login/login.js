// login.js
// don't remove this line (used in test)

window.disable_signup = {{ disable_signup and "true" or "false" }};
window.show_footer_on_login = {{ show_footer_on_login and "true" or "false" }};

window.login = {};
window.verify = {};

const currentLang = localStorage.getItem('selectedLang') || 'en';

const messages = {
	en: {
		verifying: "Verifying...",
		invalid_login: "Invalid Login. Try again.",
		oops: "Oops! Something went wrong.",
		user_not_exist: "User does not exist.",
		something_wrong: "Something went wrong.",
		success: "Success",
		not_valid_user: "Not a valid user",
		not_allowed: "Not Allowed",
		not_allowed_disabled: "Not Allowed: Disabled User",
		instructions_emailed: "Instructions Emailed",
		login_token_required: "Login token required",
		otp_instructions: "Enter Code displayed in OTP App.",
		otp_not_setup: "OTP setup using OTP App was not completed. Please contact Administrator.",
		sms_failed: "SMS was not sent. Please contact Administrator.",
		email_failed: "Verification code email not sent. Please contact Administrator.",
		valid_email_required: "Valid email and name required",
		valid_login_required: "Valid Login id required.",
		hide: "Hide",
		show: "Show",
		verification: "Verification",
		verify: "Verify",
		verification_code: "Verification Code"
	},
ar: {
		verifying: "جارٍ التحقق...",
		invalid_login: "تسجيل دخول غير صالح. حاول مرة أخرى.",
		oops: "عذراً! حدث خطأ ما.",
		user_not_exist: "المستخدم غير موجود.",
		something_wrong: "حدث خطأ ما.",
		success: "نجاح",
		not_valid_user: "مستخدم غير صحيح",
		not_allowed: "غير مسموح",
		not_allowed_disabled: "غير مسموح: المستخدم معطل",
		instructions_emailed: "تم إرسال التعليمات عبر البريد الإلكتروني",
		login_token_required: "رمز الدخول مطلوب",
		otp_instructions: "أدخل الرمز المعروض في تطبيق OTP.",
		otp_not_setup: "لم يكتمل إعداد OTP باستخدام التطبيق. يرجى الاتصال بالمسؤول.",
		sms_failed: "لم يتم إرسال الرسالة النصية. يرجى الاتصال بالمسؤول.",
		email_failed: "لم يتم إرسال رمز التحقق عبر البريد الإلكتروني. يرجى الاتصال بالمسؤول.",
		valid_email_required: "مطلوب البريد الإلكتروني والاسم",
		valid_login_required: "مطلوب معرف تسجيل الدخول صالح.",
		hide: "إخفاء",
		show: "عرض",
		verification: "التحقق",
		verify: "تحقق",
		verification_code: "رمز التحقق"
	}
};

function t(key) {
	const lang = localStorage.getItem('selectedLang') || 'en';
	return messages[lang][key] || key;
}

login.bind_events = function () {
	$(window).on("hashchange", function () {
		login.route();
	});

	$(".form-login").on("submit", function (event) {
		event.preventDefault();
		var args = {};
		args.cmd = "login";
		args.usr = frappe.utils.xss_sanitise(($("#login_email").val() || "").trim());
		args.pwd = $("#login_password").val();
		if (!args.usr || !args.pwd) {
			frappe.msgprint("{{ _('Both login and password required') | striptags | e }}");
			return false;
		}
		login.call(args, null, "/login");
		return false;
	});

	$(".form-signup").on("submit", function (event) {
		event.preventDefault();
		var args = {};
		args.cmd = "frappe.core.doctype.user.user.sign_up";
		args.email = frappe.utils.xss_sanitise(($("#signup_email").val() || "").trim());
		args.redirect_to = frappe.utils.sanitise_redirect(frappe.utils.get_url_arg("redirect-to"));
		args.full_name = frappe.utils.xss_sanitise(($("#signup_fullname").val() || "").trim());
		if (!args.email || !validate_email(args.email) || !args.full_name) {
			login.set_status(t('valid_email_required'), 'red');
			return false;
		}
		login.call(args);
		return false;
	});

	$(".form-forgot").on("submit", function (event) {
		event.preventDefault();
		var args = {};
		args.cmd = "frappe.core.doctype.user.user.reset_password";
		args.user = frappe.utils.xss_sanitise(($("#forgot_email").val() || "").trim());
		if (!args.user) {
			login.set_status(t('valid_login_required'), 'red');
			return false;
		}
		login.call(args);
		return false;
	});

	$(".form-login-with-email-link").on("submit", function (event) {
		event.preventDefault();
		var args = {};
		args.cmd = "frappe.www.login.send_login_link";
		args.email = frappe.utils.xss_sanitise(($("#login_with_email_link_email").val() || "").trim());
		if (!args.email) {
			login.set_status(t('valid_login_required'), 'red');
			return false;
		}
		login.call(args).then(() => {
			login.set_status(t('instructions_emailed'), 'blue');
			$("#login_with_email_link_email").val("");
		}).catch(() => {
			login.set_status(t('email_failed'), 'blue');
		});
		return false;
	});

	$(".toggle-password").click(function () {
		var input = $($(this).attr("toggle"));
		if (input.attr("type") == "password") {
			input.attr("type", "text");
			$(this).text(t('hide'));
		} else {
			input.attr("type", "password");
			$(this).text(t('show'));
		}
	});

	{% if ldap_settings and ldap_settings.enabled %}
	$(".btn-ldap-login").on("click", function () {
		var args = {};
		args.cmd = "{{ ldap_settings.method }}";
		args.usr = frappe.utils.xss_sanitise(($("#login_email").val() || "").trim());
		args.pwd = $("#login_password").val();
		if (!args.usr || !args.pwd) {
			login.set_status(t('valid_login_required'), 'red');
			return false;
		}
		login.call(args);
		return false;
	});
	{% endif %}
};

login.route = function () {
	var route = window.location.hash.slice(1);
	if (!route) route = "login";
	route = route.replaceAll("-", "_");
	login[route]();
};

login.reset_sections = function (hide) {
	if (hide || hide === undefined) {
		$("section.for-login").toggle(false);
		$("section.for-email-login").toggle(false);
		$("section.for-forgot").toggle(false);
		$("section.for-login-with-email-link").toggle(false);
		$("section.for-signup").toggle(false);
	}
	$('section:not(.signup-disabled) .indicator').each(function () {
		$(this).removeClass().addClass('indicator').addClass('blue')
			.text($(this).attr('data-text'));
	});
};

login.login = function () {
	login.reset_sections();
	$(".for-login").toggle(true);
};

login.email = function () {
	login.reset_sections();
	$(".for-email-login").toggle(true);
	$("#login_email").focus();
};

login.steptwo = function () {
	login.reset_sections();
	$(".for-login").toggle(true);
	$("#login_email").focus();
};

login.forgot = function () {
	login.reset_sections();
	if ($("#login_email").val()) {
		$("#forgot_email").val($("#login_email").val());
	}
	$(".for-forgot").toggle(true);
	$("#forgot_email").focus();
};

login.login_with_email_link = function () {
	login.reset_sections();
	if ($("#login_email").val()) {
		$("#login_with_email_link_email").val($("#login_email").val());
	}
	$(".for-login-with-email-link").toggle(true);
	$("#login_with_email_link_email").focus();
};

login.signup = function () {
	login.reset_sections();
	$(".for-signup").toggle(true);
	$("#signup_fullname").focus();
};

login.call = function (args, callback, url="/") {
	login.set_status(t('verifying'), 'blue');
	return frappe.call({
		type: "POST",
		url: url,
		args: args,
		callback: callback,
		freeze: true,
		statusCode: login.login_handlers
	});
};

login.set_status = function (message, color) {
	$('section:visible .btn-primary').text(message);
	if (color == "red") {
		$('section:visible .page-card-body').addClass("invalid");
	}
};

login.set_invalid = function (message) {
	$(".login-content.page-card").addClass('invalid-login');
	setTimeout(() => {
		$(".login-content.page-card").removeClass('invalid-login');
	}, 500);
	login.set_status(t(message), 'red');
	$("#login_password").focus();
};

login.login_handlers = (function () {
	var get_error_handler = function (default_message) {
		return function (xhr, data) {
			if (xhr.responseJSON) {
				data = xhr.responseJSON;
			}
			var message = default_message;
			if (data._server_messages) {
				message = ($.map(JSON.parse(data._server_messages || '[]'), function (v) {
					try {
						return JSON.parse(v).message;
					} catch (e) {
						return v;
					}
				}) || []).join('<br>') || default_message;
			}
			login.set_invalid(t(message));
		};
	};
	var login_handlers = {
		200: function (data) {
			if (data.message == 'Logged In') {
				login.set_status({{ _("Success") | tojson }}, 'green');
				document.body.innerHTML = `{% include "templates/includes/splash_screen.html" %}`;
				window.location.href = frappe.utils.sanitise_redirect(frappe.utils.get_url_arg("redirect-to")) || data.home_page;
			} else if (data.message == 'Password Reset') {
				window.location.href = frappe.utils.sanitise_redirect(data.redirect_to);
			} else if (data.message == "No App") {
				login.set_status(t('success'), 'green');
				if (localStorage) {
					var last_visited =
						localStorage.getItem("last_visited")
						|| frappe.utils.sanitise_redirect(frappe.utils.get_url_arg("redirect-to"));
					localStorage.removeItem("last_visited");
				}
				if (data.redirect_to) {
					window.location.href = frappe.utils.sanitise_redirect(data.redirect_to);
				}
				if (last_visited && last_visited != "/login") {
					window.location.href = last_visited;
				} else {
					window.location.href = data.home_page;
				}
			} else if (window.location.hash === '#forgot') {
				if (data.message === 'not found') {
					login.set_status(t('not_valid_user'), 'red');
				} else if (data.message == 'not allowed') {
					login.set_status(t('not_allowed'), 'red');
				} else if (data.message == 'disabled') {
					login.set_status(t('not_allowed_disabled'), 'red');
				} else {
					login.set_status(t('instructions_emailed'), 'green');
				}
			} else if (window.location.hash === '#signup') {
				if (cint(data.message[0]) == 0) {
					login.set_status(t(data.message[1]), 'red');
				} else {
					login.set_status(t('success'), 'green');
					frappe.msgprint(t(data.message[1]));
				}
			}
			if (data.verification && data.message != 'Logged In') {
				login.set_status(t('success'), 'green');
				document.cookie = "tmp_id=" + data.tmp_id;
				if (data.verification.method == 'OTP App') {
					continue_otp_app(data.verification.setup, data.verification.qrcode);
				} else if (data.verification.method == 'SMS') {
					continue_sms(data.verification.setup, data.verification.prompt);
				} else if (data.verification.method == 'Email') {
					continue_email(data.verification.setup, data.verification.prompt);
				}
			}
		},
		401: function (xhr, data) {
			get_error_handler(t('invalid_login'))(xhr, data);
		},
		417: function (xhr, data) {
			get_error_handler(t('oops'))(xhr, data);
		},
		404: function (xhr, data) {
			get_error_handler(t('user_not_exist'))(xhr, data);
		},
		500: function (xhr, data) {
			get_error_handler(t('something_wrong'))(xhr, data);
		}
	};
	return login_handlers;
})();

frappe.ready(function () {
	login.bind_events();
	if (!window.location.hash) {
		window.location.hash = "#login";
	} else {
		$(window).trigger("hashchange");
	}
	if (window.show_footer_on_login) {
		$("body .web-footer").show();
	}
	$(".form-signup, .form-forgot, .form-login-with-email-link").removeClass("hide");
	$(document).trigger('login_rendered');
});

var verify_token = function (event) {
	$(".form-verify").on("submit", function (eventx) {
		eventx.preventDefault();
		var args = {};
		args.cmd = "login";
		args.otp = $("#login_token").val();
		args.tmp_id = frappe.get_cookie('tmp_id');
		if (!args.otp) {
			frappe.msgprint("{{ _('Login token required') | striptags | e }}");
			return false;
		}
		login.call(args);
		return false;
	});
};

var request_otp = function () {
	$('.login-content').empty();
	$('.login-content:visible').append(
		`<div id="twofactor_div">
			<form class="form-verify">
				<div class="page-card-head p-0">
					<span class="indicator blue" data-text="Verification">{{ _("Verification") | e }}</span>
				</div>
				<div id="otp_div"></div>
				<input type="text" id="login_token" autocomplete="off" class="form-control" placeholder="{{ _("Verification Code") | e }}" required="">
				<button class="btn btn-sm btn-primary btn-block mt-3" id="verify_token">{{ _("Verify") | e }}</button>
			</form>
		</div>`
	);
	verify_token();
	$("#login_token").get(0)?.focus();
};

var continue_otp_app = function (setup, qrcode) {
	request_otp();
	var qrcode_div = $('<div class="text-muted" style="padding-bottom: 15px;"></div>');
	if (setup) {
		direction = $('<div>').attr('id', 'qr_info').text(t('otp_instructions'));
		qrcode_div.append(direction);
		$('#otp_div').prepend(qrcode_div);
	} else {
		direction = $('<div>').attr('id', 'qr_info').text(t('otp_not_setup'));
		qrcode_div.append(direction);
		$('#otp_div').prepend(qrcode_div);
	}
};

var continue_sms = function (setup, prompt) {
	request_otp();
	var sms_div = $('<div class="text-muted" style="padding-bottom: 15px;"></div>');
	if (setup) {
		sms_div.append(prompt);
		$('#otp_div').prepend(sms_div);
	} else {
		direction = $('<div>').attr('id', 'qr_info').html(prompt || t('sms_failed'));
		sms_div.append(direction);
		$('#otp_div').prepend(sms_div);
	}
};

var continue_email = function (setup, prompt) {
	request_otp();
	var email_div = $('<div class="text-muted" style="padding-bottom: 15px;"></div>');
	if (setup) {
		email_div.append(prompt);
		$('#otp_div').prepend(email_div);
	} else {
		var direction = $('<div>').attr('id', 'qr_info').html(prompt || t('email_failed'));
		email_div.append(direction);
		$('#otp_div').prepend(email_div);
	}
};

login.route();
