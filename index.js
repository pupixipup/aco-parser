const express = require("express")
const app = express();
const multer = require('multer');
const converter = require("./convert.js")
var cors = require('cors')
app.use(cors())


// config storage
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });


app.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const fileBuffer = req.file.buffer;
    const colors = parseACOFile(fileBuffer).filter((value) => value).map((color) => {
      return converter[color.type](color.values)
    })
    res.json(colors)
  } catch (err) {
    console.log(err)
    res.json(err)
    process.exit()
  }
})

app.get("/", (req, res) => {
  res.json(["hello world"])
})


app.listen("3000", () => {
  console.log("listening on 3000")
})


function colorInColorSpace(colorSpace, w, x, y, z) {
  if (colorSpace === 0) {
      const r = w / 256;
      const g = x / 256;
      const b = y / 256;
      // console.log("rgb", r, g, b);
      return {type: "rgb", values: [r, g, b]}
  } else if (colorSpace === 1) {
      const h = w / 182.04;
      const s = x / 655.35;
      const b = y / 655.35;
      // console.log(1, 'hsb', h, s, b);
      return {type: "hsb", values: [h, s, b]}
  } else if (colorSpace === 2) {
      const c = (100 - (w / 655.35)) / 100;
      const m = (100 - (x / 655.35)) / 100;
      const y1 = (100 - (y / 655.35)) / 100;
      const k = (100 - (z / 655.35)) / 100;
      return {type: "cmyk", values: [c, m, y1, k]}
  } else if (colorSpace === 7) {
      // Lab color space - what is it?
      return null;
  } else if (colorSpace === 8) {
      // const greyscale = w / 39.0625;
      return null;
  } else if (colorSpace === 9) {
      const c = w / 100;
      const m = x / 100;
      const y1 = y / 100;
      const k = z / 100;
      return {type: "cmyk", values: [c, m, y1, k]}
  }
}

function parseACOFile(data) {
const colors = [];
// Check if the file is opened successfully
if (!data) {
    return false;
}
// Read version number
let location = {
  _cursor: 0,
  get cursor() {
  this._cursor += this.step;
  return this._cursor - this.step;
  },
  get to() {
    return this._cursor + this.step;
  },
  set to(val) {
    return null;
  },
  set cursor(val) {
    this._cursor = val;
  },
  step: 2,
}
let buffer = data.subarray(location.cursor, location.to);

let version = buffer.readUInt16BE(0);
console.log("v: ", version)
// Read the number of colors
buffer = data.subarray(location.cursor, location.to);
let numColors = buffer.readUInt16BE(0);
console.log("num:", numColors)


// Loop through each color entry
for (let i = 0; i < numColors; i++) {
    // Read color type
    buffer = data.subarray(location.cursor, location.to);
    let colorType = buffer.readUInt16BE(0);
    // Read color components
    let components = [];
    for (let j = 0; j < 4; j++) {
      buffer = data.subarray(location.cursor, location.to);
        // console.log(buffer.readUInt16BE(0))
        components.push(buffer.readUInt16BE(0));
    }
    // Call the colorInColorSpace function to convert and print the color
    const pallete = colorInColorSpace(colorType, ...components);
    console.log(pallete)
    colors.push(pallete)
}
return colors
}
