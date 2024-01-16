const API_BASE_URL = "https://geofon.gfz-potsdam.de/fdsnws/station/1/query"; //base api url

var map = L.map("map").setView([52.52, 13.405], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

var globalStations = [];

// 1st API call
function fetchNetworks() { 
  return fetch(`${API_BASE_URL}?level=network&format=text`)
    .then((response) => response.text())
    .then(parseNetworks)
    .catch((error) => console.error("Error fetching networks:", error));
}
// parse the data from the response: text -> json
function parseNetworks(data) {
  var lines = data.split("\n");
  return lines.slice(1, -1).map((line) => line.split("|")[0]);
}

function updateNetworkDropdown(networks) {
  var dropdown = document.getElementById("networksDropdownMenu"); // networksDropdownMenu: get html by ID
  networks.forEach((network) => { // for-loop
    var option = document.createElement("option"); // network
    option.value = network;
    option.text = network;
    dropdown.add(option); // add network to dropdown
  });
}

// 2nd API call
function fetchStations(network) {
  return fetch(`${API_BASE_URL}?network=${network}&level=station&format=text`)
    .then((response) => response.text())
    .then(parseStations)
    .catch((error) => console.error("Error fetching stations:", error));
}

function parseStations(data) {
  var lines = data.split("\n");
  return lines.slice(1, -1).map((line) => {
    var [
      network,
      station,
      latitude,
      longitude,
      elevation,
      siteName,
      startTime,
      endTime,
    ] = line.split("|");
    return {
      network,
      station,
      latitude,
      longitude,
      elevation,
      siteName,
      startTime,
      endTime,
    };
  });
}

function updateStationsDropdown(stations) {
  globalStations = stations;

  // set map view to first station
  map.setView([globalStations[0].latitude, globalStations[0].longitude], 8);

  var dropdown = document.getElementById("stationsDropdownMenu");
  stations.forEach((station) => {
    var option = document.createElement("option");
    option.value = JSON.stringify(station);
    option.text = station.station;
    dropdown.add(option);
  });
}

function createMarker(station) {
  var marker = L.marker([station.latitude, station.longitude]).addTo(map);
  marker
    .bindPopup(
      `<b> ${station.siteName}</b><br>
    Network: ${station.network}<br>
    Station: ${station.station}</b><br>
    Latitude: ${station.latitude}<br>
    Longitude: ${station.longitude}<br>
    Elevation: ${station.elevation}<br>
    StartTime: ${station.startTime}<br>
    EndTime: ${station.endTime}
    `
    )
    .openPopup();
  map.setView([station.latitude, station.longitude]);
}

function clearStationsDropdown() {
  var dropdown = document.getElementById("stationsDropdownMenu");
  while (dropdown.firstChild) {
    dropdown.removeChild(dropdown.firstChild);
  }
  var option = document.createElement("option");
  option.text = "Please select a station";
  option.value = "";
  dropdown.add(option);
  dropdown.selectedIndex = 0;
}

// Initialize dropdowns and buttons
var networkDropdown = document.getElementById("networksDropdownMenu");
var stationsDropdown = document.getElementById("stationsDropdownMenu");
var generateButton = document.getElementById("generateButton");

stationsDropdown.disabled = true;
generateButton.disabled = true;

networkDropdown.addEventListener("change", function () { // event listener: change
  clearStationsDropdown();
  var network = this.value; // chose the network -> fetchStations
  generateButton.disabled = false;
  fetchStations(network).then((stations) => {
    updateStationsDropdown(stations);
    stationsDropdown.disabled = false;
  });
});

stationsDropdown.addEventListener("change", function () {
  var selectedStation = JSON.parse(this.value); // chose the station -> createMarker
  createMarker(selectedStation);
});

fetchNetworks().then((networks) => updateNetworkDropdown(networks));

generateButton.addEventListener("click", function () { // create the table
  var newTab = window.open("", "_blank");

  if (newTab) {
    // Create a table in the new tab
    var html =
      "<style>table {border-collapse: collapse;} th, td {border: 1px solid black; padding: 5px;}</style>" +
      "<table><tr><th>Network</th><th>Station</th><th>Latitude</th><th>Longitude</th><th>Elevation</th><th>Site Name</th><th>Start Time</th><th>End Time</th></tr>";
    globalStations.forEach((station) => {
      html +=
        "<tr><td>" +
        station.network +
        "</td><td>" +
        station.station +
        "</td><td>" +
        station.latitude +
        "</td><td>" +
        station.longitude +
        "</td><td>" +
        station.elevation +
        "</td><td>" +
        station.siteName +
        "</td><td>" +
        station.startTime +
        "</td><td>" +
        station.endTime +
        "</td></tr>";
    });
    html += "</table>";

    // Write the table to the new tab
    newTab.document.write(html);
    newTab.document.close();
    newTab.document.title = "Stations Data";
  }
});
