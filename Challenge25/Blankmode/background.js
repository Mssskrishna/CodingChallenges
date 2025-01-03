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
  console.log(
    `Loaded settings: interval = ${customInterval}, duration = ${blankDuration}`
  );
}

// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TOGGLE_EXTENSION") {
    chrome.action.getBadgeText({}, async (prevState) => {
      const nextState = prevState === "ON" ? "OFF" : "ON";
      chrome.action.setBadgeText({ text: nextState });

      // Update the local storage for extensionState
      const extensionState = nextState === "ON" ? "on" : "off";
      chrome.storage.local.set({ extensionState });

      // Perform additional actions if needed
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
    });
  }

  if (message.type === "GET_STATE") {
    chrome.action.getBadgeText({}, (text) => {
      const state = text === "ON" ? "on" : "off";
      sendResponse({ state });
    });
    return true; // Keep the message channel open for async response
  }
});

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

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === "local" && (changes.interval || changes.duration)) {
    console.log("Settings changed:", changes);

    // Reload updated settings
    await loadSettings();

    // Check if the extension is currently "ON"
    const currentState = await chrome.action.getBadgeText({});
    if (currentState === "ON") {
      console.log("Updating alarms with new settings...");

      // Update the alarm with the new interval
      chrome.alarms.clear("blankScreenAlarm");
      chrome.alarms.create("blankScreenAlarm", {
        periodInMinutes: customInterval / (60 * 1000),
      });
    }
  }
});
