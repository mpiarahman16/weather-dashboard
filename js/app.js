// Example State
state = {
  city: "Atlanta",
  image: "https://pixabay.com/get/57e5dd474a5ba814f6da8c7dda79367d1c3ddce356586c48702879d69f4fc35cbd_640.jpg",
  icon: "cloud",
  date: new Date(),
  temperature: 90.9,
  humidity: "41%",
  windSpeed: 4.7,
  uvIndex: 9.49,
  searchHistory: [
    "Atlanta"
  ]
};

const handleSearch = (event) => {
  
  event.preventDefault();

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