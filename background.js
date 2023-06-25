chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      "id": "createAnkiCard",
      "title": "Create Anki Card",
      "contexts": ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "createAnkiCard") {
      let highlightedText = info.selectionText;
      chrome.storage.sync.get('deckName', function(data) {
        const deckName = data.deckName || 'Default';
        createAnkiCard(deckName, highlightedText);
      });
    }
  });

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message === "getDeckNames") {
        getAnkiDecks().then(deckNames => {
          sendResponse(deckNames);
        });
        return true;  // Will respond asynchronously.
      }
    }
  );
  
  async function getAnkiDecks() {
    const payload = {
      "action": "deckNames",
      "version": 6
    };
  
    const result = await fetch('http://localhost:8765', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  
    const data = await result.json();
  
    if (data.error) {
      console.log("Error fetching Anki decks: ", data.error);
      return null;
    } else {
      return data.result;
    }
  }
    