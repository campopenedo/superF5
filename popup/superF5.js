//Send messages to background.js
//TODO: stop refreshing if the web changes, and set an optional alarm to it
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
document.getElementById("stop-refresh-any-changes").addEventListener("click", storeBody);

//Visual logic
document.getElementById("refresh-seconds").addEventListener("click", toggleButtonsWhenSecondsChange);
document.getElementById("stop-refresh-any-changes").addEventListener("click", toggleButtonsOnChangesInWebOptions);
document.getElementById("stop-refresh-specific-changes").addEventListener("click", toggleButtonsOnChangesInWebOptions);
document.getElementById("dont-wait-dom").addEventListener("click", toggleButtonsOnDontWaitDOM);

function refreshingOptions() {
    let secondsToRefresh = document.getElementById("refresh-seconds").value;
    browser.runtime.sendMessage({action: "getTabInfo"});

    if(secondsToRefresh == 0) {
        browser.runtime.sendMessage({action: "refreshWhenPageIsComplete"});
    } else if (secondsToRefresh != 0) {
        let dontWaitDOM = document.getElementById("dont-wait-dom").checked;
        if(dontWaitDOM) {
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