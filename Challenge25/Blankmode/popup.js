const intervalInput = document.getElementById("interval");
const durationInput = document.getElementById("duration");
document
  .getElementById("settings-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const interval =
      parseInt(document.getElementById("interval").value, 10) * 60 * 1000; // Convert minutes to milliseconds
    const duration =
      parseInt(document.getElementById("duration").value, 10) * 1000; // Convert seconds to milliseconds

    // Save settings to chrome.storage
    await chrome.storage.local.set({ interval, duration });

    alert("Settings saved!");

    // Notify the background script about settings change
    chrome.runtime.sendMessage({ type: "SETTINGS_UPDATED" });
  });

// Get button element
const toggleButton = document.getElementById("toggleButton");

// Load the current state from storage
chrome.storage.local.get(["extensionState"], (result) => {
  const state = result.extensionState || "off"; // Default state is 'off'
  updateButton(state);
});

// Handle button click
toggleButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "TOGGLE_EXTENSION" });
});
// Update button text based on state
function updateButton(state) {
  toggleButton.textContent = state === "on" ? "Turn Off" : "Turn On";
}
// Load the stored settings on popup load
document.addEventListener("DOMContentLoaded", async () => {
  const { interval, duration } = await chrome.storage.local.get([
    "interval",
    "duration",
  ]);

  // Populate the input fields with saved values
  if (interval) intervalInput.value = interval / (60 * 1000); // Convert ms to minutes
  if (duration) durationInput.value = duration / 1000; // Convert ms to seconds
});
chrome.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
  const state = response?.state || "off";
  updateButton(state);
});
