var clickedEl = null;

document.addEventListener("mousedown", (event)=>{
    //only handle right click on input elements
    if(event.button == 2 && event.target.nodeName === "INPUT" ) {        
        if(event.target.type === "password" && !event.target.dataset.hiddenPassword) {            
            chrome.runtime.sendMessage(
                {contextMenu: "show"}, 
                response => {
                    if(response && response.capture) clickedEl = event.target
                }
            );
        } else if(event.target.dataset.hiddenPassword === "false") {
            event.target.dataset.hiddenPassword = true;
            chrome.runtime.sendMessage(
                {contextMenu: "hide"}, 
                response => {
                    if(response && response.capture) clickedEl = event.target
                }
            );
        } else {
            chrome.runtime.sendMessage({contextMenu: false});
        }
    } 
}, true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
    if(request.showPassword) {
        clickedEl.type = "text";        
        clickedEl.dataset.hiddenPassword = false;
        clickedEl = null;
    }
    if(request.showPassword === false && clickedEl.dataset.hiddenPassword === "true") {
        clickedEl.type = "password";
        delete clickedEl.dataset.hiddenPassword;
        clickedEl = null;
    }
  });