import * as bootstrap from "bootstrap";

// DOM Elements
const weatherImage = document.getElementById("weather-image");

const descriptionIconDisplay = document.getElementById("description-icon-display");
const descriptionDisplay = document.getElementById("description-display");
const temperatureDisplay = document.getElementById("temperature-display");

const feelsLikeDisplay = document.getElementById("feels-like-display");
const humidityDisplay = document.getElementById("humidity-display");
const windDisplay = document.getElementById("wind-display");

const locationDisplay = document.getElementById("location-display");
const dateTimeDisplay = document.getElementById("date-time-display");
const dateDisplay = document.getElementById("date-display");
const timeDisplay = document.getElementById("time-display");

const locationInput = document.getElementById("location-input");
const temperatureToggle = document.getElementById("temperature-toggle");
const measurementToggle = document.getElementById("measurement-toggle");
const temperatureToggleLabel = document.getElementById("temperature-toggle-label");
const measurementToggleLabel = document.getElementById("measurement-toggle-label");

// Variables
const locationSearch = new google.maps.places.SearchBox(locationInput);

let latitude = 30.267153;
let longitude = -97.7430608;
let locationAlt;
let timeoutDateTime;

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
  locationAlt = location.formatted_address;

  setWeatherData(latitude, longitude, locationAlt);
});

function updateUsingGeolocation() {
  navigator.geolocation.getCurrentPosition((location) => {
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;

    setWeatherData(latitude, longitude);
  });
}

// Weather Functions
async function setWeatherData(latitude, longitude, locationAlt) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&&appid=${openWeatherAPI}`);
  const weatherData = await response.json();

  const description = weatherData.weather[0].main;
  const temperature = weatherData.main.temp;
  const feelsLike = weatherData.main.feels_like;
  const wind = weatherData.wind.speed;

  const convertedTemperature = isFahrenheit ? `${convertToFahrenheit(temperature)} \u00b0F` : `${convertToCelcius(temperature)} \u00b0C`;
  const convertedfeelsLike = isFahrenheit ? `${convertToFahrenheit(feelsLike)} \u00b0F` : `${convertToCelcius(feelsLike)} \u00b0C`;
  const convertedWind = isMiles ? `${convertToMiles(wind)} mph` : `${convertToKilometers(wind)} km/h`;
  const location = weatherData.name ? `${weatherData.name}, ${weatherData.sys.country}` : locationAlt;

  descriptionIconDisplay.innerHTML = setWeatherIcon(description);
  descriptionDisplay.textContent = description === "Thunderstorm" ? "Storm" : description;
  temperatureDisplay.textContent = convertedTemperature;
  feelsLikeDisplay.textContent = convertedfeelsLike;
  humidityDisplay.textContent = `${weatherData.main.humidity} %`;
  windDisplay.textContent = convertedWind;
  locationDisplay.innerHTML = location;

  clearTimeout(timeoutDateTime);
  setDateTime(weatherData.timezone);
  setWeatherImage(description);
  setWeatherBackground(description);
}

function setWeatherIcon(description) {
  if (description === "Clear") return `<i class="bi bi-sun"></i>`;
  else if (description === "Clouds") return `<i class="bi bi-clouds"></i>`;
  else if (description === "Rain" || description === "Drizzle") return `<i class="bi bi-cloud-rain"></i>`;
  else if (description === "Snow") return `<i class="bi bi-cloud-snow"></i>`;
  else if (description === "Thunderstorm") return `<i class="bi bi-cloud-lightning"></i>`;
  else return `<i class="bi bi-cloud-haze2"></i>`;
}

function setWeatherImage(description) {
  if (description === "Clear") weatherImage.src = require("../images/clear.png");
  else if (description === "Clouds") weatherImage.src = require("../images/clouds.png");
  else if (description === "Rain" || description === "Drizzle") weatherImage.src = require("../images/rain.png");
  else if (description === "Snow") weatherImage.src = require("../images/snow.png");
  else if (description === "Thunderstorm") weatherImage.src = require("../images/thunderstorm.png");
  else weatherImage.src = require("../images/atmosphere.png");
}

function setWeatherBackground(description) {
  if (description === "Clear") document.body.setAttribute("id", "clear");
  else if (description === "Clouds") document.body.setAttribute("id", "clouds");
  else if (description === "Rain" || description === "Drizzle") document.body.setAttribute("id", "rain");
  else if (description === "Snow") document.body.setAttribute("id", "snow");
  else if (description === "Thunderstorm") document.body.setAttribute("id", "thunderstorm");
  else document.body.setAttribute("id", "atmosphere");
}

// Time Functions
function setDateTime(timezone) {
  dateTimeDisplay.textContent = getDateTime(timezone).toLocaleString("en", { dateStyle: "long", timeStyle: "short" });
  dateDisplay.textContent = getDateTime(timezone).toLocaleString("en", { dateStyle: "full" });
  timeDisplay.textContent = getDateTime(timezone).toLocaleString("en", { timeStyle: "medium" });

  timeoutDateTime = setTimeout(setDateTime, 1000, timezone);
}

function getDateTime(timezone) {
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
  setWeatherData(latitude, longitude, locationAlt);
}

function setMeasurementUnit() {
  isMiles = measurementToggle.checked;
  measurementToggleLabel.textContent = isMiles ? "Miles" : "Kilometers";
  setWeatherData(latitude, longitude, locationAlt);
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
setWeatherData(latitude, longitude);
updateUsingGeolocation();
