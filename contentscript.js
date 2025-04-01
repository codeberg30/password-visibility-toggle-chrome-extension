let clickedEl = null;

document.addEventListener("mousedown", (event) => {
  if (event.button === 2 && event.target.nodeName === "INPUT") {
    const inputEl = event.target;

    if (inputEl.type === "password" && !inputEl.dataset.hiddenPassword) {
      chrome.runtime.sendMessage({ contextMenu: "show" }, response => {
        if (response?.capture) clickedEl = inputEl;
      });
    } else if (inputEl.dataset.hiddenPassword === "false") {
      inputEl.dataset.hiddenPassword = "true";
      chrome.runtime.sendMessage({ contextMenu: "hide" }, response => {
        if (response?.capture) clickedEl = inputEl;
      });
    } else {
      chrome.runtime.sendMessage({ contextMenu: false });
    }
  }
}, true);

chrome.runtime.onMessage.addListener((request) => {
  if (clickedEl) {
    if (request.showPassword) {
      clickedEl.type = "text";
      clickedEl.dataset.hiddenPassword = "false";
    } else {
      clickedEl.type = "password";
      delete clickedEl.dataset.hiddenPassword;
    }
    clickedEl = null;
  }
});
