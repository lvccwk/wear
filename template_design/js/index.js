const test = document.querySelector('.search-icon');

let promptFormElem = document.querySelector('.search-form');
promptFormElem.addEventListener('submit', async (e) => {
	e.preventDefault();
	window.location = '/searchresult.html';

	let uploadData = { prompt: promptFormElem.prompt.value };

	const newMessage = document.createElement('p');
	newMessage.textContent = uploadData;

	let response = await fetch('/prompt', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(uploadData)
	});

	if (!response.ok) {
		return;
	}

	const suggestions = await response.json();

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
