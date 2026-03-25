const NATIVE_HOST = "com.chrismyang.open_in_news";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openInNews") {
    chrome.runtime.sendNativeMessage(NATIVE_HOST, { url: message.url }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Native messaging error:", chrome.runtime.lastError.message);
      } else {
        console.log("Open in News response:", response);
      }
    });
  }
});
