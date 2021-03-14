const express = require("express");
var cors = require("cors");

const bodyParser = require("body-parser");
const FirebaseDB = require("./firebase");

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));

// EndPoint (proxy) from client to Firebase
app.post("/post", function (req, res, next) {
  const requestData = req.body;
  const date = JSON.stringify(new Date());
  if (
    requestData.caption === "" &&
    requestData.postPhoto === "" &&
    requestData.postLocation === {}
  ) {
    return res.status(400).json({
      msg: "No POST was uploaded",
    });
  }

  const post = {
    date: date,
    caption: requestData.caption,
    postLocation: requestData.postLocation,
    postPhoto: requestData.postPhoto,
  };

  FirebaseDB.ref("posts")
    .push()
    .set(post, function (error) {
      if (error) {
        // The write failed...
        console.log("Failed with error: " + error);
        return res.status(403).json({
          msg: "An error has accrued ",
        });
      } else {
        // The write was successful...
        console.log("success");
        return res.status(200).json({
          msg: "POST was successfully uploaded",
          date,
        });
      }
    });
});

app.get("/posts", function (req, res) {
  const posts = [];
  FirebaseDB.ref("posts")
    .once("value")
    .then(function (snapshot) {
      console.log("Hellooo" + snapshot.val());
      const data = snapshot.val();
      for (let i in data) {
        console.log("ITEM" + data[i]);
        posts.push(data[i]);
      }
      res.status(200);
      res.send(posts);
    });
});

app.listen(5000, () => console.log("server started...."));
