let blankDuration = 60 * 1000; // Default: 1 minute
let customInterval = 15 * 60 * 1000; // Default: 15 minutes

// Function to load user settings from storage
async function loadSettings() {
  const { interval, duration } = await chrome.storage.local.get([
    "interval",
    "duration",
  ]);
  if (interval) customInterval = interval;
  if (duration) blankDuration = duration;
  console.log(`Loaded settings: interval = ${customInterval}, duration = ${blankDuration}`);
}

// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STATE_CHANGE") {
    console.log(`Received state change: ${message.state}`);
    // Handle the state change (e.g., enable/disable features)
  }

  if (message.type === "TOGGLE_EXTENSION") {
    toggleExtension();
  }
});

// Toggle extension state and create or clear alarms accordingly
async function toggleExtension() {
  const prevState = await chrome.action.getBadgeText({});
  const nextState = prevState === "ON" ? "OFF" : "ON";
  chrome.action.setBadgeText({ text: nextState });

  if (nextState === "ON") {
    console.log("Starting blank mode...");
    await loadSettings(); // Load settings before starting blank mode
    chrome.alarms.create("blankScreenAlarm", {
      periodInMinutes: customInterval / (60 * 1000),
    });
  } else {
    console.log("Stopping blank mode...");
    chrome.alarms.clear("blankScreenAlarm");
  }
}

// Set badge text to "OFF" on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: "OFF" });
  loadSettings(); // Load settings on installation
});

// Function to blank the page
async function blankPage(tabId) {
  try {
    console.log("Blanking page...");
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: ["blankmode.css"],
    });

    setTimeout(async () => {
      console.log("Removing blank CSS...");
      await chrome.scripting.removeCSS({
        target: { tabId },
        files: ["blankmode.css"],
      });
    }, blankDuration);
  } catch (error) {
    console.error("Error during blanking:", error);
  }
}

// Handle alarms and trigger blanking action
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "blankScreenAlarm") {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab) {
      await blankPage(tab.id);
    }
  }
});
