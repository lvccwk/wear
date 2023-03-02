let addToCartButton = document.querySelector(".addToCart_btn")
addToCartButton.addEventListener('click', (e) => {
    e.preventDefault();
    addToCart()
});

// let dropFromCartButton = document.querySelector(".dropFromCart_btn")
// dropFromCartButton.addEventListener('click', () => {
//     dropFromCart(imageId)
// });

// add to cart
async function addToCart() {

    let selectImageForm = document.querySelector(".newImageForm")
    let formData = new FormData(selectImageForm)
    console.log("image=", selectImageForm.image.src)
    let img = selectImageForm.image.src
    formData.append('image', img)
    let res = await fetch(`/cart`, {
        method: 'POST',
        body: formData
    })

    let result = await res.json()

    console.log(result.message)
    if (result.message === "Unauthorized") {
        alert(['Please Login First'])
        return
    } else if (result.message === "add to cart success") {
        console.log(result.message)
    } else {
        alert(['Add to Cart Error'])
        return
    }
    // addToCartButton.classList.add("d-none");
    document.querySelector(".addToCart_btn").disabled = 'true'
    // dropFromCartButton.classList.remove("d-none");
}

// drop from cart
// async function dropFromCart(imageId) {
// 	let res = await fetch(`/cart/${imageId}`, {
// 		method: 'delete'
// 	})

//     let result = await res.json()

//     if (result.message === "delete cart item ok") {
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