let refresh = false,
    firstRefresh = true,
    firstBody = "",
    currentBody = "",
    stopRefresh = false;

document.getElementById("start-refreshing").addEventListener("click", (e) => {
    e.preventDefault();
    browser.runtime.sendMessage({ type: "refresh" });
});

document.getElementById("stop-refreshing").addEventListener("click", (e) => {
    e.preventDefault();
    stopRefresh = true;
});

browser.runtime.onMessage.addListener((message) => {
    if (message.type === "send_body" && !stopRefresh) {
        if(firstRefresh) {
            firstData(message.payload);
            browser.runtime.sendMessage({ type: "refresh" });
        } else {
            currentBody = message.payload;
            if(firstBody === currentBody) {
                browser.runtime.sendMessage({ type: "refresh" });
            } else {
                alert("different data");
                restoreDefault();
            }
        }
    }

    if (stopRefresh) {
        restoreDefault();
    }
});

function restoreDefault() {
    refresh = false;
    firstRefresh = true;
    firstBody = "";
    currentBody = "";
    stopRefresh = false;
}

function firstData(payload) {
    firstBody = payload;
    firstRefresh = !firstRefresh;
}