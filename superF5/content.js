browser.runtime.onMessage.addListener((message) => {
    if (message.type === "start_refresh") {
        
    }
});


document.addEventListener("DOMContentLoaded", (e) => {
    let message = {
        type: "send_DOM",
        payload: document.getElementsByTagName("body")[0].textContent
    };
    browser.runtime.sendMessage(message);
})