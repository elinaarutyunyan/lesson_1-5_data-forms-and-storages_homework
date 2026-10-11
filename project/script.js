"use strict";

const STORAGE_KEY = "hw5.landmark.card";

const DRAFT_KEY = "hw5.landmark.draft";

const form = document.querySelector(".card-form");
const statusElement = document.querySelector(".workspace__status");
const defaultStatus = statusElement.textContent;
let statusTimer = null;

function collectCardData(formElement) {
  const formData = new FormData(formElement);
  return {
    title: formData.get("title"),
    country: formData.get("country"),
    type: formData.get("type"),
    year: formData.get("year"),
    description: formData.get("description"),
  };
}

const panels = {
  empty: document.querySelector('[data-state-panel="empty"]'),
  editor: document.querySelector('[data-state-panel="editor"]'),
  viewer: document.querySelector('[data-state-panel="viewer"]'),
};

const createButton = document.querySelector('[data-action="create"]');
const cancelButton = document.querySelector('[data-action="cancel"]');
const editButton = document.querySelector('[data-action="edit"]');
const deleteButton = document.querySelector('[data-action="delete"]');

let currentCard = null;

function showState(name) {
  Object.values(panels).forEach((panel) => {
    panel.hidden = true;
  });
  panels[name].hidden = false;
}

function flashStatus(message) {
  statusElement.textContent = message;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    statusElement.textContent = defaultStatus;
  }, 1500);
}

const typeLabels = {
  architecture: "Архитектура",
  nature: "Природный объект",
  museum: "Музей",
  monument: "Памятник",
  other: "Другое",
};

function renderCard(card) {
  document.querySelector('[data-view="title"]').textContent = card.title;
  document.querySelector('[data-view="country"]').textContent = card.country;
  document.querySelector('[data-view="type"]').textContent =
    typeLabels[card.type] ?? card.type;
  document.querySelector('[data-view="year"]').textContent = card.year;
  document.querySelector('[data-view="description"]').textContent = card.description;
}

function fillForm(card) {
  form.elements.title.value = card.title;
  form.elements.country.value = card.country;
  form.elements.type.value = card.type;
  form.elements.year.value = card.year;
  form.elements.description.value = card.description;
}

createButton.addEventListener("click", () => {
  form.reset();
  showState("editor");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  currentCard = collectCardData(form);
  renderCard(currentCard);
  saveCard(currentCard); 
  removeDraft();
  showState("viewer");
});

cancelButton.addEventListener("click", () => {
  removeDraft();    
  if (currentCard) {
    showState("viewer");
  } else {
    showState("empty");
  }
});

editButton.addEventListener("click", () => {
  if (!currentCard) return;
  fillForm(currentCard);
  showState("editor");
});

deleteButton.addEventListener("click", () => {
  currentCard = null;
  removeCard();  
  removeDraft();
  form.reset();
  showState("empty");
});

function saveCard(card) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(card));
}

function loadCard() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

function removeCard() {
  localStorage.removeItem(STORAGE_KEY);
}

function saveDraft() {
  const draft = collectCardData(form);
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function loadDraft() {
  const raw = sessionStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

function removeDraft() {
  sessionStorage.removeItem(DRAFT_KEY);
}

form.addEventListener("input", () => {
  saveDraft();
  flashStatus("Черновик сохранён");
});

const savedCard = loadCard();
if (savedCard) {
  currentCard = savedCard;
  renderCard(savedCard);
  showState("viewer");
} else {
  const draft = loadDraft();
  if (draft) {
    fillForm(draft);
    showState("editor");
  } else {
    showState("empty");
  }
}