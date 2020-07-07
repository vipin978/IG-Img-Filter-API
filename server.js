const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : 'postgres://zedaaepnybqnnd:a06440b823779b932e648906ba4fc1bac3263a2d93071ae4bd51ec8dc702263a@ec2-34-224-229-81.compute-1.amazonaws.com:5432/d6cn9o883ie2c3',
    ssl:true
  }
});

// mysql.db('*').from('userdetails').then(data => console.log(data));
const app = express()

app.use(bodyParser.json())
// app.use(cors());

const dataBase = {
  users : [
    {
      id:123,
      name:"vipin",
      gmail:"vipin@gmail.com",
      password:"vipinsmit",
      joined:new Date(),
      hits:0
    },
    {
      id:124,
      name:"spider",
      gmail:"spider@gmail.com",
      password:"spidyyy",
      joined:new Date(),
      hits:0
    }
  ]
}

//  / - root req

app.get('/',(req,res)=>{
  res.json("connected")
})

// /signin - signin request

app.post('/signin',(req,res)=>{
    db.select('name','email','hash').from('userdetails').where('email','=',req.body.email)
    .then(user => {
      if(user.length === 0){
          return res.json("Not a valid EmailId")
      }
      isValid = bcrypt.compareSync(req.body.password, user[0].hash);
      if(isValid){
        res.json({name:user[0].name,status:"success"})
      }
      else{
        res.json({status:"Not a valid password"});
      }
    })
    .catch(err => {
      res.json({status:"Error loging in"})
      console.log(err);
    }
    )
})

// /register - register request

app.post('/register',(req,res)=>{

  var hash = bcrypt.hashSync(req.body.password);

  // ASYNC
  // bcrypt.hash(req.body.password, null, null, function(err, hash) {
  //    hashing.h = hash;
  // })
  if(req.body.name !== ""){

    db('userdetails')
    .insert({name:req.body.name,email:req.body.email,hash:hash})
    .then(userid =>
    db.select('name','email').from('userdetails').where('id', userid[0])
    .then(user => res.json(
      {name:user[0].name,status:"success"}
    ))
  )
    .catch(err => res.status(400).json({status:'Same mail id or user name'}))
  }
  else{
    res.status(400).json({status:'Enter details'})
  }
})

// /profile - profile req

app.get('/profile/:id',(req,res) => {
  const { id } = req.params;

})


app.listen(process.env.PORT || 3001);
