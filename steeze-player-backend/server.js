const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { GridFsStorage} = require('multer-gridfs-storage');
const { GridFSBucket, ObjectId} = require('mongodb');
const shortid = require('shortid');


require('dotenv').config();
const app = express();


//Middleware
app.use(cors());
app.use(bodyParser.json());


// Database Connection
mongoose.connect('mongodb://localhost:27017/steeze-music-db',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));



//GridFS Initialization
let gfs;

const connection = mongoose.connection;
connection.once('open', () => {
    gfs = new GridFSBucket(connection.db, {
        bucketName: 'uploads'
    });
});

//Create storage engine with GridFS
const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/steeze-music-db',
    file: (req, file) => {
        return {
            filename: file.orginalname,
            bucketName: 'uploads'
        };
    }
});

// Multer setup to handle file uploads
const upload = multer({storage})

// Setup api route to handle file uploads
app.post('/api/upload', upload.single('audioFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({error: 'File not uploaded'});
    }
    console.log('Uploaded file: ', req.file);
    res.json({fileId: req.file.id});
});

//Playlist Model
const PlaylistSchema = new mongoose.Schema({
    name: { type: String, required: true},
    songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}],
    playlistCode: {
        type:String,
        required: true,
        unique: true,
        default: () => shortid.generate()
    }
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);


//Song Model
const Song = mongoose.model('Song', new mongoose.Schema({
    title: {type: String, required: true},
    artist: {type: String, required: true},
    songcode: { type: String, required: true, unique: true},
    album: String,
    duration: {type: Number, required: true},
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files'}
}
))

//Middleware error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!')
})

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));