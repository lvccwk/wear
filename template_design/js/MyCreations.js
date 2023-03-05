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

// drop from cart
// async function dropFromCart(imageId) {
// 	let res = await fetch(`/cart/${imageId}`, {
// 		method: 'delete'
// 	})

//     let result = await res.json()

//     if (result.message === "Unauthorized") {
//         alert(['Please Login First'])
//         return
//     } else if (result.message === "delete cart item ok") {
//         console.log(result.message)
//     } else {
//         alert(['Drop from Cart Error'])
//         return
//     }
//     getCart()
//     dropFromCartButton.classList.add("d-none");
//     addToCartButton.classList.remove("d-none");
// }

// go to cart
// let goToCartButton = document.querySelector(".goToCart_btn")
// goToCartButton.addEventListener('click', () => {
//     window.location = "/shoppingcart"
// });

const loginStatus = document.querySelector('#login_status');
const loginStatusFull = document.querySelector('#login_status_full');
let isLoginTrue = false;

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

console.log('hihi this is mycreation');
