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

----------
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
*/

const map_view = L.map('map', {
    dragging: false,      // disabilita drag con un dito
    touchZoom: false,     // disabilita zoom con un dito
    scrollWheelZoom: false
}).setView([45.4064, 11.8768], 12);

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
        .bindPopup('Comune di: ' + comune)
        .openPopup();
    map_view.setView([lat, lon], 13);
}

// Abilita dragging e touchZoom solo se ci sono 2 tocchi contemporanei (due dita)
map_view.getContainer().addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
        map_view.dragging.enable();
        map_view.touchZoom.enable();
    }
});

map_view.getContainer().addEventListener('touchend', function (e) {
    // Disabilita se i tocchi sono meno di 2
    if (e.touches.length < 2) {
        map_view.dragging.disable();
        map_view.touchZoom.disable();
    }
});

