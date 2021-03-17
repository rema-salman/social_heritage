var colors = ["red", "blue"];
var imgNum = "number of images ";
var langC = [25, 51.505, 43.37667, 56.87767, 57.70887];
var longC = [0, -0.09, 24.61667, 14.80906, 11.97456];
var zoomL = 13;

// PURE LEAFLET MAP -----------------------------------
var leaflet_map = L.map("mapid").setView([0, 0], 3);
var access_token =
  "pk.eyJ1IjoianVsaWp1IiwiYSI6ImNrbTgyMHFlZDEzZ3IyeW42OTg1N2VjZ3EifQ.kxwuRnukhgVKGZUPQGIePw";

//map tiles, centering and zoom
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom: 2,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: access_token,
  }
).addTo(leaflet_map);

// Cities: Zoom Centers -------------------------------------------
var gothenburg = [57.70887, 11.97456];
var london = [51.505, 0];
var Kaylaka_park = [43.41667, 24.61667];
var vaxjo = [56.879, 14.8059];

getSelectedOptionValue();
//gets the value of choosesn location from the menu with options
function getSelectedOptionValue() {
  var selectedOption = document.getElementById("optionList").value;
  console.log(selectedOption);

  if (selectedOption == 1) {
    leaflet_map.flyTo(gothenburg, 13);
    getWetherConditions("gothenburg");
  } else if (selectedOption == 2) {
    leaflet_map.flyTo(london, 13);
    getWetherConditions("london");
  } else if (selectedOption === 3) {
    leaflet_map.flyTo(Kaylaka_park, 13);
    getWetherConditions("kaylaka");
  } else if (selectedOption === 4) {
    leaflet_map.flyTo(vaxjo, 13);
    getWetherConditions("vaxjo");
  }
}

// Fetch weather condition based on city -------------------------------------------
const getWetherConditions = (city) => {
  axios
    .get("http://localhost:5000/weather", {
      params: { city: city },
    })
    .then(function (response) {
      // handle success
      let weatherConditions = JSON.parse(response.data.body);
      displayWeatherCardInfo(weatherConditions);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
};

const displayWeatherCardInfo = (weatherConditions) => {
  const cardContent = document.getElementById("card-title");
  cardContent.innerHTML = `pressure ${weatherConditions.main.pressure} and humidity ${weatherConditions.main.humidity}`;
};

// Load Data and display them -------------------------------------
//sets the view of the map, markers and popups
getPosts();
function getPosts() {
  axios
    .get("http://localhost:5000/posts")
    .then(function (response) {
      // handle success
      console.log(response);
      handelDataDisplay(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

function handelDataDisplay(data) {
  console.log(data);
  //markers and mopups
  for (var i = 0; i < data.length; i++) {
    color = "red";
    num = 5;
    if (num < 5) {
      color = "red;";
    } else if ((num) => 5) {
      color = "blue";
    }
    //draws a circle at location
    var circle = L.circle(
      [data[i].postLocation.latitude, data[i].postLocation.longitude],
      {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 150,
      }
    ).addTo(leaflet_map);

    //adds popup to this circle
    circle.bindPopup(
      "<h1>Hestagram</h1>" +
        `<img src=${data[0].postPhoto} alt='images' class='herImg' /> <br>` +
        data[i].caption +
        "<br>" +
        data[i].date +
        "<br>" +
        data.length +
        "<br>" +
        "<a href = 'gallery.html'>See more</a>"
    );

    // var img = document.getElementById("img").src;
    // img = data[0].postPhoto;

    //the pop up displays on hover intead of onClick as it is by default
    circle.on("mouseover", function (event) {
      event.target.openPopup();
    });
  }
}
