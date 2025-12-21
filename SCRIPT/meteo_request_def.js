const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

function reverseDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
}

function getDatiMeteo_d(lat, lon, comune, elemento_html, altre_previsioni) {
    const URL_METEO = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        "&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,rain_sum,precipitation_sum,weathercode" +
        "&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m,visibility" +
        "&current_weather=true&forecast_days=7&timezone=auto";

    elemento_html.textContent = "Caricamento meteo di " + comune + "...";

    function getNextDate() {
        let date = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);

            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");

            date.push(`${year}-${month}-${day}`);
        }

        return date;
    }

    function umiditaMediaGiornaliera(hourly, dayIndex) {
        const start = dayIndex * 24;
        const end = start + 24;

        const valori = hourly.relative_humidity_2m.slice(start, end);

        if (valori.length === 0) return "--";

        const media = valori.reduce((somma, v) => somma + v, 0) / valori.length;

        return Math.round(media);
    }

    function descrizioneMeteo(code) {
        if (code === 0) return { testo: "Soleggiato", icona: "☀️" };
        if (code <= 3) return { testo: "Parzialmente nuvoloso", icona: "⛅" };
        if (code <= 48) return { testo: "Nuvoloso", icona: "☁️" };
        if (code <= 67) return { testo: "Piovoso", icona: "🌧" };
        if (code <= 77) return { testo: "Nevoso", icona: "❄️" };
        if (code <= 99) return { testo: "Temporale", icona: "⛈" };
        return { testo: "Sconosciuto", icona: "❓" };
    }

    function caricaPrevisoniDaily(daily, hourly) {
        const container = document.createElement("div");
        container.classList.add("previsioni-settimana");

        const prossimeDate = getNextDate();

        for (let i = 0; i < prossimeDate.length; i++) {
            const giornoDiv = document.createElement("div");
            giornoDiv.classList.add("giorno-meteo");

            const giorno = document.createElement("h3");
            giorno.classList.add("giorno");
            giorno.textContent = giorni[new Date(prossimeDate[i]).getDay()];

            const data = document.createElement("p");
            data.classList.add("data");
            data.textContent = reverseDate(prossimeDate[i]);

            // Stato meteo
            const statoInfo = descrizioneMeteo(daily.weathercode[i]);
            const stato = document.createElement("p");
            stato.classList.add("stato-meteo");
            stato.textContent = `${statoInfo.icona} ${statoInfo.testo}`;

            const temp = document.createElement("div");
            temp.classList.add("temperature");
            temp.innerHTML = `
                <span class="max">🌡 Max: ${daily.temperature_2m_max[i]}°C</span>
                <span class="min">🌡 Min: ${daily.temperature_2m_min[i]}°C</span>
            `;

            const alba = document.createElement("p");
            alba.classList.add("alba");
            alba.textContent = `🌅 Alba: ${daily.sunrise[i].substring(11, 16)}`;

            const tramonto = document.createElement("p");
            tramonto.classList.add("tramonto");
            tramonto.textContent = `🌇 Tramonto: ${daily.sunset[i].substring(11, 16)}`;

            const durata = document.createElement("p");
            durata.classList.add("durata-luce");
            durata.textContent = `⏱ Luce diurna: ${Math.round(daily.daylight_duration[i] / 60 / 60)} ore`;

            const umidita = document.createElement("p");
            umidita.classList.add("umidita");
            umidita.textContent = `💧 Umidità media: ${umiditaMediaGiornaliera(hourly, i)}%`;

            const pioggia = document.createElement("p");
            pioggia.classList.add("pioggia");
            pioggia.textContent = `🌧 Pioggia totale: ${daily.rain_sum[i]} mm`;

            giornoDiv.append(
                giorno,
                data,
                stato,
                temp,
                alba,
                tramonto,
                durata,
                umidita,
                pioggia
            );

            container.appendChild(giornoDiv);
        }

        return container;
    }

    fetch(URL_METEO)
        .then(response => response.json())
        .then(dati => {
            const meteo = dati.current_weather;
            const daily = dati.daily;
            const hourly = dati.hourly;

            altre_previsioni.innerHTML = "";
            altre_previsioni.appendChild(caricaPrevisoniDaily(daily, hourly));

            console.log("Oggetto con dati meteo per " + comune);
            console.log(meteo);

            const statoAttuale = descrizioneMeteo(meteo.weathercode);
            elemento_html.textContent = "";

            /*elemento_html.textContent =
                `Meteo attuale a: ${comune}\n` +
                `Condizioni: ${statoAttuale.icona} ${statoAttuale.testo}\n` +
                `Temperatura attuale: ${meteo.temperature} °C\n` +
                `Vento: ${meteo.windspeed} km/h\n` +
                `Direzione vento: ${meteo.winddirection}°\n` +
                `Orario rilevazione: ${meteo.time.substring(11, 16)}\n\n` +
                `Temperatura max di oggi: ${daily.temperature_2m_max[0]} °C\n` +
                `Temperatura min oggi: ${daily.temperature_2m_min[0]} °C\n` +
                `Alba: ${("" + daily.sunrise[0]).substring(11, 16)}\n` +
                `Tramonto: ${("" + daily.sunset[0]).substring(11, 16)}\n` +
                `Durata luce diurna: ${Math.round(daily.daylight_duration[0] / 60 / 60)} ore\n` +
                `Pioggia totale oggi: ${daily.rain_sum[0]} mm\n` +
                `Umidità media: ${umiditaMediaGiornaliera(hourly, 0)}%`;
                */
        })
        .catch(err => {
            elemento_html.textContent = "Errore nella chiamata meteo.\n" + err;
        });
}

export { getDatiMeteo_d };
