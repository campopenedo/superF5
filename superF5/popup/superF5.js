document.getElementById("start-refreshing").addEventListener("click", (e) => {
    e.preventDefault();
    browser.runtime.sendMessage({ type: "start_refresh" });
});