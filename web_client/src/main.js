var x = document.getElementById("got");
var y = document.getElementById("kay");
var z = document.getElementById("vaj");

var langs = [51.505, 51.509865];
var longs = [-0.09, -0.118092];
var colors = ["red", "blue"];
var imgNum = "number of images ";
var langC = [25, 51.505];
var longC = [0, -0.09];
var zoomL = 2;
var centr = 0;
var images = ["hesta.png", "hesta2.png"];
getLoc(x, "Gothenburg", centr);
//sets the view
var mymap = L.map("mapid").setView([langC[centr], longC[centr]], zoomL);
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

//markers and mopups
for (i = 0; i < langs.length; i++) {
  color = "red";
  num = 5;
  if (num < 5) {
    color = "red;";
  } else if ((num) => 5) {
    color = "blue";
  }
  var circle = L.circle([langs[i], longs[i]], {
    color: colors[i],
    fillColor: color,
    fillOpacity: 0.5,
    radius: 150,
  }).addTo(mymap);

  circle.bindPopup(
    "<h1>Hestagram</h1><img src='" +
      images[i] +
      "' alt = 'images' width='50' height='50'><br>" +
      imgNum +
      (i + 1) +
      "<a href = 'gallery.html'>See more</a>"
  );
  circle.bindTooltip("2", {
    permanent: true,
    direction: "left",
  });
  circle.on("mouseover", function (ev) {
    ev.target.openPopup();
  });
}

//getLoc(y, "Kaylaka");
//getLoc(z, "Vaxjo");

function getLoc(v, n, g) {
  v.addEventListener("click", function () {
    var active = v.classList.add("mystyle");
    var activeId;
    if (active) {
      activeId = document.getElementsByClassName("mystyle")[0].id;
      console.log(activeId);
    }
    if (activeId == "got") {
      g = 1;
      document.getElementById("top-item").innerHTML = "Gothenburg";
    }
    //document.getElementById("top-item").innerHTML = n;
    //document.getElementById("demo").innerHTML = g;
    console.log(g);
  });
  console.log(g);
}
