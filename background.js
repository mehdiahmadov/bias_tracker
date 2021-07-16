// Required for the findBias function
importScripts("lodash.min.js");
importScripts("analysis.js");

let timeoutId;

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    chrome.action.setIcon({
      path: 'images/circle_grey.png',
      tabId,
    });

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      chrome.tabs.sendMessage(tabId, { action: "get-inner-text" }, ({ innerText }) => {
        const [bias] = findBias(innerText);
        const greenPath = "images/circle_green.png";
        const redPath = "images/circle_red.png";

        chrome.action.setIcon({
          path: bias > 2.0 ? redPath : greenPath,
          tabId,
        });
      });
    }, 1500);

  }
);
