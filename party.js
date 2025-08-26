// index.js

// ====== Global State ======
const state = {
  parties: [],
  selectedParty: null,
};

// ====== API Helpers ======
const BASE_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/events";

async function fetchParties() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch parties");
    const data = await res.json();
    state.parties = data.data;
    render();
  } catch (err) {
    console.error(err);
    renderError("Unable to load events. Please try again later.");
  }
}

async function fetchPartyById(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch party details");
    const data = await res.json();
    state.selectedParty = data.data;
    render();
  } catch (err) {
    console.error(err);
    renderError("Unable to load party details.");
  }
}

// ====== Components ======
function PartyList() {
  const container = document.createElement("div");
  container.className = "party-list";

  const heading = document.createElement("h2");
  heading.textContent = "Upcoming Events";
  container.appendChild(heading);

  const ul = document.createElement("ul");
  state.parties.forEach((party) => {
    const li = document.createElement("li");
    li.textContent = party.name;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => fetchPartyById(party.id));
    ul.appendChild(li);
  });

  container.appendChild(ul);
  return container;
}

function PartyDetails() {
  const container = document.createElement("div");
  container.className = "party-details";

  if (!state.selectedParty) {
    const msg = document.createElement("p");
    msg.textContent = "Select a party to see details.";
    container.appendChild(msg);
    return container;
  }

  const { id, name, date, description, location } = state.selectedParty;

  const title = document.createElement("h2");
  title.textContent = name;

  const idEl = document.createElement("p");
  idEl.textContent = `ID: ${id}`;

  const dateEl = document.createElement("p");
  dateEl.textContent = `Date: ${new Date(date).toLocaleString()}`;

  const descEl = document.createElement("p");
  descEl.textContent = `Description: ${description}`;

  const locEl = document.createElement("p");
  locEl.textContent = `Location: ${location}`;

  container.append(title, idEl, dateEl, descEl, locEl);
  return container;
}

function renderError(message) {
  const app = document.querySelector("#app");
  app.innerHTML = "";
  const errorMsg = document.createElement("p");
  errorMsg.style.color = "red";
  errorMsg.textContent = message;
  app.appendChild(errorMsg);
}

// ====== Render ======
function render() {
  const app = document.querySelector("#app");
  app.innerHTML = "";

  app.appendChild(PartyList());
  app.appendChild(PartyDetails());
}

// ====== Init ======
fetchParties();
