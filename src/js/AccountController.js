module.exports = () => {
	var AccountController = AccountController || {};
	var auth2;
	AccountController = {
		model: {
			avatar: "",
		},
		init: function () {
			// INIT GOOGLE
			Array.from(document.querySelectorAll('.btn-google')).forEach(function (btn) {
				gapi.load('auth2', function () {
					auth2 = gapi.auth2.init({
						client_id: '111231613981-4ar5t5o0nmb5aon7f4eal155954didl4.apps.googleusercontent.com',
						cookiepolicy: 'single_host_origin',
					});
					AccountController.events.attachGGSignin(btn);
				});
			});
			// INIT FACEBOOK
			window.fbAsyncInit = function () {
				FB.init({
					appId: '415663406248992',
					cookie: true,
					xfbml: true,
					version: 'v9.0'
				});
			};

			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s);
				js.id = id;
				js.src = "https://connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));

			$(".btn-facebook").click(AccountController.events.attachFBSignin);
		},
		events: {
			// CLICK FACEBOOK
			attachFBSignin: function () {
				FB.login(function (response) {
					if (response.status === 'connected') {
						AccountController.events.facebook({
							id: response.authResponse.userID,
							token: response.authResponse.accessToken,
							name: "",
							email: "octopuzecontact@gmail.com",
							image: "",
							provider: "FACEBOOK",
						});
					} else {
						// The person is not logged into your webpage or we are unable to tell.
					}
				}, {
					scope: 'email',
					return_scopes: true
				});
			},
			// CLICK GOOGLE
			attachGGSignin(btn) {
				auth2.attachClickHandler(btn, {},
					function (googleUser) {
						var profile = googleUser.getBasicProfile();
						AccountController.events.google({
							id: profile.getId(),
							name: profile.getName(),
							email: profile.getEmail(),
							token: googleUser.getAuthResponse().id_token,
							image: profile.getImageUrl(),
							provider: "",
						});
					},
					function (error) {
						console.log(JSON.stringify(error, undefined, 2));
					});
			},
			// INFO USER GOOGLE
			google: function (googleUser) {
				googleUser.provider = "GOOGLE";
				if (googleUser != null) {
					var auth2 = gapi.auth2.getAuthInstance();
					auth2.signOut().then(function () {
						$.ajax({
							url: "/external-login",
							type: "POST",
							data: JSON.stringify(googleUser),
							contentType: "application/json",
							success: function (response) {
								alert(response.Message);
								if (response.Code == 200) {
									window.location.reload();
								}
							},
						});
					});
				}
			},
			// INFO USER GOOGLE
			facebook: function (user) {
				FB.api('/' + user.id + '/picture', 'GET', {
					"redirect": "false"
				}, function (response) {
					if (response && !response.error) {
						user.image = response.data.url;
						FB.api('/me', function (response) {
							if (response && !response.error) {
								user.name = response.name;
								$.ajax({
									url: "/external-login",
									type: "POST",
									data: JSON.stringify(user),
									contentType: "application/json",
									success: function (response) {
										alert(response.Message);
										if (response.Code == 200) {
											window.location.reload();
										}
									},
								});
							}
						})
					}
				});
			}
		}
	}

	AccountController.init();
}