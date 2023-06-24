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
  
  async function createAnkiCard(deckName, highlightedText) {
    console.log("Creating Anki card with text: ", highlightedText);
  
    const modelName = "Basic"; // This is the model/template of the card, you can create your own model in Anki
    const front = highlightedText; // The text for the front of the card
    const back = "..." // The text for the back of the card, replace with whatever you want.
  
    const payload = {
      "action": "addNote",
      "version": 6,
      "params": {
        "note": {
          "deckName": deckName,
          "modelName": modelName,
          "fields": {
            "Front": front,
            "Back": back
          },
          "options": {
            "allowDuplicate": false
          },
          "tags": [] // You can add any tags here
        }
      }
    };
  
    const result = await fetch('http://localhost:8765', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  
    const data = await result.json();
  
    if(data.error) {
      console.log("Error creating Anki card: ", data.error);
    } else {
      console.log("Anki card created successfully");
    }
  }
  