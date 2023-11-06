const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// midleware 
app.use(cors());
app.use(express.json())

console.log(process.env);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vheow1k.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //food database 
    const foodCollection = client.db('ChiliFoodDB').collection('FoodDB');
    const cartCollection = client.db('ChiliFoodDB').collection('CartDB');
    const userCollection = client.db('ChiliFoodDB').collection('UserDB');


    //api for Foods 
    app.get('/allFoods' , async(req, res) => {
        const allFoods = await foodCollection.find().toArray()
        res.send(allFoods)
    })

    app.get('/allFoods/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await foodCollection.findOne(query)
      res.send(result)
    })

    app.post('/allFoods' ,async(req, res) => {
      const newFood = req.body;
      const result = await foodCollection.insertOne(newFood);
      res.send(result);
    })

    app.post('/carts' , async(req, res) => {
      const newCart = req.body;
      const result = await cartCollection.insertOne(newCart);
      res.send(result)
    })

    app.post('/users' ,async(req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('WellCome to Chili Food Server');
  });
  
  app.listen(port, () => {
    console.log(`Chili food server is running : ${port}`);
  })