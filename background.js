let hasContextMenu = false;
let showOrHide;

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
    if ((request.contextMenu === "show" || request.contextMenu === "hide") && hasContextMenu === false) {
        showOrHide = request.contextMenu === "show";
        sendResponse({capture: true}); // tell the contentscript to capture the input element that was clicked 
        chrome.contextMenus.create({
            id:"passwordToggle", 
            title:`${request.contextMenu} password`, 
            contexts:["editable"]
        },
        ()=> hasContextMenu = true);
    }
    if (request.contextMenu === false && hasContextMenu === true) {
        chrome.contextMenus.remove("passwordToggle", ()=> hasContextMenu = false);
    }
  });

chrome.contextMenus.onClicked.addListener((info, tab)=> {
    if(info.menuItemId === "passwordToggle") {
        chrome.tabs.sendMessage(tab.id, {showPassword:showOrHide});
        chrome.contextMenus.remove("passwordToggle", ()=> hasContextMenu = false);
    }    
});
