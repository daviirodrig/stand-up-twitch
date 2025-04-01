import { client } from "./chat";
import {
  getClapTriggers,
  getGaspTriggers,
  getLaughTriggers,
  setClapTriggers,
  setGaspTriggers,
  setLaughTriggers,
} from "./emotes";
import "./main.css";

// Type definition for action types
type ActionType = "laugh" | "gasp" | "clap";

// Get the current triggers for a specific action type
function getTriggersForType(type: ActionType): string[] {
  switch (type) {
    case "laugh":
      return getLaughTriggers();
    case "gasp":
      return getGaspTriggers();
    case "clap":
      return getClapTriggers();
    default:
      return [];
  }
}

// Save triggers for a specific action type
function saveTriggersForType(type: ActionType, triggers: string[]): void {
  switch (type) {
    case "laugh":
      setLaughTriggers(triggers);
      break;
    case "gasp":
      setGaspTriggers(triggers);
      break;
    case "clap":
      setClapTriggers(triggers);
      break;
  }
  showSaveStatus("Triggers updated!");
}

// Create a pill element for a trigger
function createTriggerPill(type: ActionType, text: string): HTMLDivElement {
  const pill = document.createElement("div");
  pill.className = "trigger-pill";

  const textSpan = document.createElement("span");
  textSpan.className = "trigger-pill-text";
  textSpan.textContent = text;
  pill.appendChild(textSpan);

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-trigger";
  removeBtn.textContent = "×";
  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    removeTrigger(type, text);
    pill.remove();
  });
  pill.appendChild(removeBtn);

  return pill;
}

// Remove a trigger
function removeTrigger(type: ActionType, text: string): void {
  const triggers = getTriggersForType(type).filter((t) => t !== text);
  saveTriggersForType(type, triggers);
}

// Render all pill elements for a specific type
function renderTriggerPills(type: ActionType): void {
  const pillsContainer = document.getElementById(`${type}-pills`);
  if (!pillsContainer) return;

  // Clear current pills
  pillsContainer.innerHTML = "";

  // Add a pill for each trigger
  const triggers = getTriggersForType(type);
  triggers.forEach((trigger) => {
    pillsContainer.appendChild(createTriggerPill(type, trigger));
  });
}

// Show the save status message
function showSaveStatus(message: string): void {
  const saveStatus = document.getElementById("save-status");
  if (!saveStatus) return;

  saveStatus.textContent = message;
  setTimeout(() => {
    saveStatus.textContent = "";
  }, 3000);
}

// Add a new trigger
function addTrigger(type: ActionType, text: string): void {
  if (!text.trim()) return;

  const triggers = getTriggersForType(type);

  // Only add if not already exists
  if (!triggers.includes(text)) {
    triggers.push(text);
    saveTriggersForType(type, triggers);
    renderTriggerPills(type);
  } else {
    showSaveStatus(`"${text}" already exists`);
  }
}

// Show the new trigger input form
function showNewTriggerInput(type: ActionType): void {
  const container = document.getElementById("new-trigger-container");
  const input = document.getElementById(
    "new-trigger-input"
  ) as HTMLInputElement;
  const saveBtn = document.getElementById("save-new-trigger");
  const cancelBtn = document.getElementById("cancel-new-trigger");

  if (!container || !input || !saveBtn || !cancelBtn) return;

  // Show the container
  container.classList.remove("hidden");
  input.value = "";
  input.focus();

  // Remove previous listeners
  const newSaveBtn = saveBtn.cloneNode(true);
  const newCancelBtn = cancelBtn.cloneNode(true);
  saveBtn.parentNode?.replaceChild(newSaveBtn, saveBtn);
  cancelBtn.parentNode?.replaceChild(newCancelBtn, cancelBtn);

  // Add type-specific listeners
  newSaveBtn.addEventListener("click", () => {
    addTrigger(type, input.value.trim());
    container.classList.add("hidden");
  });

  newCancelBtn.addEventListener("click", () => {
    container.classList.add("hidden");
  });

  // Handle enter key
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTrigger(type, input.value.trim());
      container.classList.add("hidden");
    }
  });
}

async function connectHandler(channel: string) {
  await client.join(channel);
}

document.addEventListener("DOMContentLoaded", () => {
  // Render the initial pills
  renderTriggerPills("laugh");
  renderTriggerPills("gasp");
  renderTriggerPills("clap");

  // Add event listeners for the add trigger buttons
  const addButtons = document.querySelectorAll(".add-trigger-btn");
  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.getAttribute("data-type") as ActionType;
      showNewTriggerInput(type);
    });
  });

  // Set up connection handler
  const connectButton = document.querySelector<HTMLButtonElement>("#connect");
  const channelInput = document.querySelector<HTMLInputElement>("#channel");

  if (connectButton && channelInput) {
    connectButton.addEventListener("click", () => {
      if (channelInput.value !== "") {
        connectHandler(channelInput.value);
      }
    });
  }
});
