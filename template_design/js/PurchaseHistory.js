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
    sortPurchaseHistory(result.data)
}

let listingOrder = document.querySelector('#orderBy')
listingOrder.addEventListener('change', () => {
    switch (listingOrder.value){
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
})

export async function sortPurchaseHistory(sortedHistory) {
    let phContainerElem = document.querySelector('.userInfoPage-container')
    phContainerElem.innerHTML = ''
    for (let ph of sortedHistory){
        phContainerElem.innerHTML += `
        <div class="phItem-wrapper" id="phItem_${ph.id}">
            <div><img src=""></div>
            <div class="col-6">${ph.brand}</div>
            <div class="col-6"><a href="/${ph.name}" download="${ph.brand}_${ph.name}">下載</a>
            </div>
        </div>
        `
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
