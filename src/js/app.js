import * as bootstrap from "bootstrap";

// Variables
const descriptionDisplay = document.getElementById("description-display");
const descriptionIconDisplay = document.getElementById("description-icon-display");
const temperatureDisplay = document.getElementById("temperature-display");

const feelsLikeDisplay = document.getElementById("feels-like-display");
const humidityDisplay = document.getElementById("humidity-display");
const windDisplay = document.getElementById("wind-display");

const locationDisplay = document.getElementById("location-display");
const dateDisplay = document.getElementById("date-display");
const timeDisplay = document.getElementById("time-display");

const weatherImage = document.getElementById("weather-image");

const locationInput = document.getElementById("location-input");
const locationSearch = new google.maps.places.SearchBox(locationInput);
let latitude;
let longitude;

const temperatureToggle = document.getElementById("temperature-toggle");
const measurementToggle = document.getElementById("measurement-toggle");
const temperatureToggleLabel = document.getElementById("temperature-toggle-label");
const measurementToggleLabel = document.getElementById("measurement-toggle-label");
let isFahrenheit = true;
let isMiles = true;

// Public API Key
const openWeatherAPI = "f79262b8943c9a96eeefe553bb0bdb63";

// Location Functions
locationSearch.addListener("places_changed", () => {
  const location = locationSearch.getPlaces()[0];
  if (location === null) return;

  latitude = location.geometry.location.lat();
  longitude = location.geometry.location.lng();

  setWeatherData(latitude, longitude).catch((error) => alert(error));
});

function updateUsingGeolocation() {
  navigator.geolocation.getCurrentPosition((location) => {
    if (location === null) return;
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;

    setWeatherData(latitude, longitude).catch((error) => alert(error));
  });
}

// Weather Functions
async function setWeatherData(latitude, longitude) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&&appid=${openWeatherAPI}`);
  const weatherData = await response.json();

  const description = weatherData.weather[0].main;
  const descriptionIcon = setWeatherIcon(description);
  const temperature = weatherData.main.temp;
  const feelsLike = weatherData.main.feels_like;
  const wind = weatherData.wind.speed;

  const convertedTemperature = isFahrenheit ? `${convertToFahrenheit(temperature)} \u00b0F` : `${convertToCelcius(temperature)} \u00b0C`;
  const convertedfeelsLike = isFahrenheit ? `${convertToFahrenheit(feelsLike)} \u00b0F` : `${convertToCelcius(feelsLike)} \u00b0C`;
  const convertedWind = isMiles ? `${convertToMiles(wind)} mph` : `${convertToKilometers(wind)} km/h`;

  descriptionDisplay.textContent = description;
  descriptionIconDisplay.innerHTML = descriptionIcon;
  temperatureDisplay.textContent = convertedTemperature;
  feelsLikeDisplay.textContent = convertedfeelsLike;
  humidityDisplay.textContent = `${weatherData.main.humidity} %`;
  windDisplay.textContent = convertedWind;
  locationDisplay.innerHTML = `${weatherData.name}, ${weatherData.sys.country}`;
  dateDisplay.textContent = getLocalDate(weatherData.timezone);
  timeDisplay.textContent = getLocalTime(weatherData.timezone);

  setWeatherImage(description);
}

function setWeatherImage(description) {
  if (description === "Clear") weatherImage.src = require("../images/clear.png");
  else if (description === "Clouds") weatherImage.src = require("../images/clouds.png");
  else if (description === "Rain" || description === "Drizzle") weatherImage.src = require("../images/rain.png");
  else if (description === "Snow") weatherImage.src = require("../images/snow.png");
  else if (description === "Thunderstorm") weatherImage.src = require("../images/thunderstorm.png");
  else weatherImage.src = require("../images/atmosphere.png");
}

function setWeatherIcon(description) {
  if (description === "Clear") return `<i class="bi bi-sun"></i>`;
  else if (description === "Clouds") return `<i class="bi bi-clouds"></i>`;
  else if (description === "Rain" || description === "Drizzle") return `<i class="bi bi-cloud-rain"></i>`;
  else if (description === "Snow") return `<i class="bi bi-cloud-snow"></i>`;
  else if (description === "Thunderstorm") return `<i class="bi bi-cloud-lightning"></i>`;
  else return `<i class="bi bi-cloud-haze2"></i>`;
}

// Time Functions
function getLocalDate(timezone) {
  const localDateTime = getLocalDateTime(timezone);
  return localDateTime.toLocaleString("en", { dateStyle: "full" });
}

function getLocalTime(timezone) {
  const localDateTime = getLocalDateTime(timezone);
  return localDateTime.toLocaleString("en", { timeStyle: "long" });
}

function getLocalDateTime(timezone) {
  const date = new Date();
  const time = date.getTime();
  const utc = time + date.getTimezoneOffset() * 60000;
  const localTime = utc + timezone * 1000;
  return new Date(localTime);
}

// Unit Functions
temperatureToggle.addEventListener("change", setTemperatureUnit);
measurementToggle.addEventListener("change", setMeasurementUnit);

function setTemperatureUnit() {
  isFahrenheit = temperatureToggle.checked;
  temperatureToggleLabel.textContent = isFahrenheit ? "Fahrenheit" : "Celsius";
  setWeatherData(latitude, longitude).catch((error) => alert(error));
}

function setMeasurementUnit() {
  isMiles = measurementToggle.checked;
  measurementToggleLabel.textContent = isMiles ? "Miles" : "Kilometers";
  setWeatherData(latitude, longitude).catch((error) => alert(error));
}

// Conversion Functions
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

// Work in Progress
