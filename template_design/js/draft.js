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

    result.data
    // forloop images

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
        let sortedHistory1 = listingOrder.sort((h1, h2) => (h1.created_time > h2.created_time) ? 1 : (h1.created_time < h2.created_time) ? -1 : 0)
        break;
        case '2': 
        // oldest to newest
        let sortedHistory2 = listingOrder.sort((h1, h2) => (h1.created_time < h2.created_time) ? 1 : (h1.created_time > h2.created_time) ? -1 : 0)
        break;
        case '3': 
        // brand a-z
        let sortedHistory3 = listingOrder.sort((h1, h2) => (h1.name < h2.name) ? 1 : (h1.name > h2.name) ? -1 : 0)
        break;
        case '4': 
        // brand z-a
        let sortedHistory4 = listingOrder.sort((h1, h2) => (h1.name < h2.name) ? 1 : (h1.name > h2.name) ? -1 : 0)
        break;
    }
    result.data
    // forloop images

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