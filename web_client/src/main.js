var data = [
  {
    postLocation: {
      latitude: 57.70887,
      longitude: 11.97456,
    },
    caption: "Image from a poster",
    postPhoto: "hesta2.png", //url source
    date: "new Data()", //newDate
  },
  {
    postLocation: {
      latitude: 57.7,
      longitude: 11.97456,
    },
    caption: "Drawing by memory",
    postPhoto: "hesta.png", //url source
    date: "new Data()", //newDate
  },
  {
    postLocation: {
      latitude: 57.71767,
      longitude: 11.97,
    },
    caption: "Another drawing by memory 2",
    postPhoto: "hesta.png", //url source
    date: "new Data()", //newDate
  },
];

var colors = ["red", "blue"];
var imgNum = "number of images ";
var langC = [25, 51.505, 43.37667, 56.87767, 57.70887];
var longC = [0, -0.09, 24.61667, 14.80906, 11.97456];
var zoomL = 13;
//sets the view at the center of the world mad
loadMap(langC[4], longC[4], zoomL);

//sets the view of the map, markers and popups
function loadMap(lat, lon, zoom) {
  var mymap = L.map("mapid").setView([lat, lon], zoom);
  var access_token =
    "pk.eyJ1IjoianVsaWp1IiwiYSI6ImNrbTgyMHFlZDEzZ3IyeW42OTg1N2VjZ3EifQ.kxwuRnukhgVKGZUPQGIePw";

  //map centering and zoom
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
  ).addTo(mymap);
  displayData();
}

function displayData() {
  fetch("http://localhost:5000/posts")
    .then((response) => response.json())
    .then((data) => console.log(data));

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
    ).addTo(mymap);
    //adds popup to this circle
    circle.bindPopup(
      "<h1>Hestagram</h1><img src='" +
        data[i].postPhoto +
        "' alt = 'images' class= 'herImg'><br>" +
        data[i].caption +
        "<br>" +
        data[i].date +
        "<br>" +
        data.length +
        "<a href = 'gallery.html'>See more</a>"
    );

    //the pop up displays on hover intead of onClick as it is by default
    circle.on("mouseover", function (ev) {
      ev.target.openPopup();
    });
  }
}

getSelectedOptionValue();
//gets the value of choosesn location from the menu with options
function getSelectedOptionValue() {
  var selectedOption = document.getElementById("optionList").value;

  newZoom = 13;
  if (selectedOption === 1) {
    //57.708870, 11.974560 gothenburg
    console.log(selectedOption);
    loadMap(51.505, 0, 13); //London
  } else if (selectedOption === 2) {
    loadMap(43.41667, 24.61667, newZoom); // Kaylaka park
  } else if (selectedOption === 3) {
    loadMap(56.87767, 14.80906, newZoom); // Vaxjo
  }
}
