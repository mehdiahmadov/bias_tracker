// Required for the findBias function
importScripts("lodash.min.js");
importScripts("analysis.js");


// Wait for a message with the current tab's innerText
chrome.runtime.onMessage.addListener((request, sender) => {
  // Find bias and update the extension icon accordingly
  const [bias] = findBias(request.innerText);
  const greenPath = "images/circle_green.png";
  const redPath = "images/circle_red.png";

  chrome.action.setIcon({
    path: bias > 1.0 ? redPath : greenPath,
    tabId: sender.tab.id
  });
});
