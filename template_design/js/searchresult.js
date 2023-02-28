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
    const responseMsg = document.createElement('div');
    responseMsg.innerHTML = `<img src='${data.image_path}'>`;
    document.querySelector('.col-md-8').appendChild(responseMsg);  
    //input.disabled=false;
});

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
