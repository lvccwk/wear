const socket = io.connect()
// send a message to the server
socket.emit('hello from client', 5, '6', { 7: Uint8Array.from([8]) })

// receive a message from the server
socket.on('hello from server', (...args) => {
	// ...
	alert('data', args)
	console.log('server', args)
})

async function getMe() {
	const res = await fetch('/me')
	const data = await res.json()
	if (res.ok) {
		const ownerId = data.id
		localStorage.setItem('ownerId', ownerId)
	}
}
getMe()

// socket.on("join_chatroom", (data) => {
//     console.log("收到喇：", data);
// });

console.log('HIHI')

// async function init() {
// 	const socket = io.connect();
// 	socket.on('connection', (data) => {
// console.log('收到data', data)
// 	})
// 	getMe()
// }
// init()
