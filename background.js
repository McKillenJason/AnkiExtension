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
    createAnkiCard(highlightedText);
  }
});

async function createAnkiCard(highlightedText) {
  console.log("Creating Anki card with text: ", highlightedText);

  const front = highlightedText;
  const back = "...";

  // Get the selected deck, model, and tag from storage
  let selectedDeck = "Default"; // Default to "Default" if no deck is selected
  let selectedModel = "Basic"; // Default to "Basic" if no model is selected
  let tag = "";
  try {
    let data = await chrome.storage.sync.get(['selectedDeck', 'selectedModel', 'tag']);
    if (data.selectedDeck) {
      selectedDeck = data.selectedDeck;
    }
    if (data.selectedModel) {
      selectedModel = data.selectedModel;
    }
    if (data.tag) {
      tag = data.tag;
    }
  } catch (err) {
    console.error(`Error retrieving data from chrome.storage.sync: ${err}`);
  }

  const payload = {
    "action": "addNote",
    "version": 6,
    "params": {
      "note": {
        "deckName": selectedDeck,
        "modelName": selectedModel,
        "fields": {
          "Front": front,
          "Back": back
        },
        "options": {
          "allowDuplicate": false
        },
        "tags": [tag]
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

  const resultData = await result.json();

  if(resultData.error) {
    console.log("Error creating Anki card: ", resultData.error);
  } else {
    console.log("Anki card created successfully");
  }
}
