const terminal = document.getElementById('terminal');
const input = document.getElementById('input');
const settingsBtn = document.getElementById('settings-btn');
const modal = document.getElementById('modal');
const tokenInput = document.getElementById('token');
const serverUrlInput = document.getElementById('server-url');
const terminalModeSelect = document.getElementById('terminal-mode');

input.focus();

function writeToTerminal(text, name) {
	terminal.innerHTML += `<div class="${name}">${text}</div>`;
	terminal.scrollTop = terminal.scrollHeight;
}

function processInput() {
	const command = input.value;
	sendInput(command);
	writeToTerminal(`$ ${command}`, 'user');
	input.value = '';
}

input.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		processInput();
	}
});

document.addEventListener('click', () => {
	if (modal.style.display == 'none') {
		input.focus();
	}
});

function sendInput(command) {
	const token = tokenInput.value;
	const serverUrl = serverUrlInput.value;
	const terminalMode = terminalModeSelect.value;

	fetch(serverUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			token: token,
			mode: terminalMode,
			text: command,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			handleResponse(data);
		})
		.catch((error) => {
			console.error('Error:', error);
			writeToTerminal('Error occurred while processing the command.', 'error');
		});
}

function handleResponse(data) {
	if (data.debug != '') {
		writeToTerminal(data.debug, 'debug');
	}
	writeToTerminal(data.text, 'Response');
}

settingsBtn.addEventListener('click', () => {
	modal.style.display = 'block';
});

function saveSettings() {
	modal.style.display = 'none';
}

document.addEventListener('click', (event) => {
	if (event.target !== settingsBtn && event.target !== modal && !modal.contains(event.target)) {
		modal.style.display = 'none';
	}
});
