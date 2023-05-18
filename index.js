const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middlewere
app.use(cors());
app.use(express.json());


const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASS
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
    await client.connect();
   
      
      app.get('/hh', async (req, res) => {
          res.send('this is inner in mongoBody this hwlo ')
      })
    
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
