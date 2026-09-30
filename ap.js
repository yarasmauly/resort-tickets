// 1. Initialize Firebase with your project credentials
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const ticketsRef = database.ref('tickets');

// 2. Function to add a new ticket
function createTicket() {
  const department = prompt("Enter Department (e.g. Maintenance, IT, Housekeeping):");
  const issue = prompt("Describe the issue:");

  if (department && issue) {
    const newTicket = {
      department: department,
      issue: issue,
      timestamp: new Date().toLocaleString()
    };
    ticketsRef.push(newTicket); // Saves directly to Google Cloud
  }
}

// 3. Listen for changes in Realtime
ticketsRef.on('value', (snapshot) => {
  const container = document.getElementById('ticket-container');
  const countDisplay = document.getElementById('total-count');
  const data = snapshot.val();

  if (!data) {
    container.innerHTML = "<p>No tickets yet. Create one!</p>";
    countDisplay.innerText = "0";
    return;
  }

  container.innerHTML = ""; // Clear existing elements
  const ticketKeys = Object.keys(data);
  countDisplay.innerText = ticketKeys.length;

  ticketKeys.forEach((key) => {
    const item = data[key];
    const ticketDiv = document.createElement('div');
    ticketDiv.className = 'ticket-item';
    ticketDiv.innerHTML = `
      <strong>[${item.department}]</strong> ${item.issue}
      <br><small style="color:#777">${item.timestamp}</small>
    `;
    container.prepend(ticketDiv); // Show newest ticket at top
  });
});