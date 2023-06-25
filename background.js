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

  const modelName = "Basic";
  const front = highlightedText;
  const back = "...";

  // Get the selected deck from local storage
  let selectedDeck = "OPMI"; // Default to "OPMI" if no deck is selected
  try {
    let data = await chrome.storage.sync.get(['selectedDeck']);
    if (data.selectedDeck) {
      selectedDeck = data.selectedDeck;
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
        "modelName": modelName,
        "fields": {
          "Front": front,
          "Back": back
        },
        "options": {
          "allowDuplicate": false
        },
        "tags": []
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
