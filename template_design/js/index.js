// const test = document.querySelector('#submit-form');
// test.addEventListener('click', (e) => {
//     e.preventDefault()
//     console.log('test');
// });
// const searchbar = document.querySelector('.searchbar');

//const searchbar = document.querySelector('.searchbar');
const test = document.querySelector('.search-icon');

console.log('12312312');
test.addEventListener('click', async (e) => {
	console.log('test');
});

const input = document.querySelector('.search_input');
let promptFormElem = document.querySelector('.search-form');
promptFormElem.addEventListener('submit', async (e) => {
	e.preventDefault();
	window.location = '/searchresult.html';
	console.log('LOADING');
	//console.log(promptFormElem.name.value);
	let uploadData = { prompt: promptFormElem.prompt.value };
	console.log(uploadData.prompt);

	const newMessage = document.createElement('p');
	newMessage.textContent = uploadData;
	//searchbar.appendChild(newMessage);
	input.value = '';
	console.log('indexjs_line20');
	//let result = await fetch(`http://localhost:8000/search-result?prompt=${uploadData.prompt}`)
	let response = await fetch('/prompt', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(uploadData)
	});

	if (!response.ok) {
		console.log('ERR0R');
		return;
	}
	console.log('indexjs_line34');

	const suggestions = await response.json();
	console.log(suggestions);
	//const responseMsg = document.createElement('p');
	//responseMsg.textContent = suggestions.suggestions.suggestions;
	//searchbar.appendChild(responseMsg);
	if (suggestions.generating === 1) {
		input.disabled = true;
	}
});

const clearInput = () => {
	const input = document.getElementsByTagName('input')[0];
	input.value = '';
};

const clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', clearInput);

// $(document).ready(function () {
// 	$('#search').focus(function () {
// 		$('.search-box').addClass('border-searching');
// 		$('.search-icon').addClass('si-rotate');
// 	});
// 	$('#search').blur(function () {
// 		$('.search-box').removeClass('border-searching');
// 		$('.search-icon').removeClass('si-rotate');
// 	});
// 	$('#search').keyup(function () {
// 		if ($(this).val().length > 0) {
// 			$('.go-icon').addClass('go-in');
// 		} else {
// 			$('.go-icon').removeClass('go-in');
// 		}
// 	});
// 	$('.go-icon').click(function () {
// 		$('.search-form').submit();
// 	});
// });

// socket.emit('search_product', input.value, user_id);
