let programStatus = {
    refresh: false,
    firstRefresh: true,
    firstBody: "",
    currentBody: "",
    stopRefresh: false,
    seekSpecificContent: false
},
programSettings = {
    secondsOfRefreshing: 0,
    dontWaitComparePages: false
}

document.getElementById("start-refreshing").addEventListener("click", (e) => {
    e.preventDefault();
    getSettings();
    document.getElementById("start-refreshing").setAttribute("disabled", "disabled");
    browser.runtime.sendMessage({type: "refresh"});
});

document.getElementById("stop-refreshing").addEventListener("click", (e) => {
    e.preventDefault();
    programStatus.stopRefresh = true;
});

document.getElementById("stop-refresh-specific-changes").addEventListener("change", (e) => {
    let contentSelectedInfo = document.getElementById("specific-content-selected"),
        howToSelect = document.getElementById("how-to-select");
    if(e.target.checked && !programStatus.seekSpecificContent) {
        programStatus.seekSpecificContent = true;

        contentSelectedInfo.innerText = "There is no element selected.";
        contentSelectedInfo.classList.remove("hidden");
        contentSelectedInfo.classList.add("visible");

        howToSelect.classList.remove("hidden");
        howToSelect.classList.add("visible");
    }
});

browser.runtime.onMessage.addListener((message) => {
    if (message.type === "send_body" && !programStatus.stopRefresh) {
        if(programStatus.firstRefresh) {
            firstData(message.payload);
            browser.runtime.sendMessage({ type: "refresh" });
        } else {
            programStatus.currentBody = message.payload;
            if(programStatus.firstBody === programStatus.currentBody) {
                setTimeout(() => {
                    browser.runtime.sendMessage({ type: "refresh" });
                }, (programSettings.secondsOfRefreshing * 1000));
            } else {
                alert("different data");
                restoreDefault();
            }
        }
    }

    if (programStatus.stopRefresh) {
        restoreDefault();
    }
});

function restoreDefault() {
    programStatus.refresh = false;
    programStatus.firstRefresh = true;
    programStatus.firstBody = "";
    programStatus.currentBody = "";
    programStatus.stopRefresh = false;
    document.getElementById("start-refreshing").removeAttribute("disabled");
}

function firstData(payload) {
    programStatus.firstBody = payload;
    programStatus.firstRefresh = !programStatus.firstRefresh;
}

function getSettings() {
    seconds = document.getElementById("refresh-seconds").value === ''
        ? 0
        : document.getElementById("refresh-seconds").value;
    programSettings.secondsOfRefreshing = parseInt(seconds);

    programSettings.comparePages = document.getElementById("dont-wait-dom").checked;
}