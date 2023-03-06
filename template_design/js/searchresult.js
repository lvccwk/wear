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
	// window.location = '/searchresult.html';
	console.log('LOADING');
	//console.log(promptFormElem.name.value);
	let uploadData = { prompt: promptFormElem.prompt.value };
	console.log(uploadData.prompt);

	const newMessage = document.createElement('p');
	newMessage.textContent = uploadData;
	//searchbar.appendChild(newMessage);
	// input.value = '';
	console.log('indexjs_line20');
	//let result = await fetch(`http://localhost:8000/search-result?prompt=${uploadData.prompt}`)
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
	console.log('indexjs_line34');

	const suggestions = await response.json();
	console.log(suggestions);
	//const responseMsg = document.createElement('p');
	//responseMsg.textContent = suggestions.suggestions.suggestions;
	//searchbar.appendChild(responseMsg);
	// if (suggestions.generating === 1) {
	// 	input.disabled = true;
	// }
});

const loginStatus = document.querySelector('#login_status');
const loginStatusFull = document.querySelector('#login_status_full');

let isLoginTrue = false;
const socket = io.connect();
// send a message to the server
socket.emit('hello from client', 5, '6', { 7: Uint8Array.from([8]) });

// receive a message from the server
socket.on('hello from server', (...args) => {
	// ...
	//alert('data', args);
	console.log('server', args);
});

socket.on('photo', (image) => {
	console.log('image');
});

//fetch image
socket.on('message', (data) => {
	console.log('Received message:', data);
	// const responseMsg = document.createElement('div');
	// responseMsg.innerHTML = `<img src='${data.image_path}'>`;
	// document.querySelector('#wear').style.display = 'none';
	// document.querySelector('.col-md-8').appendChild(responseMsg);

	image = document.querySelector('#wears');
	// image.src = data.image_path;
	image.innerHTML += 
	`<div class="row align-items-center r">
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
			<h5 class="card-title">Card title</h5>
			<p class="card-text">
				This is a wider card with supporting text below
				as a natural
			</p>
			<p class="card-text">
				<small class="text-muted"
					>Last updated 3 mins ago</small
				>
			</p>
			<a href="shoppingcart.html" class="btn btn-primary"
				>Go to Cart
			</a>
			<br />
			<br />
			<button class="btn btn-primary addToCart_btn">
				Add to Cart
			</button>
			<button
				class="btn btn-primary dropFromCart_btn d-none"
			>
				Drop from Cart
			</button>
		</div>
	</div>
	</div>
	<br>`
	//input.disabled=false;
});

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

// socket.on("join_chatroom", (data) => {
//     console.log("收到喇：", data);
// });
let addToCartButton = document.querySelector('.addToCart_btn');
addToCartButton.addEventListener('click', (e) => {
	e.preventDefault();
	addToCart();
});

// let dropFromCartButton = document.querySelector(".dropFromCart_btn")
// dropFromCartButton.addEventListener('click', () => {
//     dropFromCart(imageId)
// });

// add to cart
async function addToCart() {
	let img = document.querySelector('.newImageForm .newImage');
	// console.log(img.src)

	let currentPath = window.location.href;
	// console.log("current=", currentPath)
	// console.log("img=", img.src)
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
	// console.log("path=", relativePath)

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
	// addToCartButton.classList.add("d-none");
	document.querySelector('.addToCart_btn').disabled = 'true';
	// dropFromCartButton.classList.remove("d-none");
}

console.log('HIHI');
