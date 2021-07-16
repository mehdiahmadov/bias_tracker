// Wait for the popup's content to load
window.addEventListener("load", async () => {
  // Get the current chrome tab
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
  // Get the current chrome tab's innerText
  chrome.tabs.sendMessage(tab.id, { action: "get-inner-text" }, ({ innerText }) => {
    // Find bias and display
    const [bias, found, text] = findBias(innerText, { DEBUG: true });

    if (bias) document.getElementById("bias").innerText = bias.toFixed(2) + "%";

    const tablesContainer = document.getElementById('tables-container');

    tablesContainer.innerHTML = '';

    for(let gender in found) {
      const words = found[gender];
      const table = createGenderWordsTable(gender, words);

      tablesContainer.appendChild(table);
    }
  });
});

/**
 * Create the DOM node for a gender table.
 * @param {string} gender
 * @param {Set} words
 */
function createGenderWordsTable(gender, words) {
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('th');

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
