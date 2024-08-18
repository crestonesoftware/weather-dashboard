// DEPENDENCIES
const searchCityButtonEl = document.getElementById('search-city-button');
const searchCityEl = document.getElementById('search-city');
const currentWeatherEl = document.getElementById('current-weather');

// DATA
const apiKey = "1ac8e0e868989abf2abc571cd717e4b3";

// handles clicks on the Search button; calls APIs to get weather forecast data
async function handleCitySearch() {
    const coordinates = await getCoordinates(searchCityEl.value);
    const currentConditions = await getCurrentWeather(coordinates);
    currentWeatherEl.innerHTML = renderCurrentWeather(currentConditions);
}

// renders the DIV that displays current conditions
function renderCurrentWeather(currentWeather) {
    return `<p>Temp: ${currentWeather.temp} C</p>
    <p>Wind: ${currentWeather.windSpeed} kph</p>
    <p>Humidity: ${currentWeather.humidity} %</p>`;

}

// returns an object containing coordinates {lat, lon} for the named city
async function getCoordinates(cityName) {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`);
    const theData = await response.json()
    const lat = theData[0].lat;
    const lon = theData[0].lon;

    return { lat, lon };
}

// gets selected weather data about current conditions at the specified coordinates
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