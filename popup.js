
  
  document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.getBackgroundPage(function(backgroundPage) {
      backgroundPage.getAnkiDecks().then(function(decks) {
        const selectElement = document.getElementById('deckName');
        decks.forEach(function(deckName) {
          const optionElement = document.createElement('option');
          optionElement.value = deckName;
          optionElement.textContent = deckName;
          selectElement.appendChild(optionElement);
        });
      });
    });
  });

  document.getElementById('createCardForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const deckName = document.getElementById('deckName').value; // Get the selected deck name
    const tags = document.getElementById('tags').value.split(',');
  
    chrome.tabs.executeScript({
      code: `window.getSelection().toString();`
    }, function(results) {
      const highlightedText = results[0];
      createAnkiCard(deckName, highlightedText, tags); // Pass the selected deck name here
    });
  });
  
  
  function createAnkiCard(deckName, highlightedText, tags) {
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
          "tags": tags // Add the tags to the note
        }
      }
    };
  
    fetch('http://localhost:8765', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.log("Error creating Anki card: ", data.error);
      } else {
        console.log("Anki card created successfully");
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  chrome.runtime.sendMessage({message: "getDeckNames"}, function(response) {
    const selectElement = document.getElementById('deckName');
    response.forEach(function(deckName) {
      const optionElement = document.createElement('option');
      optionElement.value = deckName;
      optionElement.textContent = deckName;
      selectElement.appendChild(optionElement);
    });
  });
    
  