(() => {
  const sendInnerText = () => {
    // Send a message to background.js with the current tab's innerText
    chrome.runtime.sendMessage({ innerText: getInnerText() });

    // Respond to popup.js with the current tab's innerText
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      if (request.action === "get-inner-text") {
        sendResponse({ innerText: getInnerText() });
      }
    });
  }

  // Content script runs on every page specified in the manifest
  window.addEventListener("load", sendInnerText);
  window.addEventListener("hashchange", sendInnerText);
  window.addEventListener("popstate", sendInnerText);
})();

// Return the innerText of various job posting pages
function getInnerText() {
  // Elements vary by website, so this gets the correct job description text depending on the url
  let innerText = document.body.innerText;
  if (window.location.origin === "https://www.indeed.com") {
    const el = document.getElementById("jobDescriptionText");
    if (el) innerText = el.innerText;
  } else if (window.location.origin === "https://www.ziprecruiter.com") {
    const el = document.getElementsByClassName("job_tile")[0];
    if (el) innerText = el.innerText
      .replace("By clicking the button above, I agree to the ZipRecruiter Terms of Use and acknowledge I have read the Privacy Policy, and agree to receive email job alerts.", "");
  }
  else if (window.location.origin === "https://www.simplyhired.com") {
    const el = document.getElementsByClassName("viewjob-section")[0];
    if (el) innerText = el.innerText;
  } else if (window.location.origin.includes('linkedin.com/jobs')) {
    const el = document.getElementsByClassName('jobs-description-content__text')[0];

    innerText = el && el.innerText || innerText;
  }

  return innerText;
}
