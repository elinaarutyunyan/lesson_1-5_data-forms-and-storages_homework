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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const card = collectCardData(form);
  console.log(card);
});