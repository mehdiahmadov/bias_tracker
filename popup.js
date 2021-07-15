// Wait for the popup's content to load
window.addEventListener("load", async () => {
  // Get the current chrome tab
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
  // Get the current chrome tab's innerText
  chrome.tabs.sendMessage(tab.id, { action: "get-inner-text" }, ({ innerText }) => {
    // Find bias and display
    const [bias] = findBias(innerText, { DEBUG: true });
    if (bias) document.getElementById("bias").innerText = bias.toFixed(2) + "%";
  });
});
