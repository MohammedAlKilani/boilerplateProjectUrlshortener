require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
let urlArry =[]
app.post("/api/shorturl",(req,res)=>{
  // console.log(req.body.url)
  
   const urlObject = new URL(req.body.url);
  dns.lookup(urlObject.hostname,(err,val)=>{
    if(err){
      res.json({ error: 'invalid url' }) 
      return
    }
     let shortenedURL =parseInt(Math.floor(Math.random() * 10))
    urlArry.push({original_url:urlObject.href,short_url:shortenedURL})
    // console.log(urlArry)
    res.json({original_url:urlObject.href,short_url:shortenedURL})
  })
  
})

app.get("/api/shorturl/:short_url",async(req,res)=>{
let url = await urlArry.find((url)=>{
   return url.short_url== req.params.short_url
  })
  console.log(url)
  if(url){
    // console.log(url.original_url)
    // console.log(new URL(url.original_url))
    let newUrl =url.original_url
    res.redirect(newUrl )

  }
  
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
