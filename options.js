document.getElementById('optionsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const deckName = document.getElementById('deckName').value;
    chrome.storage.sync.set({'deckName': deckName}, function() {
      console.log('Deck name saved: ', deckName);
    });
  });
  