let addToCartButton = document.querySelector('.addToCart_btn');
addToCartButton.addEventListener('click', (e) => {
	e.preventDefault();
	addToCart();
});

// add to cart
async function addToCart() {
	let img = document.querySelector('.newImageForm .newImage');

	let currentPath = window.location.href;
	let relativePath = '';
	let equal = true;
	for (x = 0; x < img.src.length; x++) {
		if (currentPath[x] !== img.src[x]) {
			equal = false;
		}
		if (equal === false) {
			relativePath += img.src[x];
		}
	}

	let data = {
		image: relativePath
	};

	let res = await fetch(`/cart`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	let result = await res.json();

	if (result.message === 'Unauthorized') {
		alert(['Please Login First']);
		return;
	} else if (result.message === 'add to cart success') {
		console.log(result.message);
	} else {
		alert(['Add to Cart Error']);
		return;
	}

	document.querySelector('.addToCart_btn').disabled = 'true';
}

const loginStatus = document.querySelector('#login_status');
const loginStatusFull = document.querySelector('#login_status_full');
let isLoginTrue = false;

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
		loginStatus.innerHTML = '<a class="custom-btn btn" href="/logout"> Logout </a>';
		loginStatusFull.innerHTML = '<a class="custom-btn btn" href="/logout"> Logout </a>';
	} else {
		loginStatus.innerHTML =
			'<a class="custom-btn btn" href="login.html"> Login / Register </a>';
		loginStatusFull.innerHTML =
			'<a class="custom-btn btn" href="login.html"> Login / Register </a>';
	}
}
