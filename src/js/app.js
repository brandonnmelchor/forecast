import * as bootstrap from "bootstrap";

// Variables
const descriptionDisplay = document.getElementById("description-display");
const temperatureDisplay = document.getElementById("temperature-display");
const locationDisplay = document.getElementById("location-display");
const feelsLikeDisplay = document.getElementById("feels-like-display");
const humidityDisplay = document.getElementById("humidity-display");
const windDisplay = document.getElementById("wind-display");
const dateDisplay = document.getElementById("date-display");
const weatherImage = document.getElementById("weather-image");

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

  const description = weatherData.weather[0].main;
  const temperature = weatherData.main.temp;
  const feelsLike = weatherData.main.feels_like;
  const wind = weatherData.wind.speed;

  const convertedTemperature = isFahrenheit ? `${convertToFahrenheit(temperature)} \u00b0F` : `${convertToCelcius(temperature)} \u00b0C`;
  const convertedfeelsLike = isFahrenheit ? `${convertToFahrenheit(feelsLike)} \u00b0F` : `${convertToCelcius(feelsLike)} \u00b0C`;
  const convertedWind = isMiles ? `${convertToMiles(wind)} mph` : `${convertToKilometers(wind)} km/h`;

  descriptionDisplay.textContent = description;
  temperatureDisplay.textContent = convertedTemperature;
  locationDisplay.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
  feelsLikeDisplay.textContent = `Feels Like: ${convertedfeelsLike}`;
  humidityDisplay.textContent = `Humidity: ${weatherData.main.humidity}`;
  windDisplay.textContent = convertedWind;

  console.log(weatherData);
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

// Work in Progress
function setWeatherImage(description) {
  if (description === "Clear") weatherImage.src = "#";
  else if (description === "Clouds") weatherImage.src = "#";
  else if (description === "Rain" || description === "Drizzle") weatherImage.src = "#";
  else if (description === "Snow") weatherImage.src = "#";
  else if (description === "Thunderstorm") weatherImage.src = "#";
  else weatherImage.src = "#";
}
