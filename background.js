browser.runtime.onMessage.addListener((message) => {
  if (message.action === "refreshWhenPageIsComplete") {
    //TODO: filter for addEventlistener (only the actual tab)
    browser.webNavigation.onCompleted.addListener(sendRefreshWhenPageIsCompleteMessage);
    messageToPage("reload");
  }


  //---------------------
  if (message.type === "refresh") {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {type: "refresh"});
      refresh = true;
    });
  }

  if (message.type === "selectPartOfWeb") {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {type: "selectPartOfWeb"});
    });
  }

  if (message.type === "stopSelectPartOfWeb") {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {type: "stopSelectPartOfWeb"});
    });
  }

  if (message.type === "returnPartSelected") {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {type: "returnPartSelected"});
    });
  }

  if (message.type === "refresh_send_specific") {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {type: "refresh_send_specific", payload: { sectionId: message.payload }});
    });
  }
});

function messageToPage(message) {
  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {browser.tabs.sendMessage(tabs[0].id, {type: message});});
}

function sendRefreshWhenPageIsCompleteMessage() {
  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {type: "refreshWhenPageIsComplete"});
  });
}
