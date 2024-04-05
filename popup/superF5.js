document.getElementById("start-refreshing").addEventListener("click", refreshingOptions);
document.getElementById("stop-refreshing").addEventListener("click", stopAndClean);
//TODO: dont stop when the app is close if the user press the refresh-in-background buttonºº
window.addEventListener("unload", stopAndClean);
document.getElementById("refresh-seconds").addEventListener("click", toggleButtonsDisponibility);

//Send messages to background.js
function refreshingOptions(event) {
    event.preventDefault();
    browser.runtime.sendMessage({action: "getTabInfo"});

    if(refreshWhenPageIsComplete()) {
        browser.runtime.sendMessage({action: "refreshWhenPageIsComplete"});
    }
}

function stopAndClean() {
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