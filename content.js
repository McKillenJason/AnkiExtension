chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.storage.sync.set({selectedText: request.text}, function() {
      console.log('Text saved');
    });
  });
  