//TODO: refresh without first refresh to get first data

let programStatus = {
    refresh: false,
    firstRefresh: true,
    firstBody: "",
    currentBody: "",
    stopRefresh: false,
    seekSpecificContent: false,
    specificContent: "",
    alarmSound: false
},
programSettings = {
    secondsOfRefreshing: 0,
    dontWaitComparePages: false,
    alarm:new Audio(browser.extension.getURL('audio/alarm.wav'))
}

document.getElementById("start-refreshing").addEventListener("click", (e) => {
    e.preventDefault();
    getSettings();
    document.getElementById("start-refreshing").setAttribute("disabled", "disabled");
    if(document.getElementById("stop-refresh-specific-changes").checked) {
        browser.runtime.sendMessage({type: "refresh_send_specific"})
    } else {
        browser.runtime.sendMessage({type: "refresh"});
    }
});

document.getElementById("stop-refreshing").addEventListener("click", (e) => {
    e.preventDefault();
    programStatus.stopRefresh = true;
});

document.getElementById("stop-refresh-specific-changes").addEventListener("change", (e) => {
    if(e.target.checked && !programStatus.seekSpecificContent) {
        startSeekSpecificContent();
    }
});

document.getElementById("stop-refresh-any-changes").addEventListener("change", (e) => {
    if(programStatus.seekSpecificContent || (!programStatus.seekSpecificContent && programStatus.specificContent.length > 0)) {
        exitSeekSpecificContent();
    }
});

document.getElementById("dont-wait-dom").addEventListener("change", (e) => {
    if(programStatus.seekSpecificContent || (!programStatus.seekSpecificContent && programStatus.specificContent.length > 0)) {
        exitSeekSpecificContent();
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
                if(programSettings.alarmSound) {
                alarmSound();
                alert("different data. Click Ok to stop alarm");
                stopAlarmSound();
                } else {
                    alert("different data");
                }
                restoreDefault();
            }
        }
    }
    else if(message.type === "specific_part_selected" && !programStatus.stopRefresh) {
        //TODO: save specific part selected data, see if we can compare with ids or classes, and if not, compare with DOM.
        if(programStatus.specificContent.sectionId !== "") {
            setTimeout(() => {
                browser.runtime.sendMessage({ type: "refresh_send_specific", payload: programStatus.specificContent.sectionId});
            }, (programSettings.secondsOfRefreshing * 1000));
            return;
        }

        if(programStatus.specificContent.sectionClass !== "") {
            console.log("unique class")
            return;
        }
    }

    else if(message.type === "part_selected" && !programStatus.stopRefresh) {
        let selectedContentAdvise = document.getElementById("specific-content-selected");
        programStatus.specificContent = JSON.parse(message.payload);
        selectedContentAdvise.innerText = "Element selected.";
        selectedContentAdvise.classList.add("content-selected");
        document.getElementById("how-to-select").classList.add("hidden");

        if(programStatus.specificContent.sectionId === "" && programStatus.specificContent.sectionClass === "") {
            alert("The section you choose may have difficulties to analize(is rare, but it can happen), if you can, choose another");
        }
    }

    else if (programStatus.stopRefresh) {
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
    programStatus.alarmSound = false;
    programSettings.alarm.currentTime = 0;
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
    programSettings.alarmSound = document.getElementById("alarm").checked;
}

function getSpecificContent(keyForAccept) {
    if(keyForAccept.key === " ") {
        browser.runtime.sendMessage({type: "returnPartSelected"});
        programStatus.seekSpecificContent = false;
        document.removeEventListener("keydown", getSpecificContent);
    }
}

function exitSeekSpecificContent() {
    let contentSelectedInfo = document.getElementById("specific-content-selected"),
    howToSelect = document.getElementById("how-to-select");
    programStatus.seekSpecificContent = false;
    programSettings.specificContent = "";

    contentSelectedInfo.classList.remove("visible");
    if(contentSelectedInfo.classList.contains("content-selected")) {
        contentSelectedInfo.classList.remove("content-selected")
    }
    contentSelectedInfo.classList.add("hidden");

    howToSelect.classList.remove("visible");
    howToSelect.classList.add("hidden");

    browser.runtime.sendMessage({type: "stopSelectPartOfWeb"});
    document.removeEventListener("keydown", getSpecificContent);
}

function startSeekSpecificContent() {
    programStatus.seekSpecificContent = true;
    let contentSelectedInfo = document.getElementById("specific-content-selected"),
    howToSelect = document.getElementById("how-to-select");

    contentSelectedInfo.innerText = "There is no element selected.";
    contentSelectedInfo.classList.remove("hidden");
    contentSelectedInfo.classList.add("visible");

    howToSelect.classList.remove("hidden");
    howToSelect.classList.add("visible");
    browser.runtime.sendMessage({type: "selectPartOfWeb"});
    document.addEventListener("keydown", getSpecificContent);
}

function alarmSound() {
    programSettings.alarm.play();
    programSettings.alarm.addEventListener("ended", extendedSound);
}

function extendedSound() {
    programSettings.alarm.play();
    programSettings.alarm.currentTime = 0;
}

function stopAlarmSound() {
    programSettings.alarm.removeEventListener("ended", extendedSound);
    programSettings.alarm.pause();
}