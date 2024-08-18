// DEPENDENCIES
const searchCityButtonEl = document.getElementById('search-city-button');
const searchCityEl = document.getElementById('search-city');

async function handleCitySearch() {
    console.log(await getCoordinates(searchCityEl.value));
}

async function getCoordinates(cityName) {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=1ac8e0e868989abf2abc571cd717e4b3&appid`);
    const theData = await response.json()
    const lat = theData[0].lat;
    const lon = theData[0].lon;
    // console.log("lat", lat, "lon", lon);
    // console.log(theData[0])
    return { lat: lat, lon: lon };
}

searchCityButtonEl.addEventListener('click', handleCitySearch);