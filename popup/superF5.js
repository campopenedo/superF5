document.getElementById("start-refreshing").addEventListener("click", refreshingOptions);
document.getElementById("refresh-seconds").addEventListener("click", toggleButtonsDisponibility)

function refreshingOptions(event) {
    event.preventDefault();

    if(refreshWhenPageIsComplete()) {
        browser.runtime.sendMessage({action: "refreshWhenPageIsComplete"})
    }
}

function refreshWhenPageIsComplete() {
    return document.getElementById("refresh-seconds").value == 0;
}

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