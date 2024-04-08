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
    let secondsToRefresh = document.getElementById("refresh-seconds").value;
    browser.runtime.sendMessage({action: "getTabInfo"});

    if(secondsToRefresh == 0) {
        browser.runtime.sendMessage({action: "refreshWhenPageIsComplete"});
    } else if (secondsToRefresh != 0) {
        browser.runtime.sendMessage({action: "waitSecondsWhenCompleteToRefresh", seconds: secondsToRefresh});
    }
}

function stopOptions() {
    let keepRefreshing = document.getElementById("refresh-in-background").checked;
    if(!keepRefreshing) sendStopAndClean();
}

function sendStopAndClean() {
    browser.runtime.sendMessage({action: "stopAndClean"});
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