const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middlewere
app.use(cors());
app.use(express.json());

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASS;
const uri = `mongodb+srv://${user}:${password}@cluster0.oqkryfl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    //await client.connect();
    const dataCollaction = client.db("toysPark").collection("toys");
    const popularToyCollaction = client.db("toysPark").collection("popular");

    //post insert api
    app.post("/toys", async (req, res) => {
      const catchData = req.body;
      const result = await dataCollaction.insertOne(catchData);
      res.send(result);
    });

    //get oparations and some oparation of query parameter
    app.get("/toys", async (req, res) => {
      let query = {};
      let sort = {};

      //email wise data get
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      //category wise data get
      if (req.query?.category) {
        query = {category : req.query.category}
      }
      //text wise data get for search faild
      if (req.query?.search) {
        query= {toyName : {$regex:req.query.search,$options :'i'}}
      }
      //data sort
      if (req.query?.sort) {
        sort = { price: req.query.sort };
      }
      const userData = dataCollaction.find(query).sort(sort);
      const result = await userData.toArray();
      res.send(result);
    });




    //limit 20 data get api
    app.get("/toyslimit", async (req, res) => {
      const userData = dataCollaction.find().limit(20);
      const result = await userData.toArray();
      res.send(result);
    });

    // one data get api using id
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const getOneData = await dataCollaction.findOne(query);
      res.send(getOneData);
    });

    //popular toy data get api
    app.get("/popular", async (re, res) => {
      const data = await popularToyCollaction.find().toArray();
      res.send(data);
    });

    //update put api
    app.put("/update/:id", async (req, res) => {
      const dataobj = req.body;
      const id = req.params.id;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateData = {
        $set: {
          toyName: dataobj.toyName,
          price: dataobj.price,
          photo: dataobj.photo,
          category: dataobj.category,
          stock: dataobj.stock,
          rating: dataobj.rating,
          description: dataobj.description,
        },
      };
      const result = await dataCollaction.updateOne(
        filter,
        updateData,
        options
      );
      res.send(result);
    });

    //delete api
    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const remove = await dataCollaction.deleteOne(query);
      res.send(remove);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello this is server");
});

app.listen(port, () => {
  console.log("server is running on port", port);
});



 //name wise data get api for  search faild
 
    // app.get("/search/:toyName", async (req, res) => {
    //   const toyName = req.params.toyName;
    //   const data = await dataCollaction.find().toArray();
    //   const categoryData = data.filter((v) => v.toyName == toyName);
    //   res.send(categoryData);
    // });