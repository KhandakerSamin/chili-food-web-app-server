const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// midleware 
app.use(cors({
  origin: [
    'http://localhost:5173'
  ],
  credentials: true
}));app.use(express.json())

// console.log(process.env);


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

    app.post('/users' ,async(req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
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


    app.get('/carts',  async (req, res) => {
      // console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { userEmail: req.query.email }
      }
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })


    app.get('/allFoodsbyEmail',  async (req, res) => {
      // console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { MadeBy: req.query.email }
      }
      const result = await foodCollection.find(query).toArray();
      res.send(result);
    })


    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

    app.put('/allFoods/:id', async(req,res) => {
      const id = req.params.id;
      console.log(id);
      const filter = {_id : new ObjectId(id)}
      const options = { upsert : true};
      const updatedFood = req.body;
      const Food = {
        $set:{
          name: updatedFood.Name,
          Category : updatedFood.Category,
          Quantity: updatedFood.Quantity,
          Price : updatedFood.Price,
          FoodOrigin: updatedFood.FoodOrigin,
          Description : updatedFood.Description,
          Image: updatedFood.Image,
          Count: updatedFood.Count,
          MadeBy: updatedFood.MadeBy
        }
      }
      const result = await foodCollection.updateOne(filter,Food, options);
      res.send(result);
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