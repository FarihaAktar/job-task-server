const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express()
const port = 4000;


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssth5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventCollection = client.db("CreateEvents").collection("events");

    app.post('/addEvent', (req, res) => {
        const event = req.body;
        console.log(event)
        eventCollection.insertOne(event)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })


    app.get('/allEvents', (req, res) => {
        eventCollection.find()
            .toArray((err, events) => {
                res.send(events)
            })
    });

    app.get('/singleEvent/:id', (req, res) => {
        eventCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, event) => {
                res.send(event)
            })
    })

});



app.listen(process.env.PORT || port)