const form = document.querySelector("#location-create-form");

form.addEventListener("submit", (event) => {
  // Clear previous errors
  clearFieldErrors();

  // Track the first input field with an error
  let firstErrorField = null;

  // Validate name field
  const nameInput = document.querySelector("#location_name");
  if (nameInput.value.trim() === "") {
    showError(nameInput, "Name is required.");
    if (!firstErrorField) {
      firstErrorField = nameInput;
    }
    event.preventDefault();
  }

  // Validate description field
  const descInput = document.querySelector("#location_desc");
  if (descInput.value.trim() === "") {
    showError(descInput, "Description is required.");
    if (!firstErrorField) {
      firstErrorField = descInput;
    }
    event.preventDefault();
  }

  // Validate location type field
  const typeInput = document.querySelector("#location_type");
  if (typeInput.value.trim() === "") {
    showError(typeInput, "Location type is required.");
    if (!firstErrorField) {
      firstErrorField = typeInput;
    }
    event.preventDefault();
  }

  const openingHoursInput = document.querySelector("#opening_hours");
  const closingHoursInput = document.querySelector("#closing_hours");

  if (openingHoursInput.value === "") {
    showError(openingHoursInput, "Opening hours is required.");
    if (!firstErrorField) {
      firstErrorField = openingHoursInput;
    }
    event.preventDefault();
  } else if (closingHoursInput.value === "") {
    showError(closingHoursInput, "Closing hours is required.");
    if (!firstErrorField) {
      firstErrorField = closingHoursInput;
    }
    event.preventDefault();
  } else {
    const openingTime = new Date(`2000-01-01T${openingHoursInput.value}`);
    const closingTime = new Date(`2000-01-01T${closingHoursInput.value}`);

    if (closingTime <= openingTime) {
      showError(
        closingHoursInput,
        "Closing time must be greater than opening time."
      );
      if (!firstErrorField) {
        firstErrorField = closingHoursInput;
      }
      event.preventDefault();
    }
  }

  // Validate location coordinates field
  const locationInput = document.querySelector("#location");
  if (locationInput.value.trim() === "") {
    showError(locationInput, "Location coordinates are required.");
    if (!firstErrorField) {
      firstErrorField = locationInput;
    }
    event.preventDefault();
  }

  // Validate entrances
  const entranceInputs = document.querySelectorAll(
    '[name="location_entrances"]'
  );
  const entranceAccessInputs = document.querySelectorAll(
    '[name="entrance_access"]'
  );
  for (let i = 0; i < entranceInputs.length; i++) {
    if (entranceInputs[i].value.trim() === "") {
      showError(
        entranceInputs[i],
        `Coordinates for Entrance ${i + 1} are required.`
      );
      if (!firstErrorField) {
        firstErrorField = entranceInputs[i];
      }
      event.preventDefault();
    }
    if (!/^[YNyn]$/.test(entranceAccessInputs[i].value)) {
      showError(
        entranceAccessInputs[i],
        `Invalid accessibility value for Entrance ${i + 1}. Enter 'Y' or 'N'.`
      );
      if (!firstErrorField) {
        firstErrorField = entranceAccessInputs[i];
      }
      event.preventDefault();
    }
  }

  // Focus on the first input field with an error
  if (firstErrorField) {
    firstErrorField.focus();
  }
});

function showError(inputElement, message) {
  const errorElement = document.createElement("p");
  errorElement.textContent = message;
  errorElement.classList.add("field-error");
  inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
  inputElement.classList.add("input-error");
}

function clearFieldErrors() {
  const errorElements = document.querySelectorAll(".field-error");
  const inputElements = document.querySelectorAll(".form-input");
  errorElements.forEach((errorElement) => errorElement.remove());
  inputElements.forEach((inputElement) =>
    inputElement.classList.remove("input-error")
  );
}
