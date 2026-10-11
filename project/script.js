"use strict";

const form = document.querySelector(".card-form");

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
  showState("viewer");
});

cancelButton.addEventListener("click", () => {
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
  form.reset();
  showState("empty");
});