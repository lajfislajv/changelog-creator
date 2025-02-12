// import OpenAI from 'openai';

let newTasks = JSON.parse(localStorage.getItem('newTasks')) || [];
let improvedTasks = JSON.parse(localStorage.getItem('improvedTasks')) || [];
let fixedTasks = JSON.parse(localStorage.getItem('fixedTasks')) || [];

const inputElements = {
	new: document.getElementById('input-el-new'),
	improved: document.getElementById('input-el-improved'),
	fixed: document.getElementById('input-el-fixed'),
};

const buttonElements = {
	new: document.getElementById('add-new-btn'),
	improved: document.getElementById('add-improved-btn'),
	fixed: document.getElementById('add-fixed-btn'),
};

const listElements = {
	new: document.getElementById('ul-el-new'),
	improved: document.getElementById('ul-el-improved'),
	fixed: document.getElementById('ul-el-fixed'),
};

const generateChangeLogBtn = document.querySelector('.generate-changelog-btn');
const loadingPanel = document.querySelector('.loading-panel');
const outputPanel = document.querySelector('.output-panel');
const outputContent = document.getElementById('output-content');

Object.keys(buttonElements).forEach(type => {
	buttonElements[type].addEventListener('click', () => {
		if (inputElements[type].value.trim()) {
			addTask(type, inputElements[type].value.trim());
			inputElements[type].value = '';
		}
	});
});

function addTask(type, task) {
	if (type === 'new') {
		newTasks.push(task);
	} else if (type === 'improved') {
		improvedTasks.push(task);
	} else {
		fixedTasks.push(task);
	}

	localStorage.setItem(`${type}Tasks`, JSON.stringify(getTaskList(type)));
	renderTasks(type);
}

function deleteTask(type, index) {
	getTaskList(type).splice(index, 1);
	localStorage.setItem(`${type}Tasks`, JSON.stringify(getTaskList(type)));
	renderTasks(type);
}

function getTaskList(type) {
	return type === 'new' ? newTasks : type === 'improved' ? improvedTasks : fixedTasks;
}

function renderTasks(type) {
	listElements[type].innerHTML = getTaskList(type)
		.map((task, index) => `<li><span>${task}</span><button onclick="deleteTask('${type}', ${index})">x</button></li>`)
		.join('');
	updateGenerateButton();
}

function updateGenerateButton() {
	generateChangeLogBtn.disabled = !(newTasks.length || improvedTasks.length || fixedTasks.length);
}

function formatMarkdown(text) {
	// Split the text by lines
	return text
		.split('###')
		.map((section, index) => {
			if (index === 0) return section;
			// Format each section that starts with ###
			const lines = section.trim().split('\n');
			const header = lines[0];
			const content = lines.slice(1).join('\n');
			return `<div class="header">### ${header}</div>${content}`;
		})
		.join('');
}

function renderReport(output) {
	loadingPanel.style.display = 'none';
	const outputArea = document.querySelector('.output-panel');
	const report = document.createElement('p');
	outputArea.appendChild(report);
	outputContent.innerHTML = formatMarkdown(output);
	outputArea.style.display = 'flex';
}

generateChangeLogBtn.addEventListener('click', async () => {
	loadingPanel.style.display = 'flex';
	outputPanel.style.display = 'none';

	// Disable the button
	document.querySelector('.generate-changelog-btn').disabled = true;

	// Show loader while waiting for the API response
	const loadingArea = document.querySelector('.loading-panel');
	loadingArea.style.visibility = 'visible'; // loader appears

	const apiKey = process.env.OPENAI_API_KEY;
	const url = 'https://api.openai.com/v1/chat/completions';

	const requestBody = {
		model: 'gpt-4o-mini',
		messages: [
			{ role: 'system', content: 'You are a helpful AI assistant that creates changelogs.' },
			{
				role: 'user',
				content: `Generate a changelog based on new: ${newTasks}, improved: ${improvedTasks}, fixed: ${fixedTasks}. Do not use backticks or "markdown" in the output. It has to match the following format:
				### New
				* [9470] New feature
				* [9471] Another feature
				### Improved
				* [9472] Improved feature
				* [9473] Another improved feature
				### Fixed
				* [9474] Fixed bug
				* [9475] Another fixed bug
				`,
			},
		],
	};

	try {
		document.querySelector('.loading-panel').style.display = 'flex';

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify(requestBody),
		});

		const data = await response.json();
		renderReport(data.choices[0].message.content);
	} catch (err) {
		console.error('API ERROR:', err);
		renderReport('An error occurred while generating the changelog. Please try again later.');
	} finally {
		document.querySelector('.loading-panel').style.display = 'none';
	}
});

updateGenerateButton();
renderTasks('new');
renderTasks('improved');
renderTasks('fixed');
