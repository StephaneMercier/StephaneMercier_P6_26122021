const multer = require("multer");

const MIME_TYPES = {
  "images/jpg": "jpg",
  "images/jpeg": "jpeg",
  "images/png": "png",
};

const storeImg = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "image");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storeImg }).single("image");
