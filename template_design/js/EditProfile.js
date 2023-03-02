// get use info
async function getUserInfo() {
	let res = await fetch(`/profile`, {
		method: 'get'
	})

    let result = await res.json()

    if (result.message === "Unauthorized") {
        alert(['Please Login First'])
        return
    } else if (result.message === "Get userInfo success") {
        console.log(result.message)
    } else {
        alert(['get user info Error'])
        return
    }

    let userInfo = result.data
    document.querySelector('.display_name').innerHTML = userInfo[0].display_name
    document.querySelector('.display_email').innerHTML = userInfo[0].email
}

// Change User Info
const button = document.querySelector('.profile-button');
button.addEventListener('click', async (e) => {

    let name = document.querySelector(".newName")
    let email = document.querySelector(".newEmail")
    let password = document.querySelector(".newPassword")
    let confirmPassword = document.querySelector(".confirmNewPassword")
    if(password.value !== confirmPassword.value){
        alert('Passwords do not match')
        return
    }

    let data = {
        newName: name.value,
        newEmail: email.value,      
        newPassword: password.value}

    let res = await fetch(`/update`, {
        method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
        body: JSON.stringify(data)
    })

    let result = await res.json()

    if (result.message === "Unauthorized") {
        alert(['Please Login First'])
        return
    } else if (result.message === "update info success") {
        console.log(result.message)
    } else {
        alert('Update Error')
        return
    }
    window.location = '/userprofile.html';
});

const backButton = document.querySelector('.back-button');
backButton.addEventListener('click', async (e) => {
    window.location = '/userprofile.html';
});


getUserInfo()