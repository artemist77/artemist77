
// ======================================
// CONFIG & VARIABILI GLOBALI
// ======================================

import { geocodeComune } from "./request.js";
//import { getDatiMeteo } from "./meteo_request.js";
import { getDatiMeteo_d } from "./meteo_request_def.js";

const URL_COMUNI = "https://raw.githubusercontent.com/matteocontrini/comuni-json/master/comuni.json";
let datiComuni = []; // qui memorizzeremo i dati JSON una sola volta


async function loadData() {
    const response = await fetch(URL_COMUNI);
    datiComuni = await response.json();
}



async function caricaComuni() {
    await loadData();

    const selectComuni = document.getElementById("comuni");
    const comuni = [...new Set(
        datiComuni
            .map(c => c.nome)
    )].sort()

    selectComuni.innerHTML = "<option value=''>-- Seleziona comune --</option>";

    for (const comune of comuni) {
        const opt = document.createElement("option");
        opt.value = comune;
        opt.textContent = comune;
        selectComuni.appendChild(opt);
    }
}

caricaComuni();


const searchComune = document.getElementById("searchComune");
const select_principale_comuni = document.getElementById("comuni");

searchComune.addEventListener("input", function () {

    const testo = searchComune.value.toLowerCase();

    //filtriamo i comuni in base a ciò che l'utente mette
    const comuniFiltrati = datiComuni
        .map(c => c.nome)
        .filter(nome => nome.toLowerCase().startsWith(testo))
        .sort();

    select_principale_comuni.innerHTML = "";

    for (const comune of comuniFiltrati) {
        const option = document.createElement("option");
        option.value = comune;
        option.textContent = comune;
        //selectComuni.appendChild(option);
        select_principale_comuni.appendChild(option)
    }

})


const form = document.querySelector("form");
const form_value = form.reicerca_testuale;
const fomr_select = form.comuni;
const pre_dati_meteo = document.getElementById("datiMeteo");



form.addEventListener("submit", function (e) {
    e.preventDefault();

    form_value.value = fomr_select.value;

    geocodeComune(fomr_select.value)
        .then(location => {
            console.log('Coordinate:', location.lat, location.lon);
            const lat_comune = location.lat;
            const lon_comune = location.lon;

            getDatiMeteo_d(lat_comune, lon_comune, fomr_select.value, pre_dati_meteo, document.getElementById("altriDati"));
            posizionatiSullaMappa(lat_comune, lon_comune, fomr_select.value);
        })
        .catch(err => {
            console.error('Errore:', err.message);
        });


})



