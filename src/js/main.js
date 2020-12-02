// import here !!!
import loading from './loading';
import AccountController from './AccountController';

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
	let checkLogin = $('#checkLogin').val();
	if(checkLogin == "false") {
		$(".list-nav .avatar").on("click" , function(e) {
			$.fancybox.open({
				src: "#auto-login",
				type: "inline"
			})
		})
	}
	
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
		let checkLogin = $('#checkLogin').val();
		if (voteCount < 5) {
			const warning = $("#form-thank .title").attr("data-warning");
			$("#form-thank .title p").text(`${warning}`)
			
			$.fancybox.open({
				src: '#form-thank',
				type: 'inline',
				opts: {
					hash: false,
					closeExisting: true,
					
				},
				
			})
			
		}
		if (voteCount === 5 && checkLogin =='true') {
			const url = document.getElementById('btn-vote').getAttribute('data-url');
			// if(checVote == "true") {
			// 	$("#btn-submit").trigger("click");
			// 	const warning = $("#form-thank .title").attr("data-thank");
			// 	$("#form-thank .title p").text(`${warning}`)
			// 	$.fancybox.open({
			// 		src: '#form-thank',
			// 		type: 'inline',
			// 		opts: {
			// 			hash: false,
			// 			closeExisting: true,
			// 		}
			// 	})
			// 	return;
			// }
		
			$.ajax({
				url: url,
				type: 'POST',
				data: {},
				beforeSend: function(e) {
					$('.index-4 #btn-vote').attr('disabled', 'disabled')
				},
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
						$('#name').val('ABC');
						$('#phone').val('0987654321');
						$('#cmnd').val('0987654321');
						$('#form-vote #btn-submit').trigger('click');
					} else {
						// const warning = $("#form-thank .title").attr("data-thank");
						$("#form-thank .title").html(`${res.Message}`)
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
		} else if (checkLogin == "false") {
			$.fancybox.open({
				src: '#auto-login',
				type: 'inline',
				opts: {
					hash: false,
					closeExisting: true,
				}
			})
		} 
		// else {
		// 	$('#form-thank .desc').html('<p>Bạn chưa chọn bất kì hạng mục nào</p><p>Hoặc bạn chưa chọn đủ các hạng mục</p><p></p><p></p>');
		// 	$.fancybox.open({
		// 		src: '#form-thank',
		// 		type: 'inline',
		// 		opts: {
		// 			hash: false,
		// 			closeExisting: true,
		// 		}
		// 	});
		// }
	})

	$('body').on('click', '#btn-submit', function(e) {
		e.preventDefault();
		const Votes = [];
		const url = document.getElementById('btn-submit').getAttribute('data-url');
		const Name = $('#name').val();
		const Phone = $('#phone').val();
		const Identity = $('#cmnd').val();


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
				Votes: Votes,
			},
			success: function(res) {
				$('#btn-submit').attr('disabled', 'disabled');
				if(res.Code == 200) {
					$("#form-thank .title").html(`${res.Message}`)
					$.fancybox.open({
						src: '#form-thank',
						type: 'inline',
						opts: {
							hash: false,
							closeExisting: true,
						}
					});
				} else {
					// const warning = $("#form-thank .title").attr("data-thank");
						$("#form-thank .title").html(`${res.Message}`)
						$.fancybox.open({
							src: '#form-thank',
							type: 'inline',
							opts: {
								hash: false,
								closeExisting: true,
							}
						});
				}
				$('.item-vote').removeClass('checked');

			},
			complete: function() {
				$('#btn-submit').removeAttr('disabled')
			}
		})
	})
}

function scrollToSection() {
    $('[data-scroll-to]').on('click', function(e) {
        e.preventDefault();
        const scrollToNumber = $(this).attr('data-scroll-to');
        $('html,body').animate({
                scrollTop: $(`[data-scroll-id="${scrollToNumber}"]`).offset().top 
            },
            1200
        );
        // $('header .nav-item').removeClass('active');
        // $('#overlay').removeClass('active');
        // $('body').removeClass('disabled');

        // const activeSectionWhenScroll = () => {
        //     $('[data-scroll-id]').each(function() {
        //         if (
        //             this.getBoundingClientRect().top < 2 * $('header').height() &&
        //             this.getBoundingClientRect().top > 0
        //         ) {
        //             const toId = $(this).attr('data-scroll-id');
        //             $(`[data-scroll-to]`).removeClass('active');
        //             $(`[data-scroll-to="${toId}"]`).addClass('active');

        //         }
        //     });
        // }
        // activeSectionWhenScroll();
        // $(window).on('scroll', function() {
        //     activeSectionWhenScroll();
        // });
    });
}

function autoLogin() {

	let checkLogin = $('#checkLogin').val();

	if (checkLogin == 'false') {
		$.fancybox.open({
			src: '#auto-login',
			type: 'inline',
			opts: {
				hash: false,
				closeExisting: true,
			}
		});

		// let closed = 1;
		// let flat = 5;
		// let reload = true;
		// const url_redirect = $('#auto-login').attr('url-redirect');

		// $('#auto-login button[data-fancybox-close]').on('click', function() {
		// 	closed = 2;
		// })

		// setInterval(() => {
		// 	flat--
		// 	if (flat < 0) {
		// 		flat = 0
		// 	}
		// 	$('#auto-login .count').html(flat);

		// 	if (flat === 0 && closed === 1) {
		// 		if (reload) {
		// 			window.location = url_redirect;
		// 			reload = !reload;
		// 		}
		// 	}
		// }, 1000);
	}
}

const imageMap = () => {}

const bannerSwiper = () => {
	// Init Youtube Video API
	// var script = document.createElement('script');
	// script.onload = function() {
	// 	console.log("Script loaded and ready");
	// };
	// if(document.querySelector(".youtube-video")) {
	// 	script.src = `https://www.youtube.com/iframe_api`;
	// 	script.setAttribute("async", "");
	// 	script.setAttribute("defer", "");
	// 	document.getElementsByTagName('body')[0].appendChild(script);
	// }

	

	const youtuID = document.querySelector(".youtube-video").getAttribute("data-youtube-id");
	var player;
	var YT;

	window.YT.ready(function() {
		player = new window.YT.Player('VYT', {
			videoId: `${youtuID}`,
			playerVars: {
				// autoplay: 1,
				controls: 0,
				origin: `${window.location.origin}`
			},
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	})
	function onPlayerReady(event) {
		// event.target.playVideo();
	}
	function onPlayerStateChange(event) {
		if (event.data == window.YT.PlayerState.PLAYING ) {
			$(".bg-youtube-video").removeClass("show")
		} else {
			$(".bg-youtube-video").addClass("show")
		}
	}
	$(".youtube-video").on("click" , function() {
		player.stopVideo();
	})
	$(".bg-youtube-video").on("click" , function() {
		player.playVideo();
	})
		const swiper = new Swiper(".index-1 .swiper-container" , {
			slidesPerView: 1,
			loop: true,
			// effect: 'fade',
			autoplay: {
				delay: 5000
			},
			navigation: {
				nextEl: '.index-1 .swiper-button-next',
				prevEl: '.index-1 .swiper-button-prev',
			},
			pagination: {
				el: '.index-1 .swiper-pagination',
				clickable: true
			},
			on: {
				slideChange: function () {
					const activeslide = document.querySelector(".index-1 .swiper-container .swiper-slide-next")
					if(activeslide.querySelector(".youtube-video")) {
						player.playVideo();
					}
					// if(!activeslide.querySelector(".youtube-video")) {
					// 	player.stopVideo();
					// }
				},
			  },
		})
		
}

const dropLine = () => {
	document.querySelectorAll(".block-vote .title p").forEach(item => {
		const text = item.outerHTML;
		const newText = text.replace("." , "</br>");
		item.outerHTML = newText
	})
}
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
		AccountController();
		imageMap();
		bannerSwiper();
		scrollToSection();
		dropLine();
		// WOW
		new WOW().init();
	});
});