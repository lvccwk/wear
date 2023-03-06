// get purchase history
// let purchaseHistoryButton = document.querySelector(".purchaseHistory_btn")
// purchaseHistoryButton.addEventListener('click', () => {
//     getPurchaseHistory()
// });

async function getPurchaseHistory() {
	let res = await fetch(`/purchaseHistory`, {
		method: 'get'
	});

	let result = await res.json();

	if (result.message === 'Unauthorized') {
		alert(['Please Login First']);
		return;
	} else if (result.message === 'get purchase history success') {
		console.log(result.message);
	} else {
		alert('get purchase history Error');
		return;
	}
	sortPurchaseHistory(result.data);
}

let listingOrder = document.querySelector('#orderBy');
listingOrder.addEventListener('change', () => {
	ordering();
});

async function ordering() {
	let res = await fetch(`/purchaseHistory`, {
		method: 'get'
	});

	let result = await res.json();

	if (result.message === 'Unauthorized') {
		alert(['Please Login First']);
		return;
	} else if (result.message === 'get purchase history success') {
		console.log(result.message);
	} else {
		alert('get purchase history Error');
		return;
	}

	switch (listingOrder.value) {
		case '1':
			// newest to oldest
			let sortedHistory1 = result.data.sort((h1, h2) =>
				new Date(h1.updated_at).getTime() < new Date(h2.updated_at).getTime()
					? 1
					: new Date(h1.updated_at).getTime() > new Date(h2.updated_at).getTime()
					? -1
					: 0
			);
			sortPurchaseHistory(sortedHistory1);
			break;
		case '2':
			// oldest to newest
			let sortedHistory2 = result.data.sort((h1, h2) =>
				new Date(h1.updated_at).getTime() > new Date(h2.updated_at).getTime()
					? 1
					: new Date(h1.updated_at).getTime() < new Date(h2.updated_at).getTime()
					? -1
					: 0
			);
			sortPurchaseHistory(sortedHistory2);
			break;
		case '3':
			// brand a-z
			let sortedHistory3 = result.data.sort(function (a, b) {
				if (a.brand < b.brand) {
					return -1;
				}
				if (a.brand > b.brand) {
					return 1;
				}
				return 0;
			});
			sortPurchaseHistory(sortedHistory3);
			break;
		case '4':
			// brand z-a
			let sortedHistory4 = result.data.sort(function (a, b) {
				if (a.brand > b.brand) {
					return -1;
				}
				if (a.brand < b.brand) {
					return 1;
				}
				return 0;
			});
			sortPurchaseHistory(sortedHistory4);
			break;
	}
}

async function sortPurchaseHistory(sortedHistory) {
	let phContainerElem = document.querySelector('.purchaseHistory-container');
	phContainerElem.innerHTML = '';
	for (let ph of sortedHistory) {
		phContainerElem.innerHTML += `
        <div class="phItem-wrapper text-muted col-6" id="phItem_${ph.id}">
            <div>
                <img src="${ph.image}" style="max-width:100%;">
            </div>
            <div class="row justify-content-between">
				<div class="col-4" style="text-align:start; margin-right:5px; min-width:100px;"><a href="/${ph.image}" download="${ph.brand}${ph.image}">Download</a>
                <div class="col-4" style="margin-left:5px; min-width:100px;">${ph.brand}</div>
            </div>
            </div>
        </div>
        `;
	}
}

// User Info button
// let userInfoButton = document.querySelector(".userInfo_btn")
// userInfoButton.addEventListener('click', () => {
//     getUserInfo()
// });

// get use info
async function getUserInfo() {
	let res = await fetch(`/profile`, {
		method: 'get'
	});

	let result = await res.json();

	if (result.message === 'Unauthorized') {
		alert(['Please Login First']);
		return;
	} else if (result.message === 'Get userInfo success') {
		console.log(result.message);
	} else {
		alert(['get user info Error']);
		return;
	}

	let userInfo = result.data;
	let userInfoContainerElem = document.querySelector('.account_Information');
	userInfoContainerElem.innerHTML = `
        <p class="font-italic mb-1 Email">User Name: ${userInfo[0].display_name}</p>
        <p class="font-italic mb-1 Email">Email: ${userInfo[0].email}</p>
        <p class="font-italic mb-1 PassWord">Password: ********</p>
    `;

	getPurchaseHistory();
}

getUserInfo();

// Change User Info
const button = document.querySelector('.Edit_profile');
button.addEventListener('click', async (e) => {
	window.location = '/editprofile.html';
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
