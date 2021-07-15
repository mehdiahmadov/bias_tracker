// Required for the findBias function
importScripts("lodash.min.js");
importScripts("analysis.js");


// Wait for a message with the current tab's innerText
chrome.runtime.onMessage.addListener((request, sender) => {
  // Find bias and update the extension icon accordingly
  const [bias] = findBias(request.innerText);
  if (bias < 50) {
    chrome.action.setIcon({
      path: "images/red16.png",
      tabId: sender.tab.id
    });      
  }
});
