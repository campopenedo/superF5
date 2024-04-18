browser.runtime.onMessage.addListener((message) => {
 
  if(message.action === "stopAndClean") {
    stopRefresh();
    cleanTabInfo();
  }

  if (message.action === "refreshWhenPageIsComplete") {
    RefreshWhenPageIsComplete();
    messageToPage("reload");
  }

  if(message.action === "waitSecondsWhenCompleteToRefresh") {
    RefreshWhenPageIsCompleteInSeconds(message.seconds);
    messageToPage("reload");
  }

  if(message.action === "dontWaitDOMWithSeconds") {
    refreshInSeconds(message.seconds);
    messageToPage("reload");
  }

  if(message.action === "stopRefreshInAnyChanges") {
    if(localStorage.getItem("firstFullBody") == null) {
      messageToPage("getBodyToCompare");
    }
    CompareBodyAndRefreshInSeconds(message.seconds);
    messageToPage("reload");
  }

  if(message.action == "bodySentToCompare") {
    if(localStorage.getItem("firstFullBody") == null) {
      localStorage.setItem("firstFullBody", message.body);
    } else {
      compareActualAndFirstBody(message.body);
    }
  }


  //old escenarios - to delete - only for information purposes
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
      browser.tabs.sendMessage(Number(tabs[0].id), {type: "refresh_send_specific", payload: { sectionId: message.payload }});
    });
  }
});

function stopRefresh() {
  if(localStorage.getItem("refreshListenerList") == null) return;

  let listeners = localStorage.getItem("refreshListenerList").split(",");
  listeners.forEach((listener) => {
    switch(listener) {
      case "refreshWhenPageIsComplete":
        browser.webNavigation.onCompleted.removeListener(sendRefreshWhenPageIsCompleteMessage);
        break; 
      case "RefreshWhenPageIsCompleteInSeconds":
        browser.webNavigation.onCompleted.removeListener(sendRefreshWhenPageIsCompleteInSecondsMessage);
        break;
      case "sendRefreshInSecondsMessage":
        browser.webNavigation.onBeforeNavigate.removeListener(sendRefreshInSecondsMessage);
        break;
      case "CompareBodyAndRefreshInSeconds":
        browser.webNavigation.onCompleted.removeListener(CompareBodyAndRefreshInSecondsMessage);
        break;
      default:
        console.error("No listener found: " + listener);
    }
  });
}

function cleanTabInfo() {
  if(localStorage.getItem("tabIdToRefresh") != null) localStorage.removeItem("tabIdToRefresh");
  if(localStorage.getItem("secondsToRefresh") != null) localStorage.removeItem("secondsToRefresh");
  if(localStorage.getItem("waitingForRefresh") != null) localStorage.removeItem("waitingForRefresh");
  if(localStorage.getItem("refreshListenerList") != null) localStorage.removeItem("refreshListenerList");
  if(localStorage.getItem("bodyInFirstRefresh") != null) localStorage.removeItem("bodyInFirstRefresh");
}

function RefreshWhenPageIsComplete() {
  browser.webNavigation.onCompleted.addListener(sendRefreshWhenPageIsCompleteMessage);
  addToListenersList("refreshWhenPageIsComplete");
}

function sendRefreshWhenPageIsCompleteMessage() {
  messageToPage("reload");
}

function RefreshWhenPageIsCompleteInSeconds(seconds) {
  localStorage.setItem("secondsToRefresh", seconds);
  browser.webNavigation.onCompleted.addListener(sendRefreshWhenPageIsCompleteInSecondsMessage);
  addToListenersList("RefreshWhenPageIsCompleteInSeconds");
}

function CompareBodyAndRefreshInSeconds(seconds) {
  localStorage.setItem("secondsToRefresh", seconds);
  browser.webNavigation.onCompleted.addListener(CompareBodyAndRefreshInSecondsMessage);
  addToListenersList("CompareBodyAndRefreshInSeconds");
}

function CompareBodyAndRefreshInSecondsMessage(tab) {
  if(tab.frameId == 0 && localStorage.getItem("waitingForRefresh") == null && localStorage.getItem("firstFullBody") != null) {
    messageToPageInMiliseconds("getBodyToCompare", Number(localStorage.getItem("secondsToRefresh")) * 1000);
  }
}

function sendRefreshWhenPageIsCompleteInSecondsMessage(tab) {
  if(tab.frameId == 0 && localStorage.getItem("waitingForRefresh") == null) {
    messageToPageInMiliseconds("reload", Number(localStorage.getItem("secondsToRefresh")) * 1000);
  }
}

function messageToPageInMiliseconds(message, miliseconds) {
  localStorage.setItem("waitingForRefresh", true);
  setTimeout(() => {
    if(localStorage.getItem("tabIdToRefresh") !== null) messageToPage(message);
    localStorage.removeItem("waitingForRefresh");
  }, miliseconds);
}

function refreshInSeconds(seconds) {
  localStorage.setItem("secondsToRefresh", seconds);
  browser.webNavigation.onBeforeNavigate.addListener(sendRefreshInSecondsMessage);
  addToListenersList("sendRefreshInSecondsMessage");
}

function sendRefreshInSecondsMessage(tab) {
  if(tab.frameId == 0 && localStorage.getItem("waitingForRefresh") == null ) {
    messageToPageInMiliseconds("reload", Number(localStorage.getItem("secondsToRefresh")) * 1000);
  }
}

function addToListenersList(listener) {
  let newLocalStorage = localStorage.getItem("refreshListenerList") == null ? listener
                        : localStorage.getItem("refreshListenerList") + "," + listener;
  localStorage.setItem("refreshListenerList", newLocalStorage);
}

function messageToPage(message) {
  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if(localStorage.getItem("tabIdToRefresh") === null) localStorage.setItem("tabIdToRefresh", tabs[0].id)
    browser.tabs.sendMessage(Number(localStorage.getItem("tabIdToRefresh")), {type: message});
  });
}

function compareActualAndFirstBody(actualBody) {
  if(localStorage.getItem("firstFullBody") != actualBody) {
    stopRefresh();
    cleanTabInfo();
    browser.runtime.sendMessage({action: "alertToPopup", information: "Body has change"});
  } else {
      location.reload();
  }
}