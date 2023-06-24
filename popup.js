document.getElementById('createCardForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const tags = document.getElementById('tags').value.split(',');
    chrome.tabs.executeScript({
      code: `window.getSelection().toString();`
    }, function(results) {
      const highlightedText = results[0];
      chrome.storage.sync.get('deckName', function(data) {
        const deckName = data.deckName || 'Default';
        createAnkiCard(deckName, highlightedText, tags);
      });
    });
  });
  
  function createAnkiCard(deckName, highlightedText, tags) {
    // This is the same function as before, but now it also accepts tags as a parameter
    // and adds these to the payload.
  }
  