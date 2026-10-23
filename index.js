const express = require("express");
const cors = require("cors");

require("dotenv").config();
const { ServerApiVersion, MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// // middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1a.tvkktwu.mongodb.net/?appName=Cluster1A`;

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
    const acceptedTaskCollection = db.collection("accepted_tasks");

    // 1 get ar madhome api gulake brower a dekhabo
    app.get("/job", async (req, res) => {
      const result = await freelanceCollection.find().toArray();
      res.send(result);
    });

    // 2 get kore ,limite ar madhome matro 6 ta data ke dekhabo
    app.get("/six-job", async (req, res) => {
      const cursor = freelanceCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // 3 get kore productdelails dkehob id diye
    app.get("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await freelanceCollection.findOne(query);
      res.send(result);
    });

    // // 4 job accept kore data save korar jonne post route
    app.post("/accepted-tasks", async (req, res) => {
      const query = req.body;
      const result = await acceptedTaskCollection.insertOne(query);
      res.send(result);
    });

    //5  email diye nidrist user accept kora task gula dekhanor jonne
    app.get("/my-tasks", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.applicantEmail = email;
      }
      const cursor = acceptedTaskCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    /// delete korar jonne
    app.delete("/my-tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await acceptedTaskCollection.deleteOne(query);
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
