const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
const cors = require('cors')

dotenv.config()

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'passop';
const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 3000

client.connect();

// .env page simulates the env wuth secrets if any on the host machine that it runs
// console.log(process.env.MONGO_URI) // remove this after you've confirmed it is working

// get all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

// save a password
app.post('/', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password)
    res.send({success : true , result:  findResult})
})

// delete a password by id 
app.delete('/', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password)
    res.send({success : true , result:  findResult})
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})