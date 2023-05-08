const form = document.querySelector("#location-create-form");
const errorDiv = document.querySelector("#error");

form.addEventListener("submit", (event) => {
  // Clear previous errors
  errorDiv.innerHTML = "";
  errorDiv.hidden = true;

  // Validate name field
  const nameInput = document.querySelector("#location_name");
  if (nameInput.value.trim() === "") {
    showError("Location Name is required !");
    event.preventDefault();
    return;
  }

  const descInput = document.querySelector("#location_desc");
  if (descInput.value.trim() === "") {
    showError("Description is required.");
    event.preventDefault();
    return;
  }

  // Validate location type field
  const typeInput = document.querySelector("#location_type");
  if (typeInput.value.trim() === "") {
    showError("Location type is required.");
    event.preventDefault();
    return;
  }

  // Validate opening hours field
  const openingHoursInput = document.querySelector("#opening_hours");
  if (openingHoursInput.value === "") {
    showError("Opening hours is required.");
    event.preventDefault();
    return;
  }

  // Validate closing hours field
  const closingHoursInput = document.querySelector("#closing_hours");
  if (closingHoursInput.value === "") {
    showError("Closing hours is required.");
    event.preventDefault();
    return;
  }

  // Validate location coordinates field
  const locationInput = document.querySelector("#location");
  if (locationInput.value.trim() === "") {
    showError("Location coordinates are required.");
    event.preventDefault();
    return;
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
      showError(`Coordinates for Entrance ${i + 1} are required.`);
      event.preventDefault();
      return;
    }
    if (!/^[YNyn]$/.test(entranceAccessInputs[i].value)) {
      showError(
        `Invalid accessibility value for Entrance ${i + 1}. Enter 'Y' or 'N'.`
      );
      event.preventDefault();
      return;
    }
  }
});

function showError(message) {
  const errorItem = document.createElement("p");
  errorItem.textContent = message;
  errorDiv.appendChild(errorItem);
  errorDiv.hidden = false;
}
