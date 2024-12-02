const chatBox = document.getElementById("chatBox");

// API Key and Base URL
const API_KEY = "c034c9674b3af3b3a8bc2d3d";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

// Welcome message on page load
window.onload = function () {
  addMessage("Hello! 👋 I'm Currency Convo💸. Ask me to convert any currency!", "bot-message");
};

// Send message on button click or Enter key press
function sendMessage() {
  const userInput = document.getElementById("userInput").value;
  if (userInput.trim() !== "") {
    addMessage(userInput, "user-message");
    document.getElementById("userInput").value = "";
    setTimeout(() => processUserInput(userInput), 500);
  }
}

// Add messages to the chatbox
function addMessage(message, className) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", className);
  messageElement.innerText = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Process user input
function processUserInput(input) {
  const regex = /convert\s*(\d+)\s*([a-zA-Z]{3})\s*to\s*([a-zA-Z]{3})/i;
  const match = input.match(regex);

  if (match) {
    const amount = parseFloat(match[1]);
    const fromCurrency = match[2].toUpperCase();
    const toCurrency = match[3].toUpperCase();
    convertCurrency(amount, fromCurrency, toCurrency);
  } else {
    addMessage("Please use a format like: 'Convert 100 USD to EUR'.", "bot-message");
  }
}

// Convert currency using API
async function convertCurrency(amount, fromCurrency, toCurrency) {
  try {
    const response = await fetch(`${BASE_URL}/latest/${fromCurrency}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }

    const data = await response.json();
    const rate = data.conversion_rates[toCurrency];

    if (rate) {
      const convertedAmount = (amount * rate).toFixed(2);
      addMessage(`Conversion: ${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`, "bot-message");
    } else {
      addMessage(`Sorry, I can't convert to ${toCurrency}.`, "bot-message");
    }
  } catch (error) {
    console.error("Error:", error);
    addMessage("An error occurred while fetching currency data. Please try again later.", "bot-message");
  }
}

// Handle Enter key press for message sending
function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}
