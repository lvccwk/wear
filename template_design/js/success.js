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

addToPurchaseHistory()