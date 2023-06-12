let sendedPartOfWeb;

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

    if(message.type === "selectPartOfWeb") {
        document.addEventListener("mouseover", selectPart);
        document.addEventListener("mouseout", unselectPart);
    }

    if(message.type === "stopSelectPartOfWeb") {
        document.removeEventListener("mouseover", selectPart);
        document.removeEventListener("mouseout", unselectPart);
    }


    if(message.type === "returnPartSelected") {
        document.removeEventListener("mouseover", selectPart);
        document.removeEventListener("mouseout", unselectPart);
        let message = {
            type: "part_selected",
            payload: sendedPartOfWeb.outerHTML
        };
        browser.runtime.sendMessage(message);
    }
});

function selectPart(content) {
    content.target.style.border = "1px solid red";
    sendedPartOfWeb = content.target;
}

function unselectPart(content) {
    content.target.style.border = "";
}