let refresh = false,
    firstRefresh = true,
    firstDOM = "",
    currentDOM = "";

browser.runtime.onMessage.addListener((message) => {
    if (message.type === "start_refresh") {
      browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {type: "start_refresh"});
        refresh = true;
      });
    }

    if (message.type === "send_DOM") {
        if(firstRefresh) {
            firstDOM = message.payload;
        } else {
            currentDOM = message.playload;
            firstRefresh = !firstRefresh;
        }
    }
  });