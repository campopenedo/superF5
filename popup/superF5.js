browser.runtime.onMessage.addListener((message) => {
    if(message.action == "alertToPopup" && message.information != null) {
        //TODO: Personalizated alert with a design like the rest of the extension
        insertPopup(message.information);
    }
});

//Send messages to background.js
document.getElementById("start-refreshing").addEventListener("click", (event) => {
    event.preventDefault();
    refreshingOptions();
});

document.getElementById("stop-refreshing").addEventListener("click", (event) => {
    event.preventDefault();
    sendStopAndClean();
});
window.addEventListener("unload", stopOptions);
window.addEventListener("load", stopOptions);

//Visual logic
document.getElementById("refresh-seconds").addEventListener("click", toggleButtonsWhenSecondsChange);
document.getElementById("stop-refresh-any-changes").addEventListener("click", toggleButtonsOnChangesInWebOptions);
document.getElementById("stop-refresh-specific-changes").addEventListener("click", toggleButtonsOnChangesInWebOptions);
document.getElementById("dont-wait-dom").addEventListener("click", toggleButtonsOnDontWaitDOM);

function refreshingOptions() {
    let secondsToRefresh = document.getElementById("refresh-seconds").value;
    if(secondsToRefresh == 0) {
        browser.runtime.sendMessage({action: "refreshWhenPageIsComplete"});
    } else if (secondsToRefresh != 0) {
        let dontWaitDOM = document.getElementById("dont-wait-dom").checked,
            stopRefreshInAnyChanges = document.getElementById("stop-refresh-any-changes").checked;
        if(stopRefreshInAnyChanges) {
            browser.runtime.sendMessage({action: "stopRefreshInAnyChanges", seconds: secondsToRefresh});
        } else if(dontWaitDOM) {
            browser.runtime.sendMessage({action: "dontWaitDOMWithSeconds", seconds: secondsToRefresh});
        } else {
            browser.runtime.sendMessage({action: "waitSecondsWhenCompleteToRefresh", seconds: secondsToRefresh});
        }
    }
}

function stopOptions() {
    let keepRefreshing = document.getElementById("refresh-in-background").checked;
    if(!keepRefreshing) sendStopAndClean();
}

function sendStopAndClean() {
    browser.runtime.sendMessage({action: "stopAndClean"});
}

function toggleButtonsWhenSecondsChange() {
    if(document.getElementById("refresh-seconds").value == 0) {
        document.getElementById("stop-refresh-any-changes").disabled = true;
        document.getElementById("stop-refresh-specific-changes").disabled = true;
        document.getElementById("alarm").disabled = true;
        document.getElementById("dont-wait-dom").disabled = true;   
    } else {
        document.getElementById("stop-refresh-any-changes").disabled = false;
        document.getElementById("stop-refresh-specific-changes").disabled = false;
        document.getElementById("alarm").disabled = false;
        document.getElementById("dont-wait-dom").disabled = false; 
    }
}

function toggleButtonsOnChangesInWebOptions() {
    document.getElementById("alarm").disabled = false;
}

function toggleButtonsOnDontWaitDOM() {
    document.getElementById("alarm").disabled = true;
}

function storeBody() {
    browser.runtime.sendMessage({action: "storeBody"});
}

function insertPopup(message) {
    let fade = document.createElement("div"),
    alert = document.createElement("div"),
    Okbutton = document.createElement("button");

    fade.style = "position:absolute;width:100%;height:100%;background:rgba(0,0,0,0.5);";
    fade.id = "fade-notification";
    //TODO: calculate the place of the alert comparing the size of the windows. See if we can do reactive button
    alert.style = "position:relative;width:fit-content;height:fit-content;padding:1%;background-color:white;border-radius:10px;top:40%;left:38%;border:2px solid black;display:flex;justify-content:center;align-items:center;flex-direction:column;opacity:1;";
    Okbutton.style = "border: 2px solid black;border-radius: 10px;font-size: 15px;font-weight: 600;background-color: #0071FF;color:#fff;"


    fade.appendChild(alert);
    
    Okbutton.appendChild(document.createTextNode("Ok"));
    alert.appendChild(document.createTextNode(message));

    alert.appendChild(Okbutton);
    fade.appendChild(alert);

    Okbutton.onclick = (e) => {
        let fade = document.getElementById("fade-notification");
        fade.parentNode.removeChild(fade);
    };

    document.body.insertBefore(fade, document.body.firstChild);
}