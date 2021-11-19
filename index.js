const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
// const { restart } = require('nodemon');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hfs8l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
  const sunglassesCollection = client.db("sunglassesWorld").collection("sunglasses");
  const orderCollection = client.db("sunglassesWorld").collection("orders");
  const reviewCollection = client.db("sunglassesWorld").collection("reviews");

  // add place

  app.post("/addNew", async (req, res)=> {
      const result = await sunglassesCollection.insertOne(req.body)
      res.send(result);
  });
  
  app.get("/products", async (req, res) => {
    const result = await sunglassesCollection.find({}).toArray();
    res.send(result)
  })
  
  app.post("/addReview", async (req, res)=> {
    const result = await reviewCollection.insertOne(req.body)
    res.send(result);
  });

  app.get("/reviews", async (req, res) => {
    const result = await reviewCollection.find({}).toArray();
    res.send(result)
  })

  // get single place 
  app.get("/singleProduct/:id", async (req, res) => {
    console.log(req.body);
      const result = await sunglassesCollection
      .find({_id: ObjectId(req.params.id)})
      .toArray();
      res.send(result[0]);
  });


  // confirm Order
  app.post("/confirmOrder", async (req, res) => {
      const result = await orderCollection.insertOne(req.body)
      res.send(result);
  });


  // // My Order
  // app.get("/myBookings/:email", async (req, res) => {
  //     const result = await bookingCollection.find({ email: req.params.email}).toArray();
  //     res.send(result);
  // });


  // // Cancel Order 
  // app.delete("/cancelOrder/:id", async (req, res) => {
  //     const result = await bookingCollection.deleteOne({_id: ObjectId(req.params.id)
  //     });
  //     res.send(result);
  // })

  // // All Bookings

  // app.get("/allBooking", async (req, res) => {
  //     const result = await bookingCollection.find({}).toArray()
  //     res.send(result);
  // })

  // // update Status 
  // app.put("/updateStatus/:id", (req, res) => {
  //     const id = req.params.id;
  //     const updatedStatus = req.body.status;
  //     const filter = {_id: ObjectId(id)};
  //      bookingCollection.updateOne(filter, {
  //         $set: {status: updatedStatus},
  //     })
  //     .then(result => {
  //         res.send(result);
  //     })
      
  // })

});


app.get('/', (req, res) => {
  res.send('Hello Sellers, How are you doing!')
})

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})

// app.listen(process.env.PORT || port)