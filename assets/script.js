// DEPENDENCIES
const searchCityButtonEl = document.getElementById('search-city-button');
const searchCityEl = document.getElementById('search-city');

// DATA
const apiKey = "1ac8e0e868989abf2abc571cd717e4b3";

async function handleCitySearch() {
    const coordinates = await getCoordinates(searchCityEl.value);
    console.log(await getCurrentWeather(coordinates));
}

async function getCoordinates(cityName) {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`);
    const theData = await response.json()
    const lat = theData[0].lat;
    const lon = theData[0].lon;

    return { lat, lon };
}

async function getCurrentWeather(coordinates) {
    const { lat, lon } = coordinates;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const currentWeather = await response.json();
    const windSpeed = currentWeather.wind.speed;
    const { temp, humidity } = currentWeather.main;
    const cloudPercentage = currentWeather.clouds.all;

    return { windSpeed, humidity, temp, cloudPercentage };
}

searchCityButtonEl.addEventListener('click', handleCitySearch);