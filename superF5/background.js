browser.runtime.onMessage.addListener((message) => {
  if (message.type === "refresh") {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {type: "refresh"});
      refresh = true;
    });
  }
});