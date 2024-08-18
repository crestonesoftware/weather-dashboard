// DEPENDENCIES
const searchCityButtonEl = document.getElementById('search-city-button');
const searchCityEl = document.getElementById('search-city');
const currentWeatherEl = document.getElementById('current-weather');
const forecastCardsEl = document.getElementById('five-days-div');


// DATA
const apiKey = "1ac8e0e868989abf2abc571cd717e4b3";

// handles clicks on the Search button; calls APIs to get weather forecast data
async function handleCitySearch() {
    const city = searchCityEl.value;
    if (!city) {
        alert("It's hard to search for a city with no name.\nMaybe enter something in the city name field before searching?");
        return;
    }
    const today = new Date();
    const coordinates = await getCoordinates(city);
    const currentConditions = await getCurrentWeather(coordinates);
    currentWeatherEl.innerHTML = renderWeather(currentConditions, today);
    const fiveDayForecast = await getFiveDayForecast(coordinates);
    forecastCardsEl.innerHTML = "";
    for (forecast of fiveDayForecast) {
        // wrapper for the card
        const forecastCol = document.createElement("div")
        forecastCol.classList.add("col-sm-2");
        forecastCardsEl.appendChild(forecastCol);
        // the card
        const forecastCard = document.createElement("div")
        forecastCard.classList.add("card");
        forecastCol.appendChild(forecastCard);
        // card body
        const forecastCardBody = document.createElement("div")
        forecastCardBody.classList.add("card-body");
        forecastCardBody.innerHTML = renderWeather(forecast);
        forecastCard.appendChild(forecastCardBody);
    }

}

// renders the DIV that displays current conditions
function renderWeather(conditions, date = null) {
    const dateString = date ? date.toLocaleDateString() : conditions.dateString;
    const cityDisplay = conditions.cityName ? `${conditions.cityName} ` : "";
    return `
    <h3 class="card-title">${cityDisplay}(${dateString})</h3>
    <p class="card-text"><i class="fa-regular fa-sun"></i></p>
    <p class="card-text">Temp: ${conditions.temp} C</p>
    <p class="card-text">Wind: ${conditions.windSpeed} kph</p>
    <p class="card-text">Humidity: ${conditions.humidity} %</p>
    `;

}

// returns an object containing coordinates {lat, lon} for the named city
async function getCoordinates(cityName) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`);
    const theData = await response.json()
    const lat = theData[0].lat;
    const lon = theData[0].lon;

    return { lat, lon };
}

function parseConditions(weatherData) {
    const windSpeed = weatherData.wind.speed;
    const cityName = weatherData.name;
    const { temp, humidity } = weatherData.main;
    const cloudPercentage = weatherData.clouds.all;

    // current weather does not return dt_txt, so use the current Date(). Otherwise use dt_txt.
    const dateString = weatherData.dt_txt == "" ? null : new Date(weatherData.dt_txt).toLocaleDateString();
    return { windSpeed, humidity, temp, cloudPercentage, cityName, dateString };
}

// gets selected weather data about current conditions at the specified coordinates
async function getCurrentWeather(coordinates) {
    const { lat, lon } = coordinates;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const currentWeather = await response.json();
    return parseConditions(currentWeather);
}

// gets selected weather data about current conditions at the specified coordinates
async function getFiveDayForecast(coordinates) {
    const fiveDayForecast = [];
    const { lat, lon } = coordinates;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const forecast = await response.json();
    const tmpForecastList = forecast.list;
    let dayCount = 0;
    // forecasts are given in 3-hour increments. Get the forecast for the same time each day by using every 8th time increment
    for (let idx = 0; idx < tmpForecastList.length; idx++) {
        if ((idx + 1) % 8 == 0) {
            ++dayCount
            console.log("forecast for day", dayCount, tmpForecastList[idx].dt_txt, tmpForecastList[idx]);
            fiveDayForecast.push(parseConditions(tmpForecastList[idx]));
        }
    }
    return fiveDayForecast;

}

searchCityButtonEl.addEventListener('click', handleCitySearch);