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
    window.location = "/shoppingcart"
});