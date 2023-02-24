// add to cart
let addToCartButton = document.querySelector(".addToCart_btn")
addToCartButton.addEventListener('click', () => {
    addToCart(userId)
});

export async function addToCart(userId) {
    let selectImageForm = document.querySelector(".imageForm")
    let formData = new FormData(selectImageForm)
    formData.append('userId', userId)
    let res = await fetch(`/cart`, {
        method: 'POST',
        body: formData
    })

    let result = await res.json()

    console.log(result.message)
    if (result.message === "add to cart success") {
        console.log(result.message)
    } else {
        alert(['Add to Cart Error'])
        return
    }
    addToCartButton.classList.add("d-none");
    dropFromCartButton.classList.remove("d-none");
}

// drop from cart
let dropFromCartButton = document.querySelector(".dropFromCart_btn")
dropFromCartButton.addEventListener('click', () => {
    dropFromCart(imageId)
});

export async function dropFromCart(imageId) {
	await fetch(`/cart/${imageId}`, {
		method: 'delete'
	})

    let result = await res.json()

    console.log(result.message)
    if (result.message === "drop from cart success") {
        console.log(result.message)
    } else {
        alert(['Drop from Cart Error'])
        return
    }
    dropFromCartButton.classList.add("d-none");
    addToCartButton.classList.remove("d-none");
}

// go to cart
let goToCartButton = document.querySelector(".goToCart_btn")
goToCartButton.addEventListener('click', () => {
    window.location = "/cart"
    getCart()
});

// get cart item
export async function getCart() {
	await fetch(`/cart`, {
		method: 'get'
	})

    let result = await res.json()

    console.log(result.message)
    if (result.message === "get cart success") {
        console.log(result.message)
    } else {
        alert(['get cart item Error'])
        return
    }

    let cart = result.data
    let cartContainerElem = document.querySelector('.cart-container')
    cartContainerElem.innerHTML = ''
    for (let cartItem of cart){
        cartContainerElem.innerHTML += `
        <div class="cartItem-wrapper" id="cartItem_${cartItem.id}">
            <div><img src=""></div>
            <div class="col-6">${cartItem.brand}</div>
            <div class="col-6">
                <button class="addToCart_btn d-none" onclick='addToCart("${cartItem.user_id}")>加入購物車</button>
                <button class="dropFromCart_btn" onclick='dropFromCart("${cartItem.id}">已加入購物車</button>
            </div>
        </div>
        `
    }
}

// get purchase history
let purchaseHistoryButton = document.querySelector(".purchaseHistory_btn")
purchaseHistoryButton.addEventListener('click', () => {
    getPurchaseHistory()
});

export async function getPurchaseHistory() {
	await fetch(`/purchaseHistory`, {
		method: 'get'
	})

    let result = await res.json()

    console.log(result.message)
    if (result.message === "get purchase history success") {
        console.log(result.message)
    } else {
        alert(['get purchase history Error'])
        return
    }

    let listingOrder = document.querySelector('#orderBy').value
    switch (listingOrder){
        case '1': 
        // newest to oldest
        let sortedHistory1 = result.data.sort((h1, h2) => (h1.created_at > h2.created_at) ? 1 : (h1.created_at < h2.created_at) ? -1 : 0)
        sortPurchaseHistory(sortedHistory1)
        break;
        case '2': 
        // oldest to newest
        let sortedHistory2 = result.data.sort((h1, h2) => (h1.created_at < h2.created_at) ? 1 : (h1.created_at > h2.created_at) ? -1 : 0)
        sortPurchaseHistory(sortedHistory2)
        break;
        case '3': 
        // brand a-z
        let sortedHistory3 = result.data.sort((h1, h2) => (h1.image < h2.image) ? 1 : (h1.image > h2.image) ? -1 : 0)
        sortPurchaseHistory(sortedHistory3)
        break;
        case '4': 
        // brand z-a
        let sortedHistory4 = result.data.sort((h1, h2) => (h1.image < h2.image) ? 1 : (h1.image > h2.image) ? -1 : 0)
        sortPurchaseHistory(sortedHistory4)
        break;
    }
}

export async function sortPurchaseHistory(sortedHistory) {
    let phContainerElem = document.querySelector('.userInfoPage-container')
    phContainerElem.innerHTML = ''
    for (let ph of sortedHistory){
        phContainerElem.innerHTML += `
        <div class="phItem-wrapper" id="phItem_${ph.id}">
            <div><img src=""></div>
            <div class="col-6">${ph.brand}</div>
            <div class="col-6"><a href=`` download="">下載</a>
            </div>
        </div>
        `
    }
}

// post to purchase history
export async function addToPurchaseHistory(userId) {
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

// User Info button
let userInfoButton = document.querySelector(".userInfo_btn")
userInfoButton.addEventListener('click', () => {
    getUserInfo()
});

// get use info
export async function getUserInfo() {
	await fetch(`/users`, {
		method: 'get'
	})

    let result = await res.json()

    console.log(result.message)
    if (result.message === "get user info success") {
        console.log(result.message)
    } else {
        alert(['get user info Error'])
        return
    }

    let userInfo = result.data
    let userInfoContainerElem = document.querySelector('.userInfoPage-container')
    userInfoContainerElem.innerHTML = `
        <div>
            User Name: ${userInfo.display_name}
            Email: ${userInfo.email}
            Password: ********
        </div>
    `
}

// Change User Info

// Website Icon (go to homepage)

// payment button

// download button