const loginStatus = document.querySelector('#login_status');
let isLoginTrue = false;
const socket = io.connect();
// send a message to the server
socket.emit('hello from client', 5, '6', { 7: Uint8Array.from([8]) });

// receive a message from the server
socket.on('hello from server', (...args) => {
	// ...
	//alert('data', args);
	console.log('server', args);
});

socket.on('photo', (image) => {
	console.log('image');
});

//fetch image
socket.on('message', (data) => {
	console.log('Received message:', data);
	// const responseMsg = document.createElement('div');
	// responseMsg.innerHTML = `<img src='${data.image_path}'>`;
	// document.querySelector('#wear').style.display = 'none';
	// document.querySelector('.col-md-8').appendChild(responseMsg);

	image = document.querySelector('#wear');
	image.src = data.image_path;
	//input.disabled=false;
});

async function main() {
	let res = await fetch('/is_logged_in');
	let result = await res.json();

	console.log(result);
	if (res.ok) {
		isLoginTrue = true;
		console.log('isLoginTrue', isLoginTrue);
		changeIcon();
	}
}
main();

function changeIcon() {
	if (isLoginTrue) {
		loginStatus.innerHTML = '<a class="custom-btn btn" href="/logout"> logout </a>';
	} else {
		loginStatus.innerHTML =
			'<a class="custom-btn btn" href="login.html"> Login / Register </a>';
	}
}

async function getMe() {
	const res = await fetch('/me');
	const data = await res.json();
	if (res.ok) {
		const ownerId = data.id;
		localStorage.setItem('ownerId', ownerId);
	}
}
getMe();

// socket.on("join_chatroom", (data) => {
//     console.log("收到喇：", data);
// });

console.log('HIHI');
