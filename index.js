const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app=express();
const port=process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r4tqjz5.mongodb.net/?retryWrites=true&w=majority`;

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
    //  await client.connect();
    // Send a ping to confirm a successful connection
    const userCollection = client.db("readDb").collection("users");
    const menuCollection = client.db("readDb").collection("menu");
    const reviewCollection = client.db("readDb").collection("reviews");
    const cartCollection = client.db("readDb").collection("carts");


    app.get('/users',async(req,res)=>{
      console.log(req.headers)
      const result=await userCollection.find().toArray();
      res.send(result);
    })


    app.post('/users',async(req,res)=>{

      const user=req.body
    
      const result=await userCollection.insertOne(user)
      res.send(result);
    })

    app.delete('/users/:id',async(req,res)=>{

      const id=req.params.id
      const query={_id: new ObjectId(id)}
    
      const result=await userCollection.deleteOne(query)
      res.send(result);
    })

    app.patch('/users/admin/:id',async(req,res)=>{
      const id=req.params.id
      const filter={_id:new ObjectId(id)}
      const updatedDoc={
        $set:{
          role:'admin'
        }
      }
      const result=await userCollection.updateOne(filter,updatedDoc)
      res.send(result)
    })

    app.get('/menu',async(req,res)=>{
        const result=await menuCollection.find().toArray()
        res.send(result)
      })
    app.get('/reviews',async(req,res)=>{
        const result=await reviewCollection.find().toArray()
        res.send(result)
      })
      app.get('/carts',async(req,res)=>{
        const email=req.query.email
        const query={ email: email }
        const result=await cartCollection.find(query).toArray();
        res.send(result);
      })
      app.post('/carts',async(req,res)=>{

        const cartItem=req.body
      
        const result=await cartCollection.insertOne(cartItem)
        res.send(result);
      })
      app.delete('/carts/:id',async(req,res)=>{

        const id=req.params.id
        const query={_id: new ObjectId(id)}
      
        const result=await cartCollection.deleteOne(query)
        res.send(result);
      })
    


    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('book server running')
})

app.listen(port,()=>{
    console.log(`book:${port}`)
})