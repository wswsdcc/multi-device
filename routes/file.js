let express = require('express');
let router = express.Router();
let multer = require('multer');
let cors = require('cors');
const toPdf = require("office-to-pdf");
const fs = require("fs");

const RootPath = require('../config');
const whitelist = ['http://192.168.2.31:8080'];

///////////////////////// Upload /////////////////////////////////////////

//Cors Complex Request Config
let CorsComplex = function (req, callback) {
    let corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true,
            methods: ['POST'],
            credentials: true,
            maxAge: 3600
        } // enable CORS for this request
    } else {
        corsOptions = {
            origin: false,
        } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
};

let filename = "";
// Multer DiskStorage Configuration
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        filename = file.originalname;
        // cb(null, Date.now() + ' - ' + file.originalname)
        cb(null, file.originalname)
    }
});
let upload = multer({ storage: storage }).single('file');

router.options('/upload', cors(CorsComplex));
router.post('/upload', cors(CorsComplex), upload, function (req, res) {
    fs.exists('./public/uploads/' + filename + ".pdf", function (exists) {
        if (!exists) {
            var index1 = filename.lastIndexOf(".")
            var index2 = filename.length
            var suffix = filename.substring(index1 + 1, index2)
            var wordBuffer = fs.readFileSync("./public/uploads/" + filename);
            if (suffix != "pdf") {
                toPdf(wordBuffer, 10)
                    .then((pdfBuffer) => {
                        fs.writeFileSync("./public/uploads/" + filename + ".pdf", pdfBuffer)
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            }
        }
    });
    res.status(200).send('OK');
});


///////////////////////// Download /////////////////////////////////////////

//Cors Simple Request Config
let CorsSimple = {
    'exposedHeaders': '*',   //解决fetch的response获取不到header内容 <-->  https://github.com/github/fetch/issues/399
    'origin': function (origin, callback) {
        if (origin === undefined || whitelist.indexOf(origin) !== -1) {   //允许form或者浏览器或者postman直接访问
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};
router.get('/download', cors(CorsSimple), (req, res) => {
    res.download(RootPath + '/public/uploads/Test.txt');
});

router.get('/download2', (req, res) => {
    res.download(RootPath + '/public/uploads/Test.txt');
});

module.exports = router;