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

	image = document.querySelector('#wear');
	image.src = data.image_path;
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
