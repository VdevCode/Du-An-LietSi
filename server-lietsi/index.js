const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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

    // patch liet si 
    app.patch("/lietsi/:id", async(req,res) =>{
      const id = req.params.id
      const updateLietsiData = req.body
      const filter = {_id: new ObjectId(id)}

      const options = { upsert: true }
      const updateLietsi = {
        $set: {
          ...updateLietsiData
        }
      }
      
      //update lai infor
      const result = await ApiLietsi.updateOne(filter, updateLietsi, options)
      res.send(result)

    })


    //delete lietsi
    app.patch("lietsi/:id", async(req,res) => {
      const id =req.params.id
      const filter = {_id: new ObjectId(id)}

      const result = await ApiLietsi.deleteOne(filter)
      res.send(result)
    })

    //find by danh muc
    app.get("/all-liest", async(req,res) => {
      let query = {}
      if(req.query?.career){
        query = {career: req.query.career}
      }else{

      }

      const result = await ApiLietsi.find(query).toArray()
      res.send(result)

    })



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
