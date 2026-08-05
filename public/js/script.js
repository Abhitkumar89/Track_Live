// Connect to the Socket.IO server (same origin as this page)
const socket = io();
let userName = '';

// Ask browser for live GPS updates and stream them to the server
if (navigator.geolocation) {
    userName = prompt("Enter your name:");

    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Send current position whenever it changes
        socket.emit("send-location", { name: userName, latitude, longitude });
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true, // prefer GPS over Wi-Fi/IP when possible
        timeout: 5000,
        maximumAge: 0, // do not reuse cached positions
    });
}

// Leaflet map centered roughly at zoom 16
const map = L.map("map").setView([0, 0], 16);

// OpenStreetMap tiles as the map background
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

// Keep one marker per connected user, keyed by socket id
const markers = {};

// Another user (or this user) shared a location → update / create their marker
socket.on("receive-location", (data) => {
    const { id, name, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
        markers[id].bindPopup(name).openPopup();
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map)
            .bindPopup(name).openPopup();
    }
});

// User disconnected → remove their marker from the map
socket.on("user-disconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
