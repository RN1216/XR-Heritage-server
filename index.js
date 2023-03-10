const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT ||5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2lnchnk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        const servicesCollection = client.db('xr-heritage').collection('servises');
        const reviewCollection  = client.db('xr-heritage').collection('reviews');

        app.get('/servises',async(req,res)=>{
            const query = {}
            const size = parseInt(req.query.size);
            const cursor = servicesCollection.find(query);
            const servises = await cursor.limit(size).toArray();
            res.send(servises);
        }); 

        app.get('/servises/:id',async(req,res)=>{
            const id =req.params.id;

            const query = {_id: ObjectId(id)};
            const servises = await servicesCollection.findOne(query);
            res.send(servises);
        });

       

        app.get('/reviews',async(req,res)=>{
            let query={};
            if(req.query.email){
                query= {
                    email:req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews =await cursor.toArray();
            res.send(reviews);
        });

        app.get('/reviews',async(req,res)=>{
            const query={}
            const cursor = reviewCollection.find(query);
            const reviews =await cursor.toArray();
            res.send(reviews);
        });

        app.post('/reviews',async (req,res)=>{
            const review =req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
        app.delete('/reviews/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(err=>{console.log(err)})
app.get('/',(req ,res)=>{
    res.send('XR is running')
})

app.listen(port ,()=>{
    console.log(`XR server running on${port}`);
})