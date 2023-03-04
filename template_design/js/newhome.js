$(document).ready(function () {
	$('#search').focus(function () {
		$('.search-box').addClass('border-searching');
		$('.search-icon').addClass('si-rotate');
	});
	$('#search').blur(function () {
		$('.search-box').removeClass('border-searching');
		$('.search-icon').removeClass('si-rotate');
	});
	$('#search').keyup(function () {
		if ($(this).val().length > 0) {
			$('.go-icon').addClass('go-in');
		} else {
			$('.go-icon').removeClass('go-in');
		}
	});
	// $('.go-icon').click(function () {
	// 	$('.search-form').submit();
	// });
});

const clearInput = () => {
	const input = document.getElementsByTagName('input')[0];
	input.value = '';
};

const clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', clearInput);

let isLoginTrue = false;
const loginStatus = document.querySelector('#homepage-login');
// const loginStatusFull = document.querySelector('#login_status_full');

async function main() {
	let res = await fetch('/is_logged_in');
	let result = await res.json();

	console.log(result);
	if (res.ok) {
		isLoginTrue = true;
		console.log('isLoginTrue', isLoginTrue);
		changeIcon();
		// changeIconFull();
	}
}
main();

function changeIcon() {
	if (isLoginTrue) {
		loginStatus.innerHTML =
			'<a id="homepage-css" class="custom-btn btn" href="/logout"> Logout </a>';
		// loginStatusFull.innerHTML = '<a class="custom-btn btn" href="/logout"> Logout </a>';
	} else {
		loginStatus.innerHTML =
			'<a id="homepage-css" class="custom-btn" href="login.html"> Login / Register </a>';
		// loginStatusFull.innerHTML =
		// 	'<a class="custom-btn btn" href="login.html"> Login / Register </a>';
	}
}
