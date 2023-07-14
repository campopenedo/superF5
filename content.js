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
        sendedPartOfWeb.classList.remove("superF5-extension-selection");


        let message = {
            type: "part_selected",
            payload: sendedPartOfWeb.outerHTML
        };
        browser.runtime.sendMessage(message);
    }
    
    if(message.type === "refresh_send_specific") {
        let selectedPart = document.getElementsByClassName("superf5-extension-selection")[0].outerHTML
            ,sectionName = document.getElementsByClassName("superf5-extension-selection")[0].outerHTML.replace('<', '').split(' ')[0]
            ,sectionDOM = Array.from(document.getElementsByTagName(sectionName))
            ,DOMposition,
            sectionId,
            sectionClass;

            console.log(sectionDOM)

        for(let x = 0; x < sectionDOM.length; x++) {
            if(sectionDOM[x].classList.contains("superf5-extension-selection")) {
                DOMposition = x;
                sectionId = document.getElementsByClassName("superf5-extension-selection")[0].id;
                sectionClass = document.getElementsByClassName("superf5-extension-selection")[0].classList;
                console.log(sectionClass)
                sectionClass.remove("superf5-extension-selection");
                console.log(sectionClass)
                break;
            }
        }

        let result = {
            "selectedPart": selectedPart,
            "DOMposition": DOMposition,
            "sectionName": sectionName,
            "sectionId": sectionId,
            "sectionClass": sendIfIsSectionClassUnique(sectionClass)
        }

        console.log(result)

        let message = {
            type: "specific_part_selected",
            payload: result
        };
        browser.runtime.sendMessage(message);
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