let showOrHide = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.contextMenu === "show" || request.contextMenu === "hide") {
    showOrHide = request.contextMenu === "show";

    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: "passwordToggle",
        title: `${request.contextMenu} password`,
        contexts: ["editable"]
      });
    });

    sendResponse({ capture: true });
  }

  if (request.contextMenu === false) {
    chrome.contextMenus.removeAll();
  }

  // Keep channel open for async response
  return true;
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "passwordToggle") {
    chrome.tabs.sendMessage(tab.id, { showPassword: showOrHide });
    chrome.contextMenus.removeAll();
  }
});
