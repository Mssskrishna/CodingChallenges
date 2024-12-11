const intervalInput = document.getElementById("interval");
const durationInput = document.getElementById("duration");
const toggleButton = document.getElementById("toggleButton");
let settingsUpdateTimeout;

// Save settings with debounce to avoid frequent writes
document.getElementById("settings-form").addEventListener("submit", (event) => {
  event.preventDefault();
  clearTimeout(settingsUpdateTimeout);

  settingsUpdateTimeout = setTimeout(async () => {
    const interval = parseInt(intervalInput.value, 10) * 60 * 1000; // Convert minutes to milliseconds
    const duration = parseInt(durationInput.value, 10) * 1000; // Convert seconds to milliseconds

    // Save settings to chrome.storage
    await chrome.storage.local.set({ interval, duration });
    alert("Settings saved!");

    // Notify the background script about settings change
    chrome.runtime.sendMessage({ type: "SETTINGS_UPDATED" });
  }, 300); // Delay of 300ms
});

// Update toggle button text based on the extension state
function updateButton(state) {
  toggleButton.textContent = state === "on" ? "Turn Off" : "Turn On";
}

// Load and apply saved settings
async function loadSettings() {
  const { interval, duration } = await chrome.storage.local.get([
    "interval",
    "duration",
  ]);

  // Populate input fields with saved values
  if (interval) intervalInput.value = interval / (60 * 1000); // Convert ms to minutes
  if (duration) durationInput.value = duration / 1000; // Convert ms to seconds
}

// Load the current extension state and update the button
async function loadExtensionState() {
  const { extensionState } = await chrome.storage.local.get(["extensionState"]);
  const state = extensionState || "off"; // Default state is 'off'
  updateButton(state);
}

// Toggle the extension state when the button is clicked
toggleButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "TOGGLE_EXTENSION" });
});

// Initialize the popup on load
document.addEventListener("DOMContentLoaded", async () => {
  await loadSettings();
  await loadExtensionState();

  // Ensure button state is synced with background
  chrome.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
    const state = response?.state || "off";
    updateButton(state);
  });
});
