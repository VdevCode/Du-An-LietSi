const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server bắt đầu start");
});

const uri =
  "mongodb+srv://api-lietsi:JyX3Z30vL2i6DNqG@cluster0.w8cwf8m.mongodb.net/?retryWrites=true&w=majority";

// tạo mongodb client
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

    const ApiLietsi = client.db("LietSiInventory").collection("lietsi");

    // post api liet si
    app.post("/upload-lietsi", async (req, res) => {
      const data = req.body;
      const result = await ApiLietsi.insertOne(data);
      res.send(result);
    });

    // get api liệt sĩ
    app.get("/all-lietsi", async (req, res) => {
      const lietsi = await ApiLietsi.find();
      const result = await lietsi.toArray();
      res.send(result);
    });

    // ket noi database
    await client.db("admin").command({ ping: 1 });
    console.log("Bạn đã kết nối đến Database Mongodb thành công!!!");
  } finally {
  
  }
}

// show loi khi ket noi
run().catch(console.dir);

app.listen(port, () => {
  console.log("đang chạy port: http://localhost:", port);
});
