const button = document.querySelector('.checkout');
button.addEventListener('click', async (e) => {
	console.log('checkout');

	e.preventDefault();

	let res = await fetch('http://localhost:8080/cart/checkout-session', {
		method: 'POST'
		// headers: {
		// 	'Content-Type': 'application/json'
		// },

		// //shopping cart items
		// // body: JSON.stringify({
		// // 	items: [
		// // 		{ id: 1, quantity: 1 },
		// // 		{ id: 2, quantity: 5 }
		// // 	]
		// // })
	});

	if (!res.ok) {
		console.log('err0r', e);
		return;
	} else {
		//main.ts line 43
		window.location = (await res.json()).url;
		return;
	}
});

// get cart item
async function getCart() {
	let res = await fetch(`/cart`, {
		method: 'get'
	});

	let result = await res.json();

	if (result.message === 'Unauthorized') {
		alert(['Please Login First']);
		return;
	} else if (result.message === 'Get cart success') {
		console.log(result.message);
	} else {
		alert('get cart item Error');
		return;
	}
	sortCart(result.data);
}

let listingOrder = document.querySelector('#orderBy');
listingOrder.addEventListener('change', () => {
	ordering();
});

async function ordering() {
	let res = await fetch(`/cart`, {
		method: 'get'
	});

	let result = await res.json();

	if (result.message === 'Unauthorized') {
		alert(['Please Login First']);
		return;
	} else if (result.message === 'Get cart success') {
		console.log(result.message);
	} else {
		alert('get cart item Error');
		return;
	}

	switch (listingOrder.value) {
		case '1':
			// newest to oldest
			let sortedCart1 = result.data.sort((h1, h2) =>
				new Date(h1.updated_at).getTime() < new Date(h2.updated_at).getTime()
					? 1
					: new Date(h1.updated_at).getTime() > new Date(h2.updated_at).getTime()
					? -1
					: 0
			);
			sortCart(sortedCart1);
			break;
		case '2':
			// oldest to newest
			let sortedCart2 = result.data.sort((h1, h2) =>
				new Date(h1.updated_at).getTime() > new Date(h2.updated_at).getTime()
					? 1
					: new Date(h1.updated_at).getTime() < new Date(h2.updated_at).getTime()
					? -1
					: 0
			);
			sortCart(sortedCart2);
			break;
		case '3':
			// brand a-z
			let sortedCart3 = result.data.sort(function (a, b) {
				if (a.brand < b.brand) {
					return -1;
				}
				if (a.brand > b.brand) {
					return 1;
				}
				return 0;
			});
			sortCart(sortedCart3);
			break;
		case '4':
			// brand z-a
			let sortedCart4 = result.data.sort(function (a, b) {
				if (a.brand > b.brand) {
					return -1;
				}
				if (a.brand < b.brand) {
					return 1;
				}
				return 0;
			});
			sortCart(sortedCart4);
			break;
	}
}

async function sortCart(sortedCart) {
	let cartContainerElem = document.querySelector('.cart-container');
	cartContainerElem.innerHTML = '';
	for (let cartItem of sortedCart) {
		cartContainerElem.innerHTML += `
        <form class="card rounded-3 mb-4" id="memo_${cartItem.id}">
            <div class="card-body p-4">
                <div class="row d-flex justify-content-between align-items-center">
                    <div class="col-md-2 col-lg-2 col-xl-2">
                        <img
                            src="/${cartItem.image}"
                            class="img-fluid rounded-3"
                            alt=""
                        />
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-3">
                        <p class="lead fw-normal mb-2">Shoe Design</p>
                        <p>
                            <span class="text-muted"></span>
                            <span class="text-muted">Brand: ${cartItem.brand}</span>
                        </p>
                    </div>

                    <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                        <h5 class="mb-0">$9.99</h5>
                    </div>
                    <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                    <a>
                      <i class="fas fa-trash fa-lg" onclick='dropFromCart("${cartItem.id}")'></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
        `;
	}
}

async function dropFromCart(cartItemId) {
	let res = await fetch(`/cart/${cartItemId}`, {
		method: 'delete'
	});

	let result = await res.json();

	if (result.message === 'delete cart item ok') {
		console.log(result.message);
	} else {
		alert(['Drop from Cart Error']);
		return;
	}
	getCart();
}

// post to purchase history
async function addToPurchaseHistory() {
	// let cartImageForm = document.querySelector('.cartImageForm');
	// let formData = new FormData(cartImageForm);
	// formData.append('userId', userId);
	let res = await fetch(`/purchaseHistory`, {
		method: 'POST'
	});

	let result = await res.json();

	if (result.message === 'Unauthorized') {
		alert(['Please Login First']);
		return;
	} else if (result.message === 'add to purchase history success') {
		console.log(result.message);
	} else {
		alert(['Add to purchase history Error']);
		return;
	}
}

getCart();
// addToPurchaseHistory()

const returnButton = document.querySelector('.return-btn');
returnButton.addEventListener('click', async (e) => {
	window.location = '/searchresult.html';
});

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
