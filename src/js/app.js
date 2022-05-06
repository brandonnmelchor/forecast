import * as bootstrap from "bootstrap";

// Variables
const locationDisplay = document.getElementById("location-display");
const temperatureDisplay = document.getElementById("temperature-display");
const descriptionDisplay = document.getElementById("description-display");
const feelsLikeDisplay = document.getElementById("feels-like-display");
const humidityDisplay = document.getElementById("humidity-display");
const windDisplay = document.getElementById("wind-display");
const dateDisplay = document.getElementById("date-display");

const locationInput = document.getElementById("location-input");
const locationSearch = new google.maps.places.SearchBox(locationInput);

let isFahrenheit = true;
let isMiles = true;

// Public API Key
const openWeatherAPI = "f79262b8943c9a96eeefe553bb0bdb63";

// Functions
locationSearch.addListener("places_changed", () => {
  const location = locationSearch.getPlaces()[0];
  if (location === null) return;

  const latitude = location.geometry.location.lat();
  const longitude = location.geometry.location.lng();

  setWeatherData(latitude, longitude).catch((error) => alert(error));
});

function updateUsingGeolocation() {
  navigator.geolocation.getCurrentPosition((location) => {
    if (location === null) return;
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    setWeatherData(latitude, longitude).catch((error) => alert(error));
  });
}

async function setWeatherData(latitude, longitude) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&&appid=${openWeatherAPI}`);
  const weatherData = await response.json();

  const temperature = weatherData.main.temp;
  const convertedTemperature = isFahrenheit ? `${convertToFahrenheit(temperature)} \u00b0F` : `${convertToCelcius(temperature)} \u00b0C`;
  const feelsLike = weatherData.main.feels_like;
  const convertedfeelsLike = isFahrenheit ? `${convertToFahrenheit(feelsLike)} \u00b0F` : `${convertToCelcius(feelsLike)} \u00b0C`;
  const wind = weatherData.wind.speed;
  const convertedWind = isMiles ? `${convertToMiles(wind)} mph` : `${convertToKilometers(wind)} km/h`;

  locationDisplay.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
  temperatureDisplay.textContent = convertedTemperature;
  descriptionDisplay.textContent = weatherData.weather[0].main;
  feelsLikeDisplay.textContent = `Feels Like: ${convertedfeelsLike}`;
  humidityDisplay.textContent = `Humidity: ${weatherData.main.humidity}`;
  windDisplay.textContent = convertedWind;
}

function convertToFahrenheit(temperature) {
  return Math.round((temperature - 273.15) * (9 / 5) + 32);
}

function convertToCelcius(temperature) {
  return Math.round(temperature - 273.15);
}

function convertToMiles(wind) {
  return Math.round(wind * 2.237);
}

function convertToKilometers(wind) {
  return Math.round(wind * 3.6);
}

// On Page Load
updateUsingGeolocation();
