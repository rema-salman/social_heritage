var imageData = [
  {
    postPhoto: "hesta.png",
    caption: "here is the caption",
    date: "newDate()",
  },
  {
    postPhoto: "hesta2.png",
    caption: "new caption",
    date: "newDate()",
  },
  {
    postPhoto: "hesta.png",
    caption: "Another caption",
    date: "newDate()",
  },
  {
    postPhoto: "hesta2.png",
    caption: "Caption 4",
    date: "newDate()",
  },
];

for (var i = 0; i < imageData.length; i++) {
  var cap = document.createElement("p");
  var date = document.createElement("p");
  var image = document.createElement("img");
  image.src = imageData[i].postPhoto;
  cap.innerHTML = imageData[i].caption +"<br>";
  date.innerHTML = imageData[i].date;
  document.body.appendChild(image);
  document.body.appendChild(cap);
  document.body.appendChild(date);
  console.log(imageData[i].date);
}
