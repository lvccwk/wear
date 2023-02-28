// get cart item
async function getCart() {
	let res = await fetch(`/cart`, {
		method: 'get'
	})

    let result = await res.json()

    console.log(result.message)
    if (result.message === "Get cart success") {
        console.log(result.message)
    } else {
        alert('get cart item Error')
        return
    }

    let cart = result.data
    let cartContainerElem = document.querySelector('.cart-container')
    cartContainerElem.innerHTML = ''
    for (let cartItem of cart){
        cartContainerElem.innerHTML += `
        <div class="card rounded-3 mb-4" id="memo_${cartItem.id}">
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
                        <p class="lead fw-normal mb-2">Basic T-shirt</p>
                        <p>
                            <span class="text-muted">Size: </span>M
                            <span class="text-muted">Brand: ${cartItem.brand}</span>
                        </p>
                    </div>

                    <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                        <h5 class="mb-0">$499.00</h5>
                    </div>
                    <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                    <a>
                      <i class="fas fa-trash fa-lg" onclick='dropFromCart("${cartItem.id}")'></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `
    }
}

/* <div class="cartItem-wrapper" id="cartItem_${cartItem.id}">
<div><img src=""></div>
<div class="col-6">${cartItem.brand}</div>
<div class="col-6">
    <button class="addToCart_btn d-none" onclick='addToCart("${cartItem.user_id}")>加入購物車</button>
    <button class="dropFromCart_btn" onclick='dropFromCart("${cartItem.id}">已加入購物車</button>
</div>
</div> */

// drop from cart
// let dropFromCartButton = document.querySelector(".fa-trash")
// dropFromCartButton.addEventListener('click', () => {
//     dropFromCart(imageId)
// });

async function dropFromCart(cartItemId) {
	let res = await fetch(`/cart/${cartItemId}`, {
		method: 'delete'
	})

    let result = await res.json()

    if (result.message === "delete cart item ok") {
        console.log(result.message)
    } else {
        alert(['Drop from Cart Error'])
        return
    }
    getCart()
    // dropFromCartButton.classList.add("d-none");
    // addToCartButton.classList.remove("d-none");
}

// post to purchase history
async function addToPurchaseHistory(userId) {
    let cartImageForm = document.querySelector(".cartImageForm")
    let formData = new FormData(cartImageForm)
    formData.append('userId', userId)
    let res = await fetch(`/purchaseHistory`, {
        method: 'POST',
        body: formData
    })

    let result = await res.json()

    console.log(result.message)
    if (result.message === "add to purchase history success") {
        console.log(result.message)
    } else {
        alert(['Add to purchase history Error'])
        return
    }
}

getCart()