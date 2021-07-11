const express = require('express')

const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectID;


app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzfaw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;





const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
client.connect(err => {

  const productCollection = client.db("grocery").collection("groceryProduct");



  app.get('/products', (req, res) => {

    productCollection.find()
      .toArray((err, products) => {
        res.send(products)
        
      })

  })






  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    
    productCollection.insertOne(newProduct)
      .then(result => {
        
        res.send(result.insertedCount > 0)
      })
  })



  app.get('/product/:id', (req, res) => {
    console.log(req.params.id)
    productCollection.find({ _id:ObjectId(req.params.id)})
        .toArray((documents) => {
            res.send(documents)
            console.log(documents)
        })
})

  app.delete('/delete/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    console.log('i am id' ,id);
    productCollection.deleteOne({ _id: id })
        .then(result => {
            res.send(result.deletedCount > 0);
        })
})





app.patch('/editProduct/:id', (req, res) => {
  console.log(req.params.id)
  productCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
          $set: {
              name: req.body.name,
              price:req.body.price,
          }
      })
      .then(result => {
          res.send(result.modifiedCount > 0);
          console.log(result)
      })
})

 



  //client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})