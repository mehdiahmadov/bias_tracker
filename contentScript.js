(() => {
  const communicateWithExtension = () => {
    const genderColors = getRandomColorsForTags(["masculine", "feminine"]);
    // Send a message to background.js with the current tab's innerText
    chrome.runtime.sendMessage({ innerText: parseHtmlForJobData()["innerText"] });

    // Respond to popup.js with the current tab's innerText
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      const { innerText, element } = parseHtmlForJobData();

      if (request.action === "get-inner-text") sendResponse({ innerText, genderColors });
      if (request.action === "highlight-inner-text" && request.found) highlightBiasedWords(element, request.found, genderColors);
    });
  }

  // Content script runs on every page specified in the manifest
  window.addEventListener("load", communicateWithExtension);
  window.addEventListener("hashchange", communicateWithExtension);
  window.addEventListener("popstate", communicateWithExtension);
})();

function getRandomColorsForTags(tags) {
  let colors = new Set();
  const tagColors = {};

  while (colors.size <= tags.length) {
    colors.add(`hsla(${Math.random() * 360}, 100%, 80%, 1)`);
  }

  colors = Array.from(colors);
  for (let i = 0; i < tags.length; i++) {
    tagColors[tags[i]] = colors[i];
  }

  return tagColors;
}

// Return the innerText and containing element of various job posting pages
function parseHtmlForJobData() {
  // Elements vary by website, so this gets the correct job description text depending on the url
  let innerText = document.body.innerText;
  let el = undefined;

  if (window.location.origin === "https://www.indeed.com") {
    el = document.getElementById("jobDescriptionText");
    if (el) innerText = el.innerText;
  }
  else if (window.location.origin === "https://www.ziprecruiter.com") {
    el = document.getElementsByClassName("job_tile")[0];
    if (el) innerText = el.innerText
      .replace("By clicking the button above, I agree to the ZipRecruiter Terms of Use and acknowledge I have read the Privacy Policy, and agree to receive email job alerts.", "");
  }
  else if (window.location.origin === "https://www.simplyhired.com") {
    el = document.getElementsByClassName("viewjob-section")[0];
    if (el) innerText = el.innerText;
  }
  else if (window.location.origin.includes('linkedin.com/jobs')) {
    el = document.getElementsByClassName('jobs-description-content__text')[0];
    innerText = el && el.innerText || innerText;
  }

  return {
    element: el,
    innerText
  };
}

function highlightBiasedWords(element, foundWords, genderColors) {
  Object.keys(genderColors).forEach(gender => {
    foundWords[gender].forEach(foundWord => {
      element.innerHTML = element.innerHTML.replace(foundWord, `<span style="background-color:${genderColors[gender]}">${foundWord}</span>`);
    });
  });
}
