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

document.getElementById("refresh-seconds").addEventListener("click", toggleButtonsDisponibility);

//Send messages to background.js
function refreshingOptions() {
    browser.runtime.sendMessage({action: "getTabInfo"});

    if(refreshWhenPageIsComplete()) {
        browser.runtime.sendMessage({action: "refreshWhenPageIsComplete"});
    }
}

function stopOptions() {
    let keepRefreshin = document.getElementById("refresh-in-background").checked;
    if(!keepRefreshin) sendStopAndClean();
}

function sendStopAndClean() {
    browser.runtime.sendMessage({action: "stopAndClean"});
}

//Helpers
function refreshWhenPageIsComplete() {
    return document.getElementById("refresh-seconds").value == 0;
}

//Visual logic
function toggleButtonsDisponibility() {
    if(document.getElementById("refresh-seconds").value == 0) {
        document.getElementById("stop-refresh-any-changes").disabled = true;
        document.getElementById("stop-refresh-specific-changes").disabled = true;
        document.getElementById("alarm").disabled = true;        
    } else {
        document.getElementById("stop-refresh-any-changes").disabled = false;
        document.getElementById("stop-refresh-specific-changes").disabled = false;
        document.getElementById("alarm").disabled = false;   
    }
}