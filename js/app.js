// Example State
state = {
  city: "",
  images: [],
  icon: "",
  date: new Date(),
  temperature: 0,
  humidity: 0,
  windSpeed: 0,
  uvIndex: 0,
  searchHistory: [
    "Atlanta"
  ]
};

const fetchState = () => {
  // Get latitude and longitude using GeonamesAPI
  const geoURL = "http://api.geonames.org/searchJSON?q=";
  const city = state.city;
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
    // console.log(response);
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

      const forecast = response.daily.data;

      state.icon = forecast[0].icon;
      state.temperature = forecast[0].temperatureHigh;
      state.humidity = forecast[0].humidity;
      state.windSpeed = forecast[0].windSpeed;
      state.uvIndex = forecast[0].uvIndex;

      state.forecast = forecast.slice(1, 6);
    });

    console.log(state);
  });

  // Get city images
  const pixaUrl = "https://pixabay.com/api/?key=";
  const pixaApiKey = "13922659-0b80b0f115dd3a353e0647b73";
  const pixaEndPoint = pixaUrl + pixaApiKey + "&q=" + state.city + "&image_type=photo";

  $.ajax({
    url: pixaEndPoint,
    method: "GET"
  }).then(function (response) {
    state.images = response.hits.slice(0, 3);
  });
}

const displayWeatherInfo = () => {
  const row = $("<div>");
  row.addClass("row");
  console.log(row);
  row.html(
  `
  <div class="col s12 m12 l8">
    <div class="card">
    <div class="card-image">
      <img src=${state.image}>
      </div>
      <div class="card-content">
        <header>
          <div class="card-title">
            ${state.city} ${state.date}
          </div>
        </header>
        <div class="card horizontal weather-info">
          <div class="row valign-wrapper">
            <div class="card-image col s3">
              <img src="../img/${state.icon}.png" class="weather-icon">
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
  </div>
  `);

  $('.section-results').append(row);
}

// const displayWeatherForecast = () => {

//   .then(function() {
//       const row = $("<div>");
//       row.addClass("row");

//       for (let index = 0; index < state.forecast.length; index++) {

//         const card = $("<div>");
//         card.addClass("col s12 m2");

//         card.html(
//           `
//         <div class="card-panel blue">
//           <span>Lorem ipsum dolor sit
//           </span>
//         </div>
//         `
//         );

//         row.append(card);

//         $(".section-results").append(row);
//       }
//     })
//   })
// }

const handleSearch = (event) => {
  
  event.preventDefault();

  const city = $("#autocomplete-input").val();
  
  state.city = city.slice(0, 1).toUpperCase() + city.slice(1);

  fetchState();

  // displayWeatherInfo();

  // displayWeatherForecast();
  
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