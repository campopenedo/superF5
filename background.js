browser.runtime.onMessage.addListener((message) => {

  if(message.action === "getTabInfo") {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      localStorage.setItem("tabIdToRefresh", tabs[0].id);
    });
  }

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
  let listeners = localStorage.getItem("refreshListenerList").split(",");
  listeners.forEach((listener) => {
    switch(listener) {
      case "refreshWhenPageIsComplete":
        browser.webNavigation.onCompleted.removeListener(sendRefreshWhenPageIsCompleteMessage);
        break; 
      case "RefreshWhenPageIsCompleteInSeconds":
        browser.webNavigation.onCompleted.removeListener(sendRefreshWhenPageIsCompleteInSecondsMessage);
        break;
      default:
        console.error("No listener found.");
    }
  })
}

function cleanTabInfo() {
  localStorage.removeItem("tabIdToRefresh");
  localStorage.removeItem("secondsToRefresh");
  localStorage.removeItem("waitingForRefresh");
}

function RefreshWhenPageIsComplete() {
  browser.webNavigation.onCompleted.addListener(sendRefreshWhenPageIsCompleteMessage);
  addToListenersList("refreshWhenPageIsComplete");
}

function sendRefreshWhenPageIsCompleteMessage() {
  browser.tabs.query({active: true, currentWindow: true}, () => {
    browser.tabs.sendMessage(Number(localStorage.getItem("tabIdToRefresh")), {type: "refreshWhenPageIsComplete"});
  });
}

function RefreshWhenPageIsCompleteInSeconds(seconds) {
  localStorage.setItem("secondsToRefresh", seconds);
  browser.webNavigation.onCompleted.addListener(sendRefreshWhenPageIsCompleteInSecondsMessage);
  addToListenersList("RefreshWhenPageIsCompleteInSeconds");
}
//TODO: dont wait for DOM to execute(recursive approach)
//TODO: clearTimeout in clear function
function sendRefreshWhenPageIsCompleteInSecondsMessage() {
  let miliseconds = Number(localStorage.getItem("secondsToRefresh")) * 1000;
  if(localStorage.getItem("waitingForRefresh") == null) {
    localStorage.setItem("waitingForRefresh", true)
    setTimeout(() => {
      browser.tabs.query({active: true, currentWindow: true}, () => {
        browser.tabs.sendMessage(Number(localStorage.getItem("tabIdToRefresh")), {type: "refreshWhenPageIsCompleteInSeconds"});
      });
      localStorage.removeItem("waitingForRefresh");
    }, miliseconds);
  }
}

function addToListenersList(listener) {
  if(localStorage.getItem("refreshListenerList") == null) {
    localStorage.setItem("refreshListenerList", listener);
  } else {
      let newLocalStorage = localStorage.getItem("refreshListenerList") + "," + listener;
      localStorage.setItem("refreshListenerList", newLocalStorage);
  }
}

function messageToPage(message) {
  browser.tabs.query({active: true, currentWindow: true}, () => {browser.tabs.sendMessage(Number(localStorage.getItem("tabIdToRefresh")), {type: message});});
}
