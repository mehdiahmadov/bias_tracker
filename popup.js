// Wait for the popup's content to load
window.addEventListener('load', async () => {
  // Get the current chrome tab
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
  // Get the current chrome tab's innerText
  chrome.tabs.sendMessage(tab.id, { action: "get-inner-text" }, ({ innerText, genderColors }) => {
    // Find bias and display
    const [bias, found, text] = findBias(innerText, { DEBUG: true });

    if (bias) {
      const biasEl = document.getElementById("bias");
      biasEl.innerText = bias.toFixed(2) + "%";
      biasEl.style.setProperty("color", bias > 2.0 ? "red" : "green");

      // Make sure the icon is set the same
      const greenPath = "images/circle_green.png";
      const redPath = "images/circle_red.png";

      chrome.action.setIcon({
        path: bias > 2.0 ? redPath : greenPath,
        tabId: tab.id,
      });
    }

    const tablesContainer = document.getElementById('tables-container');

    tablesContainer.innerHTML = '';

    for(let gender in found) {
      const words = found[gender];
      const table = createGenderWordsTable(gender, words, genderColors);

      tablesContainer.appendChild(table);
    }
  });
});

/**
 * Create the DOM node for a gender table.
 * @param {string} gender
 * @param {Set} words
 */
function createGenderWordsTable(gender, words, colors) {
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('th');

  headerCell.style.setProperty("background-color", colors[gender]);
  headerCell.classList.add("header");
  headerCell.textContent = gender;

  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);

  words.forEach(word => {
    const row = document.createElement('tr');
    const dataCell = document.createElement('td');

    dataCell.textContent = word;
    row.appendChild(dataCell);
    table.appendChild(row);
  });

  return table;
}
