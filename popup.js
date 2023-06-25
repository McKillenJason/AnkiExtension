document.addEventListener('DOMContentLoaded', async () => {
  const deckSelector = document.getElementById('deck-selector');
  const modelSelector = document.getElementById('model-selector');
  const tagInput = document.getElementById('tag-input');

  // Get the available decks and models from Anki
  const decks = await getAvailableDecks();
  const models = await getAvailableModels();

  // Populate the deck dropdown menu
  decks.forEach(deckName => {
    const option = document.createElement('option');
    option.value = deckName;
    option.text = deckName;
    deckSelector.appendChild(option);
  });

  // Populate the model dropdown menu
  models.forEach(modelName => {
    const option = document.createElement('option');
    option.value = modelName;
    option.text = modelName;
    modelSelector.appendChild(option);
  });

  // Get the currently selected deck, model, and tag from storage
  chrome.storage.sync.get(['selectedDeck', 'selectedModel', 'tag'], data => {
    if (data.selectedDeck) {
      deckSelector.value = data.selectedDeck;
    }
    if (data.selectedModel) {
      modelSelector.value = data.selectedModel;
    }
    if (data.tag) {
      tagInput.value = data.tag;
    }
  });

  // Save the selected deck, model, and tag to storage when the selection changes
  deckSelector.addEventListener('change', e => {
    chrome.storage.sync.set({selectedDeck: e.target.value});
  });

  modelSelector.addEventListener('change', e => {
    chrome.storage.sync.set({selectedModel: e.target.value});
  });

  tagInput.addEventListener('change', e => {
    chrome.storage.sync.set({tag: e.target.value});
  });
});

async function getAvailableModels() {
  const payload = {
    "action": "modelNames",
    "version": 6
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
    console.log("Error getting models: ", resultData.error);
    return [];
  } else {
    return resultData.result;
  }
}


async function getAvailableDecks() {
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

  return data.result;
}
