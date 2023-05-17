browser.runtime.onMessage.addListener((message) => {
    if (message.type === "refresh") {
        const sendBody = new Promise((resolve) => {
            let message = {
                type: "send_body",
                payload: document.getElementsByTagName("body")[0].textContent
            };
            browser.runtime.sendMessage(message);
            resolve();
        });
        
        sendBody.then(() => window.location.reload());
    }
});