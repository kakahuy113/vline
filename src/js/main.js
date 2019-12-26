// import here !!!
import loading from './loading';

// CONTROL SVG
const SVG = () => {
	jQuery('img.svg').each(function() {
		var $img = jQuery(this);
		var imgID = $img.attr('id');
		var imgClass = $img.attr('class');
		var imgURL = $img.attr('src');

		jQuery.get(imgURL, function(data) {
			// Get the SVG tag, ignore the rest
			var $svg = jQuery(data).find('svg');

			// Add replaced image's ID to the new SVG
			if (typeof imgID !== 'undefined') {
				$svg = $svg.attr('id', imgID);
			}
			// Add replaced image's classes to the new SVG
			if (typeof imgClass !== 'undefined') {
				$svg = $svg.attr('class', imgClass + ' replaced-svg');
			}

			// Remove any invalid XML tags as per http://validator.w3.org
			$svg = $svg.removeAttr('xmlns:a');

			// Check if the viewport is set, if the viewport is not set the SVG wont't scale.
			if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
				$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
			}

			// Replace image with new SVG
			$img.replaceWith($svg);

		}, 'xml');
	});
}

function mobileMenu() {
	$('.button-mobile').on('click', function() {
		$(this).toggleClass('active');
		$(this).parents('header').toggleClass('active');
		$('body').toggleClass('disabled');
	});
}

var flat = 0;

function checkItem() {
	$('.block-vote .list-vote').each(function() {

		let _this = $(this);

		_this.find('.item-vote').on('click', function() {

			_this.find('.item-vote').not(this).removeClass('checked')
			$(this).addClass('checked');

			$('.item-vote').each(function() {
				if ($(this).hasClass('checked')) {
					flat++;
				}
			})
		});
	})
}

const checkCodeLogin = () => {
	$('body').on('click', '#btn-vote', function(e) {
		// LẤY SỐ LƯỢNG ITEM ĐÃ ĐƯỢC CHECK
		const voteCount = $('.block-vote .list-vote .item-vote.checked').length;
		if (voteCount === 6) {
			const url = document.getElementById('btn-vote').getAttribute('data-url');
			$.ajax({
				url: url,
				type: 'POST',
				data: {},
				beforeSend: function(e) {
					$('.index-4 #btn-vote').attr('disabled', 'disabled')
				},
				// TEST
				// error: function() {
				// 	let resCode = 202;
				// 	let resMessege = '<p>Bạn chưa đăng nhập.</p><p>Bạn vui lòng đăng nhập để tham gia sự kiện</p><p></p><p></p>';
				// 	if (resCode === 200) {
				// 		$.fancybox.open({
				// 			src: '#form-vote',
				// 			type: 'inline',
				// 			opts: {
				// 				hash: false,
				// 				closeExisting: true,
				// 			}
				// 		})
				// 	} else if (resCode === 202) {

				// 		$('#Form-Name').val('ABC');
				// 		$('#Form-Identity').val('123456');
				// 		$('#Form-Phone').val('0987654321');
				// 		$('#Form-Email').val('a@abc.com');
				// 		$('#form-vote #btn-submit').trigger('click');

				// 	} else {
				// 		$('#form-thank .desc').html(resMessege);
				// 		$.fancybox.open({
				// 			src: '#form-thank',
				// 			type: 'inline',
				// 			opts: {
				// 				hash: false,
				// 				closeExisting: true,
				// 			}
				// 		});
				// 	}
				// },
				success: function(res) {
					if (res.Code === 200) {
						$.fancybox.open({
							src: '#form-vote',
							type: 'inline',
							opts: {
								hash: false,
								closeExisting: true,
							}
						})
					} else if (res.Code === 202) {
						$('#Form-Name').val('ABC');
						$('#Form-Identity').val('123456');
						$('#Form-Phone').val('0987654321');
						$('#Form-Email').val('a@abc.com');
						$('#form-vote #btn-submit').trigger('click');
					} else {
						$('#form-thank .desc').html(res.Messege);
						$.fancybox.open({
							src: '#form-thank',
							type: 'inline',
							opts: {
								hash: false,
								closeExisting: true,
							}
						});
					}
				},
				complete: function(response) {
					$('.index-4 #btn-vote').removeAttr('disabled')
				}
			})
		} else {
			$('#form-thank .desc').html('<p>Bạn chưa chọn bất kì hạng mục nào</p><p>Hoặc bạn chưa chọn đủ các hạng mục</p><p></p><p></p>');
			$.fancybox.open({
				src: '#form-thank',
				type: 'inline',
				opts: {
					hash: false,
					closeExisting: true,
				}
			});
		}
	})

	$('body').on('click', '#btn-submit', function(e) {
		const Votes = [];
		const url = document.getElementById('btn-submit').getAttribute('data-url');
		const Name = $('#Form-Name').val();
		const Identity = $('#Form-Identity').val();
		const Phone = $('#Form-Phone').val();
		const Email = $('#Form-Email').val();

		$('.block-vote .list-vote').each(function() {
			let itemChecked = $(this).find('.item-vote.checked').attr('data-value');
			Votes.push(itemChecked)
		})

		$.ajax({
			url: url,
			type: 'POST',
			data: {
				Name: Name,
				Identity: Identity,
				Phone: Phone,
				Email: Email,
				Votes: Votes,
			},
			// TEST
			// error: function(err) {
			// 	let resCode = 200;
			// 	let resMessage = "Sai rồi"
			// 	if (resCode === 200) {
			// 		$('#form-thank .desc').html('<p>CẢM ƠN BẠN ĐÃ THAM GIA BÌNH CHỌN</p><p>CHO THẦN TƯỢNG CỦA MÌNH TẠI VLIVE AWARDS</p><p>Bạn đã hết lượt bình chọn hôm nay.</p><p>Bạn có thể tiếp tục vote từ 00:00 ngày mai.</p>');
			// 		$.fancybox.open({
			// 			src: '#form-thank',
			// 			type: 'inline',
			// 			opts: {
			// 				hash: false,
			// 				closeExisting: true,
			// 			}
			// 		});
			// 	} else {
			// 		alert(resMessage)
			// 	}
			// },
			success: function(res) {
				$('#btn-submit').attr('disabled', 'disabled');
				$('#form-thank .desc').html(res.Message);
				$.fancybox.open({
					src: '#form-thank',
					type: 'inline',
					opts: {
						hash: false,
						closeExisting: true,
					}
				});
				$('.item-vote').removeClass('checked');

			},
			complete: function() {
				$('#btn-submit').removeAttr('disabled')
			}
		})
	})
}

function autoLogin() {

	let checkLogin = $('#checkLogin').val();

	if (checkLogin == 'false') {
		$('#form-thank .desc').html('<p>Vui lòng đăng nhập để bình chọn</p>')
		$.fancybox.open({
			src: '#auto-login',
			type: 'inline',
			opts: {
				hash: false,
				closeExisting: true,
			}
		});

		let closed = 1;
		let flat = 5;
		let reload = true;
		const url_redirect = $('#auto-login').attr('url-redirect');

		$('#auto-login button[data-fancybox-close]').on('click', function() {
			closed = 2;
		})

		setInterval(() => {
			flat--
			if (flat < 0) {
				flat = 0
			}
			$('#auto-login .count').html(flat);

			if (flat === 0 && closed === 1) {
				if (reload) {
					window.location = url_redirect;
					reload = !reload;
				}
			}
		}, 1000);
	}
}

const imageMap = () => {}

// CHẠY KHI DOCUMENT SẴN SÀNG
document.addEventListener('DOMContentLoaded', () => {
	$('map').imageMapResize();
	// LOADING
	loading().then(() => {
		// SVG CONTROL
		SVG();
		checkItem();
		mobileMenu();
		checkCodeLogin();
		autoLogin();
		imageMap();
		// WOW
		new WOW().init();
	});
});