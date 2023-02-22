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
}

// drop from cart



// go to cart

// get cart item

// purchase history button

// get purchase history