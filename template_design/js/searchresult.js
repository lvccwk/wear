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

let promptFormElem = document.querySelector('.search-form');
promptFormElem.addEventListener('submit', async (e) => {
	e.preventDefault();
	let uploadData = { prompt: promptFormElem.prompt.value };
	const newMessage = document.createElement('p');
	newMessage.textContent = uploadData;
	let response = await fetch('/prompt', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(uploadData)
	});

	if (!response.ok) {
		console.log('ERR0R');
		return;
	}

	await response.json();
});

const loginStatus = document.querySelector('#login_status');
const loginStatusFull = document.querySelector('#login_status_full');

let isLoginTrue = false;
const socket = io.connect();

socket.on('photo', (image) => {
	console.log('image');
});

//fetch image
socket.on('message', async (data) => {
	let imagePath = {
		image: data.image_path
	};

	let res = await fetch(`/collection`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(imagePath)
	});

	let result = await res.json();

	if (result.message === 'add to collection success') {
		console.log(result.message);
	} else {
		alert(['Add to Collection Error']);
		return;
	}

	image = await document.querySelector('#wears');
	// image.src = data.image_path;
	image.innerHTML += `<div class="row align-items-center r">
	<div class="col-md-8">
		<!-- <img
			src="https://web-dev.imgix.net/image/admin/oHMFvflk9aesT7r0iJbx.png?auto=format"
			loading="lazy"
			alt="…"
			class="img-fluid rounded-start"
		/> -->
		<img
			src="${data.image_path}"
			class="img-fluid rounded-start newImage"
			id="wear"
			alt="..."
		/>
	</div>
	<div class="col-md-4">
		<div class="card-body">
			<h5 class="card-title">SHOES</h5>
			<p class="card-text">
				This is a pair of shoes
			</p>
			<p class="card-text">
				<small class="text-muted"
					></small
				>
			</p>
			<a href="shoppingcart.html" class="btn btn-primary"
				>Go to Cart
			</a>
			<br />
			<br />
			<div class="btn btn-primary addToCart_btn${result.imageId[0].id}" onClick=addToCart(${result.imageId[0].id}) >
				Add to Cart
			</div>
			<div class="btn btn-primary addedToCart_btn${result.imageId[0].id} d-none" style="background-color:grey;">
				Added
			</div>
			<div
				class="btn btn-primary dropFromCart_btn d-none"
			>
				Drop from Cart
			</div>
		</div>
	</div>
	</div>`;
});

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

async function getMe() {
	const res = await fetch('/me');
	const data = await res.json();
	if (res.ok) {
		const ownerId = data.id;
		localStorage.setItem('ownerId', ownerId);
	}
}
getMe();

// add to cart
async function addToCart(imageId) {
	let data = {
		image: imageId
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

	document.querySelector(`.addToCart_btn${imageId}`).classList.add('d-none');
	document.querySelector(`.addedToCart_btn${imageId}`).classList.remove('d-none');
}
