let sendedPartOfWeb;

browser.runtime.onMessage.addListener((message) => {
    if (message.type === "reload") {
        location.reload();
    }

    if(message.type === "getBodyToCompare") {
        browser.runtime.sendMessage({action: "bodySentToCompare", body: document.getElementsByTagName("body")[0].textContent});
    }

  //old escenarios - to delete - only for information purposes

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

        let result = sendSpecificContent();
        let message = {
            type: "part_selected",
            payload: result
        };
        browser.runtime.sendMessage(message);
    }
    
    if(message.type === "refresh_send_specific") {
        let result;
        if(message.payload.sectionId !== undefined) {
            result = document.getElementById(message.payload.sectionId).outerHTML
        }

        let messageSender = {
            type: "specific_part_selected",
            payload: result
        };
        browser.runtime.sendMessage(messageSender);
    }
});

function selectPart(content) {
    content.target.style.border = "1px solid red";
    sendedPartOfWeb = content.target;
    content.target.classList.add("superf5-extension-selection");
}

function unselectPart(content) {
    content.target.style.border = "";
    content.target.classList.remove("superf5-extension-selection");
}

function sendIfIsSectionClassUnique(sectionClass) {
    let classes =sectionClass.toString();
    if(document.getElementsByClassName(sectionClass).length > 1) {
        return '';
    } else {
        return classes;
    }
}

function sendSpecificContent() {
    let selectedPart = document.getElementsByClassName("superf5-extension-selection")[0].outerHTML
    ,sectionName = document.getElementsByClassName("superf5-extension-selection")[0].outerHTML.replace('<', '').split(' ')[0]
    ,sectionDOM = Array.from(document.getElementsByTagName(sectionName))
    ,DOMposition,
    sectionId,
    sectionClass;

    for(let x = 0; x < sectionDOM.length; x++) {
        if(sectionDOM[x].classList.contains("superf5-extension-selection")) {
            DOMposition = x;
            sectionId = document.getElementsByClassName("superf5-extension-selection")[0].id;
            sectionClass = document.getElementsByClassName("superf5-extension-selection")[0].classList;
            sectionClass.remove("superf5-extension-selection");
            break;
        }
    }

    let specificContentInfo = {
        "selectedPart": selectedPart,
        "DOMposition": DOMposition,
        "sectionName": sectionName,
        "sectionId": sectionId,
        "sectionClass": sendIfIsSectionClassUnique(sectionClass)
    }

    return JSON.stringify(specificContentInfo);
}

function cleanInfo() {
    if(localStorage.getItem("firstFullBody") != null) localStorage.removeItem("firstFullBody");
}