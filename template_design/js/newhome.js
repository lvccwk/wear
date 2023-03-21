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
});

const clearInput = () => {
	const input = document.getElementsByTagName('input')[0];
	input.value = '';
};

const clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', clearInput);

let isLoginTrue = false;
const loginStatus = document.querySelector('#homepage-login');

async function main() {
	let res = await fetch('/is_logged_in');
	let result = await res.json();

	if (res.ok) {
		isLoginTrue = true;

		changeIcon();
	}
}
main();

function changeIcon() {
	if (isLoginTrue) {
		loginStatus.innerHTML =
			'<a id="homepage-btn1" class="custom-btn" href="searchresult.html"> My Creations </a> <a id="homepage-css" class="custom-btn btn" href="/logout"> Logout </a>';
	} else {
		loginStatus.innerHTML =
			'<a id="homepage-btn1" class="custom-btn" href="searchresult.html"> My Creations </a> <a id="homepage-css" class="custom-btn" href="login.html"> Login / Register </a>';
	}
}
