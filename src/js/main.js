// import here !!!
import loading from './loading';


// Script Cho Tab
class Tab {
	selector;
	titleList;
	contentList;

	constructor(selector) {
		this.selector = document.querySelector(selector);
		if (this.selector) {
			this.titleList = this.selector.querySelectorAll("[toggle-for]")
			this.contentList = this.selector.querySelectorAll("[tab-id]")
			this.init();
		}
	}

	runTabWhenClicked() {
		Array.prototype.forEach.call(this.titleList, (element, index) => {
			element.addEventListener("click", e => {
				e.preventDefault();
				const tabTarget = element.attributes["toggle-for"].value;
				const targetDOM = this.selector.querySelector(`[tab-id='${tabTarget}']`);
				element.classList.add("active");
				Array.prototype.forEach.call(this.titleList, (eleClicked, eleClickedIndex) => {
					if (eleClickedIndex != index) {
						eleClicked.classList.remove("active")
					}
				});
				Array.prototype.forEach.call(this.contentList, (tabContentElement) => {
					if (tabContentElement.attributes["tab-id"].value != tabTarget) {
						tabContentElement.style.display = "none"
						tabContentElement.classList.remove("show")
					}
				});
				targetDOM.style.display = "block",
					setTimeout(() => {
						targetDOM.classList.add("show")
					}, 50);
			})
		})
	}

	activeFirstTab() {
		this.titleList[0].click();
	}

	init() {
		this.runTabWhenClicked();
		this.activeFirstTab();
	}
}

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

function checkItem() {
	$('.block-vote .list-vote').each(function() {
		let _this = $(this);
		_this.find('.item-vote').on('click', function() {
			_this.find('.item-vote').not(this).removeClass('checked')
			$(this).addClass('checked');
		})
	})
}

const checkCodeLogin = () => {
	$('body').on('click', '#btn-vote', function(e) {
		const code = document.getElementById('session-code').value;
		const url = document.getElementById('btn-vote').getAttribute('data-url');
		e.preventDefault();
		$.ajax({
			url: url,
			type: 'POST',
			data: {
				code: code
			},
			beforeSend: function(e) {
				$('.index-4 #btn-vote').attr('disabled', 'disabled')
			},
			// TEST
			error: function() {
				// $.fancybox.open({
				// 	src: '#form-vote',
				// 	type: 'inline',
				// 	opts: {
				// 		hash: false,
				// 		closeExisting: true,
				// 	}
				// })
			},
			success: function(res) {
				$.fancybox.open({
					src: '#form-vote',
					type: 'inline',
					opts: {
						hash: false,
						closeExisting: true,
					}
				})
			},
			complete: function(response) {
				$('.index-4 #btn-vote').removeAttr('disabled')
			}
		})
	})

	$('body').on('click', '#btn-submit', function(e) {
		e.preventDefault();
		const Votes = [];
		const url = document.getElementById('btn-submit').getAttribute('data-url');
		const Name = document.getElementById('Form-Name').value;
		const Identity = document.getElementById('Form-Identity').value;
		const Phone = document.getElementById('Form-Phone').value;

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
				Votes: Votes
			},
			// TEST
			error: function(err) {
				// $('btn-submit').attr('disabled', 'disabled')
				// $('#form-thank .note').html('<p>Bạn đã hết lượt bình chọn hôm nay.</p><p>Bạn có thể tiếp tục vote từ 00:00 ngày mai.</p>');
				// $.fancybox.open({
				// 	src: '#form-thank',
				// 	type: 'inline',
				// 	opts: {
				// 		hash: false,
				// 		closeExisting: true,
				// 	}
				// });
			},
			success: function(res) {
				$('btn-submit').attr('disabled', 'disabled')
				$('#form-thank .note').html(res.Messege);
				$.fancybox.open({
					src: '#form-thank',
					type: 'inline',
					opts: {
						hash: false,
						closeExisting: true,
					}
				});
			},
			complete: function() {
				$('btn-submit').removeAttr('disabled')
			}
		})
	})
}

// CHẠY KHI DOCUMENT SẴN SÀNG
document.addEventListener('DOMContentLoaded', () => {
	// LOADING
	loading();
	// WOW
	new WOW().init();
	// SVG CONTROL
	SVG();
	checkItem();
	checkCodeLogin();
	mobileMenu();
});

// CHẠY KHI WINDOWN SCROLL
window.addEventListener('scroll', () => {
	// ACTIVE HEADER WHEN SCROLL
})