/*
// Inizializza la mappa centrata su una coordinata
const map = L.map('map').setView([45.4642, 9.1900], 13); // Milano con zoom 13

// Aggiunge i tile di OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// Aggiunge un marker
L.marker([45.4642, 9.1900]).addTo(map)
    .bindPopup('Ciao! Questa è Milano.')
    .openPopup();
*/

const map_view = L.map('map').setView([45.4064, 11.8768], 12);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map_view);

let ultimoMarker = null;

function posizionatiSullaMappa(lat, lon, comune) {

    if (ultimoMarker) {
        map_view.removeLayer(ultimoMarker);
    }

    ultimoMarker = L.marker([lat, lon]).addTo(map_view)
        .bindPopup('Comunne di: ' + comune)
        .openPopup();
    map_view.setView([lat, lon], 13);


}

