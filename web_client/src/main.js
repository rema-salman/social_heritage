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

// Fetch Data and display on map -------------------------------------
getPosts();
function getPosts() {
  axios
    .get("http://localhost:5000/posts")
    .then(function (response) {
      // handle success
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

function getLocationString(postLocation) {
  return postLocation.latitude.toString() + postLocation.longitude.toString();
}

function unifyLocations(data) {
  const checkedLocations = [];
  const unifiedLocations = [];
  //markers and mopups
  for (var i = 0; i < data.length; i++) {
    const locationPair = getLocationString(data[i].postLocation);

    if (checkedLocations.includes(locationPair)) {
      //already checked
    } else {
      checkedLocations.push(locationPair);
      const currectPostLocation = getLocationString(data[i].postLocation);
      const samePositionPlaces = data.filter(
        (e) => getLocationString(e.postLocation) === currectPostLocation
      );
      //array of arrays
      if (samePositionPlaces.length) unifiedLocations.push(samePositionPlaces);
    }
  }
  return unifiedLocations;
}
//sets the view of the map, markers and popups
function handelDataDisplay(data) {
  const unifiedLocations = unifyLocations(data);
  for (var i = 0; i < unifiedLocations.length; i++) {
    if (unifiedLocations[i].length > 5) {
      color = "red";
    } else {
      color = "blue";
    }

    //draws a circle at location
    var circle = L.circle(
      [
        unifiedLocations[i][0].postLocation.latitude,
        unifiedLocations[i][0].postLocation.longitude,
      ],
      {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 150,
      }
    ).addTo(leaflet_map);
    for (var j = 0; j < unifiedLocations[i].length; j++) {
      //adds popup to this circle

      const circleContentDiv = document.createElement("div");
      const circleContent = document.createElement("div");
      circleContent.innerHTML =
        "<h1>Inherito</h1>" +
        `<img src=${unifiedLocations[i][j].postPhoto} alt='images' class='herImg' /> <br>` +
        unifiedLocations[i][j].caption +
        "<br>" +
        unifiedLocations[i][j].date +
        "<br>" +
        unifiedLocations[i].length +
        "<br>";
      circleContentDiv.appendChild(circleContent);

      const seeMoreButon = document.createElement("button");
      // seeMoreButon.href = "#";
      seeMoreButon.id = `action${i}${j}`;
      seeMoreButon.innerHTML = "See more";
      seeMoreButon.addEventListener("click", function (e) {
        // e.preventDefault();
        alert(1);
        catchImg(unifiedLocations[i]);
      });

      circleContentDiv.appendChild(seeMoreButon);

      circle.bindPopup(circleContentDiv.innerHTML);
    }

    //the pop up displays on hover intead of onClick as it is by default
    circle.on("mouseover", function (event) {
      event.target.openPopup();
    });
  }
}

// Gallery ////////////--------------
//to open a gallery and display images in it
function catchImg(data) {
  var galdiv = document.getElementById("galrow");
  galdiv.style.display = "block";
  var close = document.createElement("BUTTON");
  close.innerHTML = "X";
  close.classList.add("close-btn");
  galdiv.appendChild(close);
  close.addEventListener("click", function () {
    galdiv.style.display = "none";
  });
  const img = document.createElement("img");

  data.forEach((element) => {
    console.log("from gallery" + element);
    let imgItem = element.postPhoto;

    img.src = imgItem; //////////// image
    img.alt = "image";
    img.style.width = "100%";
  });

  const div1 = document.createElement("div");
  div1.classList.add("col-md-3");
  div1.style.marginTop = "15px";
  galdiv.appendChild(div1);

  const div2 = document.createElement("div");
  div2.classList.add("tumbnail");
  div1.appendChild(div2);

  const caption = document.createElement("p");
  caption.classList.add("caption");
  const nodeText = document.createTextNode("Caption from data");
  caption.appendChild(nodeText); //apppend the text to the paragraph
  div2.appendChild(caption); //append the caption to the subdiv

  const a1 = document.createElement("a");
  a1.href = img.src;
  a1.target = "_blank";
  div2.appendChild(a1);

  a1.appendChild(img);
  const capt = document.createElement("p");
  capt.classList.add("caption");
  const node = document.createTextNode("Click on the images to enlarge them");
  capt.appendChild(node);
  a1.appendChild(capt);
  // Append the img to the link
}
