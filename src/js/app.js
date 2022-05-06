import * as bootstrap from "bootstrap";

// Variables
const location = document.getElementById("location");
const dateTime = document.getElementById("date-time");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const info = document.getElementById("info");

// Public API Keys
const openWeatherAPI = "f79262b8943c9a96eeefe553bb0bdb63";
let city = "Mcallen";

async function getWeather() {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherAPI}&units=imperial`);
  const weatherData = await response.json();
  console.log(weatherData);

  location.textContent = weatherData.name;
  temperature.textContent = `${weatherData.main.temp} \u00b0F`;
  description.textContent = weatherData.weather[0].description;
}

getWeather().catch((error) => alert(error));

const searchElement = document.getElementById("search");
const searchBox = new google.maps.places.SearchBox(searchElement);

searchBox.addListener("places_changed", () => {
  const place = searchBox.getPlaces()[0];
  if (place === null) return;

  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();
});
