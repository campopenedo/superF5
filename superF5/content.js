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

        //TODO: put this on another function
        sendedPartOfWeb.classList.add("superF5-extension-selection");
        let sectionName = document.getElementsByClassName("superF5-extension-selection")[0].outerHTML.replace('<', '').split(' ')[0];
        


        let message = {
            type: "part_selected",
            payload: sendedPartOfWeb.outerHTML
        };
        browser.runtime.sendMessage(message);
    }
    
    if(message.type === "refresh_send_specific") {
        let sectionName = document.getElementsByClassName("superf5-extension-selection")[0].outerHTML.replace('<', '').split(' ')[0];
        let sectionDOM = Array.from(document.getElementsByTagName(sectionName));
        let DOMposition;
        for(let x = 0; x < sectionDOM.length; x++) {
            if(sectionDOM[x].classList.contains("superf5-extension-selection")) {
                DOMposition = x;
                x = sectionDOM.length;
            }
        }

        //TODO: send the selected part, the DOM position and the sectionName to superF5.js for verify and upload
    }
});

function selectPart(content) {
    content.target.style.border = "1px solid red";
    sendedPartOfWeb = content.target;
}

function unselectPart(content) {
    content.target.style.border = "";
}