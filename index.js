const express = require("express");
const cors = require("cors");
const { ServerApiVersion, MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// // middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://freelance_db:g4RuUHzup7xDs3vw@cluster1a.tvkktwu.mongodb.net/?appName=Cluster1A";

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

    /// mongodb theke api gulake niye asa
    const db = client.db("freelance_db");
    const freelanceCollection = db.collection("job");

    // 1 get ar madhome api gulake brower a dekhabo
    app.get("/job", async (req, res) => {
      const result = await freelanceCollection.find().toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "pinged your deployment. You successfully connected to mongodb!",
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello My dear frelacer .....!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
