var express = require("express");
var router = express.Router();
const url = require("url");
const querystring = require("querystring");

const vision = require("@google-cloud/vision");

var base64Photo;
const image2base64 = require("image-to-base64");
image2base64(
  "https://1.bp.blogspot.com/-IKs8HTnJ9gw/XZnNulcjQ2I/AAAAAAAAhVs/u7Fq4ujHrs0sXeyxLqN5rsQt0LphSKRkQCLcBGAsYHQ/s1600/migros-ekim-ayi-katalog-borsur-migroskop-2019.jpg"
)
  .then(response => {
    base64Photo = response;
  })
  .catch(error => {
    console.log(error); //Exepection error....
  });

/* GET vision listing. */
router.get("/", function(req, res, next) {
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "APIKey.json"
  });

  const request = {
    image: {
      content: base64Photo
    }
  };

  client
    .textDetection(request)
    .then(response => {
      console.log(response);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "POST");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
      );
      res.send(response[0].textAnnotations[0].description);
    })
    .catch(err => {
      console.error(err);
    });
});

router.post('/base64',(req,res,next) => {
  const base64Data = req.body.base64;

  const client = new vision.ImageAnnotatorClient({
    keyFilename: "APIKey.json"
  });

  const request = {
    image: {
      content: base64Data
    }
  };

  client
    .textDetection(request)
    .then(response => {
      console.log(response);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "POST");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
      );
      res.send(response[0].textAnnotations[0].description);
    })
    .catch(err => {
      console.error(err);
    });
});

router.get("/photo", function(req, res, next) {
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "APIKey.json"
  });
  const photoUrl = req.param.photoUrl;

  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  let parsedUrl = url.parse(fullUrl);
  let parsedQs = querystring.parse(parsedUrl.query);
  console.log(parsedQs.photoUrl);

  const request = {
    image: {
      source: { imageUri: parsedQs.photoUrl }
    }
  };
  client
    .textDetection(request)
    .then(response => {
      console.log(response);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "POST");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
      );
      res.send(response[0].textAnnotations[0].description);
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = router;
