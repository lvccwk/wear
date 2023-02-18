const signUpButton = document.getElementById('signUp');

const signInButton = document.getElementById('signIn');

const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
	container.classList.remove('right-panel-active');
});

let contactsForm = document.querySelector('#signup-form');
contactsForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	let uploadForm = {
		name: contactsForm.name.value,
		email: contactsForm.email.value,
		password: contactsForm.password.value,
		confirmPassword: contactsForm.confirmPassword.value
	};

	let res = await fetch('/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(uploadForm)
	});

	let data = await res.json();

	if (res.ok) {
		alert('Register ok!');
		// e.preventDefault();
		window.location = 'index.html';
	} else {
		alert('Register fail! ');
	}
});

let signinformElm = document.querySelector('#signin-form');
signinformElm.addEventListener('submit', async (e) => {
	e.preventDefault();

	let uploadData = {
		email: signinformElm.email.value,
		password: signinformElm.password.value
	};

	let res = await fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(uploadData)
	});

	if (!res.ok) {
		console.log(res);
		alert(res);
		return;
	} else {
		let data = res.json();

		window.location = res.url;
		// window.location = "/chatroom.html";
	}
});
