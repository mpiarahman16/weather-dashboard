
const fetchInfo = (city) => {
  const state = {};
  state.city = city;
  
  // Get latitude and longitude using GeonamesAPI
  const geoURL = "https://cors-anywhere.herokuapp.com/http://api.geonames.org/searchJSON?q=";
  const geoApiKey = "stamay";

  const locationEndPoint = geoURL + city + "&username=" + geoApiKey;
  /**
   * Get weather forecast through DarkSky API using 
   * results of Geonames API call
   */
  $.ajax({
    url: locationEndPoint,
    method: "GET"
  }).then(function (response) {
    response = response.geonames[0];
    state.latitude = response.lat;
    state.longitude = response.lng;
  }).then(function () {
    // Get weather forecast using DarkSky API
    const darkSkyUrl = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/"
    const weatherApiKey = "a44b6a01155bc9391c311378b6f5bcee";
    const weatherEndPoint = darkSkyUrl + weatherApiKey + "/" + state.latitude + "," + state.longitude;

    $.ajax({
      url: weatherEndPoint,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      const forecast = response.daily.data;
      state.date = new Date(forecast[0].time * 1000).toDateString();
      state.icon = forecast[0].icon;
      state.temperature = forecast[0].temperatureHigh;
      state.humidity = forecast[0].humidity;
      state.windSpeed = forecast[0].windSpeed;
      state.uvIndex = forecast[0].uvIndex;

      state.forecast = forecast.slice(1, 7);
    }).then(function () {
      // Get city images
      const pixaUrl = "https://pixabay.com/api/?key=";
      const pixaApiKey = "13922659-0b80b0f115dd3a353e0647b73";
      const pixaEndPoint = pixaUrl + pixaApiKey + "&q=" + state.city + "&image_type=photo";

      $.ajax({
        url: pixaEndPoint,
        method: "GET"
      }).then(function (response) {
        state.images = response.hits.slice(0, 3);
      }).then(function () {
        displayWeatherInfo(state);
        displayWeatherForecast(state);
      })

    });

  });

  return true;
}

const displaySearch = () => {
  const div = $("<div>");
  div.addClass("col s12 m12 l4");

  div.html(
    `
      <h3>Search Destinations</h3>
      <div class="input-field">
        <div class="col offset-s1 s8">
          <input type="text" name="" id="input" class="white grey-text"
            placeholder="Aruba, Cancun, Cuba...">
        </div>
        <div class="col s2">
          <button type="submit" id="search" class="btn btn-large blue">Search</button>
        </div>
      </div>
    `
  );

  return div;
}

const displayWeatherInfo = (state) => {
  const row = $("<div>");
  row.addClass("row");

  const search = displaySearch();
  row.append(search);

  const info = $("<div>");
  info.addClass("col s12 m12 l8");

  info.html(
  `
    <div class="card">
    <div class="card-image">
      <img src=${state.images[0].webformatURL}>
      </div>
      <div class="card-content">
        <header>
          <div class="card-title">
            ${state.city}, ${state.date}
          </div>
        </header>
        <div class="card horizontal weather-info">
          <div class="row valign-wrapper">
            <div class="card-image col s3">
              <img src="./img/${state.icon}.png" class="weather-icon">
            </div>
            <div class="col s3 center-align">
              <span class="temp">${state.temperature}</span>
            </div>
          <div class="card-stacked">
            <div class="card-content">
              <ul>
                <li>Humidity: ${state.humidity}</li>
                <li>Wind Speed: ${state.windSpeed}</li>
                <li>UV Index: <span class="chip red">${state.uvIndex}</span></li>
              </ul> 
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

  row.append(info);

  $(".section-results").append(row);

  $('#search').on('click', (event) => {
    event.preventDefault();

    let city = $("#input").val();

    city = city.slice(0, 1).toUpperCase() + city.slice(1);

    $(".section-results").empty();

    fetchInfo(city);
  });
}

const displayWeatherForecast = (state) => {

  const row = $("<div>");
  row.addClass("row");

  for (let i = 0; i < state.forecast.length; i++) {

    const card = $("<div>");
    card.addClass("col s4 m4 l2");

    card.html(
      `
        <div class="card-panel blue">
          <div>${new Date(state.forecast[i].time * 1000).toDateString()}</div>
          <div><img src="./img/${state.forecast[i].icon}.png" alt="Weather Icon ${state.forecast[i].icon}" class="weather-icon"></div>
          <div>Temp: ${state.forecast[i].temperatureHigh}</div>
          <div>Humidity: ${state.forecast[i].humidity}</div>
        </div>
        `
    );

    row.append(card);
  }
  $(".section-results").append(row);
}

const handleSearch = (event) => {
  
  event.preventDefault();

  let city = $("#autocomplete-input").val();

  city = city.slice(0, 1).toUpperCase() + city.slice(1);

  $(".slider").hide();
  $(".section-search").hide();
  $(".section-icons").hide();

  $(".section-results").empty();

  fetchInfo(city);
  
}


$(document).ready(function () {

  $('.button-collapse').sideNav();

  $('.slider').slider({
    indicators: false,
    height: 480,
    transition: 500,
    interval: 6000
  });

  $('.autocomplete').autocomplete({
    data: {
      "Aruba": null,
      "Cancun": null,
      "Hawaii": null,
      "Florida": null,
      "California": null,
      "Jamaica": null,
      "Europe": null,
      "The Bahamas": null
    }
  });

  $('.search').on('click', handleSearch);

});