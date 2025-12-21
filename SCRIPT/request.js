


//FACCIAMO RICHIESTA PER LATITUDINE E LOGITUDINE IN MODALITA' ASINCRONA


async function geocodeComune(comune) {
    const apiKey = 'bb7a4d99440941019430d5095faf9e64';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(comune)}&key=${apiKey}&limit=1&language=it`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Errore nella chiamata API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.results.length === 0) {
            throw new Error('Comune non trovato');
        }

        const result = data.results[0];

        return {
            lat: result.geometry.lat,
            lon: result.geometry.lng,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export { geocodeComune };