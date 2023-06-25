document.addEventListener('DOMContentLoaded', async () => {
  const deckSelector = document.getElementById('deck-selector');

  // Get the available decks from Anki
  const decks = await getAvailableDecks();

  // Populate the dropdown menu with the deck names
  decks.forEach(deckName => {
    const option = document.createElement('option');
    option.value = deckName;
    option.text = deckName;
    deckSelector.appendChild(option);
  });

  // Get the currently selected deck from local storage
  chrome.storage.sync.get('selectedDeck', data => {
    if (data.selectedDeck) {
      deckSelector.value = data.selectedDeck;
    }
  });

  // Save the selected deck to local storage when the selection changes
  deckSelector.addEventListener('change', e => {
    chrome.storage.sync.set({selectedDeck: e.target.value});
  });
});

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
