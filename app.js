const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require("fs")
const vision = require('@google-cloud/vision');

require("dotenv").config()

const tessc = require("tesseract.js")

const app = express();


// const client = new vision.ImageAnnotatorClient();

app.use(express.json({limit:'600mb'}))
app.use(express.urlencoded({ extended: true }))
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));



app.get("/wordspygame",function(req,res){
    res.sendFile(path.join(__dirname,"/public/wordspy.html"))
})

app.get("/training",function(req,res){
    res.sendFile(path.join(__dirname,"/public/training.html"))
})
app.post('/upload', (req, res) => {
    try {
    const { image } = req.body;
    if (!image) {
        return res.status(400).send('No image data');
    }

    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const filePath = path.join(__dirname, 'public/images', 'canvas-image.png');

   
        fs.writeFile(filePath, base64Data, 'base64', (err) => {
            if (err) {
                console.error('Error saving image:', err);
                return res.status(500).send('Error saving image');
            }
            try {
                tessc.recognize("public/images/canvas-image.png", "eng").then(out => {
                    console.log(out.data.text)
                    res.send(out.data.text);
                })
            } catch (error) {
                res.send("Analysing.......")
            }

        });
    } catch (error) {
        console.log(error)
        res.send("Loading.....")
    }
});

app.get("*",function(req,res){
    res.sendFile(path.join(__dirname,"/public/404.html"))

})


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} Open Link http://localhost:${PORT}`);
});
