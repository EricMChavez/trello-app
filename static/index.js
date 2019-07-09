'use strict';

var dragCard = '';
var dragLane = '';
var dragPosition = 'up';
var dragCardHeight;
var editedCard;
let trashcan = [];
let counter;
let animation = false;
let backgrounds = [
	'url("background0.jpg")',
	'url("background1.jpg")',
	'url("background2.jpg")',
	'url("background3.jpg")',
	'url("background4.jpg")',
	'url("background5.jpg")',
	'url("background6.jpg")',
	'url("background7.jpg")',
	'url("background8.jpg")',
	'url("background9.jpg")',
	'url("background10.jpg")',
	'url("background11.jpg")',
	'url("background12.jpg")'
];
let trash = document.getElementById('trash');
trash.addEventListener('dragover', hover);
trash.addEventListener('dragenter', nothing);
trash.addEventListener('dragleave', unhover);
trash.addEventListener('drop', trashDrop);
function trashDrop(e) {
	e.preventDefault();
	if (dragCard != '') {
		dragCard.style.display = 'none';
		trashcan.push(dragCard);
		dragCard = '';
		clearSpaces();
	}
	if (dragLane != '') {
		dragLane.style.display = 'none';
		trashcan.push(dragLane);
		dragLane = '';
		clearSpaces();
	}
	unhover(e);
	catalogLanes();
}
function nothing(e) {
	e.preventDefault();
}
function unhover(e) {
	e.preventDefault();
	let trash = document.getElementById('trash');
	trash.style.backgroundColor = '';
	trash.style.color = 'black';
}
function hover(e) {
	e.preventDefault();
	let trash = document.getElementById('trash');
	trash.style.backgroundColor = 'black';
	trash.style.color = 'white';
}
function tagCards() {
	let cards = document.getElementsByClassName('card');
	for (let card of cards) {
		card.addEventListener('dragstart', dragStartCard);
		card.addEventListener('dragend', dragEnd);
		card.addEventListener('dragover', dragOver);
		card.addEventListener('dragenter', dragEnterCard);
		card.addEventListener('dragleave', dragLeave);
		card.addEventListener('drop', dropCard);
	}
}
function tagLanes() {
	let lanes = document.getElementsByClassName('swimlane');
	for (let lane of lanes) {
		lane.addEventListener('dragstart', dragStartLane);
		lane.addEventListener('dragend', dragEnd);
		lane.addEventListener('dragover', dragOver);
		lane.addEventListener('dragenter', dragEnterLane);
		lane.addEventListener('dragleave', dragLeave);
		lane.addEventListener('drop', dropLane);
	}
}

function dragStartCard(e) {
	dragCard = this;
	dragCardHeight = window.getComputedStyle(dragCard, null).getPropertyValue('height');
	document.body.style.cursor = 'grabbing';
	e.stopPropagation();
}
function dragStartLane() {
	dragLane = this;
	document.body.style.cursor = 'grabbing';
}
function dragEnterCard(e) {
	e.preventDefault();
	if (dragCard != '' && e.path[0].classList[1] == 'dropzone') {
		clearSpaces();
		let space = document.createElement('div');
		space.classList = 'space smallspace';
		space.style.height = dragCardHeight;

		space.addEventListener('dragover', dragOver);
		space.addEventListener('drop', dropCard);
		this.insertAdjacentElement('beforebegin', space);
		dragCard.style.display = 'none';
	}
}
function dropCard(e) {
	if (dragCard != '') {
		let cardMid = findMid(e.path);
		if (e.pageY > cardMid) {
			this.insertAdjacentElement('afterend', dragCard);
		} else {
			this.parentNode.insertBefore(dragCard, this);
		}
		dragCard.style.display = 'block';
		dragCard = '';
		clearSpaces();
		setDropzone();
		catalogLanes();
	}
}

function dragEnterLane(e) {
	e.preventDefault();
	if (dragLane != '') {
		clearSpaces();
		let space = document.createElement('div');
		space.classList = 'space largespace';
		space.addEventListener('dragover', dragOver);
		space.addEventListener('drop', dropLane);
		this.parentNode.insertBefore(space, this);
		dragLane.style.display = 'none';
	}
}
function dropLane() {
	if (dragLane != '') {
		dragLane.style.display = 'block';
		this.parentNode.insertBefore(dragLane, this);
		dragLane = '';
		clearSpaces();
		catalogLanes();
	}
}
function dragOver(e) {
	e.preventDefault();
	if (dragCard != '' && this.className == 'card') {
		let cardMid = findMid(e.path);
		if (e.pageY > cardMid && dragPosition == 'up') {
			dragPosition = 'down';
			clearSpaces();
			let space = document.createElement('div');
			space.classList = 'space smallspace';
			space.style.height = dragCardHeight;
			dragCard.style.display = 'none';
			space.addEventListener('dragover', dragOver);
			space.addEventListener('drop', dropCard);
			this.insertAdjacentElement('afterend', space);
		} else if (e.pageY < cardMid && dragPosition == 'down') {
			clearSpaces();
			let space = document.createElement('div');
			space.classList = 'space smallspace';
			space.style.height = dragCardHeight;

			space.addEventListener('dragover', dragOver);
			space.addEventListener('drop', dropCard);
			this.insertAdjacentElement('beforebegin', space);
			dragCard.style.display = 'none';
			dragPosition = 'up';
		}
	}

	if (dragLane != '' && this.className == 'swimlane') {
		let scroll = document.getElementById('workspace').scrollLeft;
		if (e.clientX > this.offsetLeft - scroll && dragPosition == 'left') {
			dragPosition = 'down';
			clearSpaces();
			let space = document.createElement('div');
			space.classList = 'space largespace';
			space.addEventListener('dragover', dragOver);
			space.addEventListener('drop', dropLane);
			this.insertAdjacentElement('afterend', space);
			dragLane.style.display = 'none';
		} else {
			dragPosition = 'left';
		}
	}
}

function findMid(path) {
	for (let item of path) {
		if (item.classList == 'card') {
			return item.clientHeight / 2 + item.offsetTop;
		}
	}
}
function dragEnd() {
	if (dragLane != '') {
		dragLane.style.display = 'block';
		let space = document.getElementsByClassName('space')[0];
		space.parentNode.insertBefore(dragLane, space);
		dragLane = '';
	}
	if (dragCard != '') {
		dragCard.style.display = 'block';
		let space = document.getElementsByClassName('space')[0];
		space.parentNode.insertBefore(dragCard, space);
		dragCard = '';
	}
	clearSpaces();
	if (dragCard != '') {
		dragCard.style.display = 'block';
	}
	if (dragLane != '') {
		dragLane.style.display = 'block';
	}
	dragCard = '';
	dragLane = '';
	document.body.style.cursor = 'default';
	catalogLanes();
}
function dragLeave() {}

function clearSpaces() {
	let spaces = document.getElementsByClassName('space');
	for (let space of spaces) {
		space.parentNode.removeChild(space);
	}
}

function editCard(card) {
	document.getElementById('greyOut').style.display = 'block';
	document.getElementById('cardEditer').style.display = 'block';
	document.getElementById('inputTitle').value = card.childNodes[0].innerHTML;
	document.getElementById('inputBody').value = card.childNodes[1].innerHTML;
	document.getElementById('inputBody').focus();
	editedCard = card;
}
function endEdit() {
	document.getElementById('greyOut').style.display = 'none';
	document.getElementById('cardEditer').style.display = 'none';
}
function updateCard() {
	editedCard.childNodes[0].innerHTML = document.getElementById('inputTitle').value;
	editedCard.childNodes[1].innerHTML = document.getElementById('inputBody').value;
	if (document.getElementById('inputBody').value != '') {
		editedCard.childNodes[1].style.display = 'block';
	} else {
		editedCard.childNodes[1].style.display = 'none';
	}
	endEdit();
	setDropzone();
	$.ajax({
		type: 'put',
		url: `http://localhost:3000/cards/${editedCard.id}`,
		data: { title: document.getElementById('inputTitle').value, body: document.getElementById('inputBody').value }
	});
}
function cardFactory() {
	let title = document.getElementById('newCardTitle').value;
	if (title == '') {
		title = 'untitled';
	}
	let newCard = document.createElement('div');
	newCard.id = guid();
	newCard.classList = 'card';
	newCard.draggable = 'true';
	newCard.innerHTML = `<div onclick='editCard(this.parentNode)' class="cardTitle">${title}</div><div class='cardBody'></div>`;
	let position = document.getElementById('cardMaker').parentElement;
	position.insertAdjacentElement('beforebegin', newCard);
	document.getElementById('newCardTitle').value = '';
	document.getElementById('newCardTitle').focus();
	tagCards();
	setDropzone();
	jQuery.post('http://localhost:3000/cards', { id: newCard.id, title: title, body: null, color: 'none' }, null);
	catalogLanes();
}
function grabCardMaker(pushed) {
	let allBtns = document.getElementsByClassName('cardBtn');
	for (let btn of allBtns) {
		btn.style.display = 'flex';
	}
	pushed.style.display = 'none';
	let cardMaker = document.getElementById('cardMaker');
	cardMaker.style.display = 'flex';
	document.getElementById('newCardTitle').value = '';
	pushed.insertAdjacentElement('beforebegin', cardMaker);
	document.getElementById('newCardTitle').focus();
}
function hideCardMaker() {
	if (document.getElementById('newCardTitle').value == '') {
		document.getElementById('cardMaker').style.display = 'none';
		let allBtns = document.getElementsByClassName('cardBtn');
		for (let btn of allBtns) {
			btn.style.display = 'flex';
		}
	}
}
function laneMaker() {
	document.getElementById('laneBtn').style.display = 'none';
	document.getElementById('laneMaker').style.display = 'flex';
	document.getElementById('newLaneTitle').focus();
}
function hideLaneMaker() {
	if (document.getElementById('newLaneTitle').value == '') {
		document.getElementById('laneBtn').style.display = 'flex';
		document.getElementById('laneMaker').style.display = 'none';
	}
}
function laneFactory() {
	let title = document.getElementById('newLaneTitle').value;
	if (title == '') {
		title = 'untitled';
	}
	let newLane = document.createElement('div');
	newLane.classList = 'swimlane';
	newLane.draggable = 'true';
	newLane.innerHTML = `<div onfocusout="updateLaneTitle(this)" contenteditable="true" class="laneTitle">${title}</div><div class="card dropzone"><div onclick="grabCardMaker(this)" class="cardBtn">+ Add Card</div></div>`;
	let position = document.getElementById('laneMaker');
	position.insertAdjacentElement('beforebegin', newLane);
	document.getElementById('newLaneTitle').value = '';
	hideLaneMaker();
	setDropzone();
	tagLanes();
	tagCards();
	catalogLanes();
}
function restore() {
	let trashed = trashcan.pop();
	if (trashed) {
		trashed.style.display = 'block';
	}
	catalogLanes();
}
function setDropzone() {
	let zones = document.getElementsByClassName('dropzone');
	for (let zone of zones) {
		zone.style.height = window.innerHeight - zone.offsetTop - 70 + 'px';
	}
}
function changeBackground() {
	if (animation == false) {
		counter = backgrounds.indexOf(document.getElementById('bgImage').style.backgroundImage) + 1;
		animation = true;
		if (counter > 12) {
			counter = 0;
		}
		document.getElementById('bgImage').style.backgroundImage = backgrounds[counter];
		setTimeout(() => {
			animation = false;
		}, 500);
	}
}
function fullscreen() {
	if (screen.height == window.innerHeight) {
		document.exitFullscreen();
		setTimeout(() => {
			setDropzone();
		}, 1000);
	} else {
		document.body.requestFullscreen();
		setDropzone();
	}
}

document.addEventListener('keydown', function(e) {
	if (e.key == 'Enter') {
		if (document.getElementById('newLaneTitle') == document.activeElement) {
			e.preventDefault();
			laneFactory();
		}
		if (document.getElementById('newCardTitle') == document.activeElement) {
			e.preventDefault();
			cardFactory();
		}
	}
});
function changeColor(color) {
	editedCard.childNodes[0].style.color = 'white';
	if (color == 'none') {
		editedCard.childNodes[0].style.backgroundColor = 'rgb(68, 68, 68)';
		editedCard.style.borderColor = 'rgb(68, 68, 68)';
	} else if (color == '#FDE74C' || color == '#5BC0EB') {
		editedCard.childNodes[0].style.color = 'black';
		editedCard.childNodes[0].style.backgroundColor = color;
		editedCard.style.borderColor = color;
	} else {
		editedCard.childNodes[0].style.backgroundColor = color;
		editedCard.style.borderColor = color;
	}
	$.ajax({
		type: 'put',
		url: `http://localhost:3000/cards/${editedCard.id}`,
		data: { color: color }
	});
}
tagCards();
tagLanes();
window.onload = function() {
	document.querySelector('#bgImage').style.opacity = '1';
	setTimeout(() => {
		document.querySelector('header').style.opacity = '1';
	}, 250);
	setTimeout(() => {
		document.querySelector('#workspace').style.opacity = '1';
	}, 500);
};
function guid() {
	return Math.floor(Math.random() * 9999999999);
}
function catalogLanes() {
	let catalog = [];

	$.each($('.swimlane'), function() {
		if (this.style.display != 'none') {
			let title = this.children[0].innerText;
			let childlist = [];
			for (let child of this.children) {
				if (child.className == 'card' && child.style.display != 'none') {
					childlist.push(child.id);
				}
			}
			let lane = { title: title, cards: childlist };
			catalog.push(lane);
		}
	});
	jQuery.post('http://localhost:3000/catalog', { catalog: catalog }, null);
}
function updateLaneTitle(lane) {
	$.ajax({
		type: 'put',
		url: `http://localhost:3000/lanes/${lane.parentNode.id}`,
		data: { title: lane.innerText }
	});
}

$(document).ready(function() {
	let cards;
	let catalog;
	$.when(
		jQuery.get(`http://localhost:3000/cards`, function(res) {
			cards = res;
		}),
		jQuery.get(`http://localhost:3000/catalog`, function(res) {
			catalog = res;
		})
	).then(() => {
		for (let lane of catalog) {
			let newLane = document.createElement('div');
			let newCards = '';
			for (let cardId of lane.cards) {
				let info = cards.find((card) => card.id == cardId);
				let color = info.color;
				let newCard = document.createElement('div');
				newCard.id = cardId;
				newCard.classList = 'card';
				newCard.draggable = 'true';
				newCard.innerHTML = `<div onclick='editCard(this.parentNode)' class="cardTitle">${info.title}</div><div class='cardBody'>${info.body}</div>`;
				if (color == 'none') {
					newCard.childNodes[0].style.backgroundColor = 'rgb(68, 68, 68)';
					newCard.style.borderColor = 'rgb(68, 68, 68)';
				} else if (color == '#FDE74C' || color == '#5BC0EB') {
					newCard.childNodes[0].style.color = 'black';
					newCard.childNodes[0].style.backgroundColor = color;
					newCard.style.borderColor = color;
				} else {
					newCard.childNodes[0].style.backgroundColor = color;
					newCard.style.borderColor = color;
				}
				if (newCard.childNodes[1].innerHTML != '') {
					newCard.childNodes[1].style.display = 'block';
				} else {
					newCard.childNodes[1].style.display = 'none';
				}
				newCards += newCard.outerHTML;
			}
			newLane.classList = 'swimlane';
			newLane.draggable = 'true';
			newLane.innerHTML = `<div onfocusout="updateLaneTitle(this)" contenteditable="true" class="laneTitle">${lane.title}</div>${newCards}<div class="card dropzone"><div onclick="grabCardMaker(this)" class="cardBtn">+ Add Card</div></div>`;

			let position = document.getElementById('laneMaker');
			position.insertAdjacentElement('beforebegin', newLane);
		}
		hideLaneMaker();
		setDropzone();
		tagLanes();
		tagCards();
		catalogLanes();
	});
});
