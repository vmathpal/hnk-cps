import multer from "multer";
//console.log("__dirname", __dirname);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage: storage });

module.exports = uploads;
