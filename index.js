const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;




const cors = require('cors');
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a4w6n.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5055;




app.get('/', (req, res) => {
    res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    console.log('connection error', err);

    const userCollection = client.db("userManagement").collection("users");


    app.get('/users', (req, res) => {
        userCollection.find()
            .toArray((err, items) => {
                res.send(items)

            })
    })

    app.post('/addUser', (req, res) => {
        const newUser = req.body;
        console.log('adding new event', newUser);
        userCollection.insertOne(newUser)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })


    
    app.patch('/update/:id', (req, res) => {
        console.log(req.params.id);

        userCollection.updateOne({ _id: ObjectID(req.params.id) },
            {
                $set: { firstName: req.body.firstName, lastName: req.body.lastName,userName: req.body.userName, email: req.body.email,password: req.body.password}
            })
            .then(result => {

                console.log(result);
            })

    })


    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        const id = ObjectID(req.params.id);
        userCollection.deleteOne({ _id: id })

            .then(result => {

                console.log(result);
            })
    })



});


app.listen(port)
