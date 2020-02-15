const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get((req, res)=> {
     Article.find(function(err, foundArticles) {
       if (!err) {
         res.send(foundArticles);
       }
       else {
         res.send(err)
       }
     })
   })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })

    newArticle.save(function(err){
      if(!err) {
        res.send("Successfully saved")
      } else {
        res.send(err)
      }
    })
  })
  .delete((req,res) => {
    Article.deleteMany((err) => {
     if(!err){
       res.send("Successfully deleted")
     } else {
       res.send(err)
     }
    })
  })

app.route("/articles/jack-bauer")
  .get((req, res) => {
    Article.findOne('jack-bauer', function(err, foundJack) {
      if (!err){
        res.send(foundJack)
      } else {
        res.send(err)
      }
    })
  })


  app.route("/articles/:articleTitle")
    .get((req,res) => {
      const articleTitle = req.params.articleTitle

      Article.findOne({title: articleTitle }, function(err,foundArticles){
        if(foundArticles) {
          res.send(foundArticles)
        } else {
          res.send("No article matching found")
        }
      })
    })
    .put((req, res) => {
      Article.update(
        { title: req.params.articleTitle},
        { title: req.body.title, content: req.body.content},
        { overwrite: true },
        function(err, results){
          if(!err){
            res.send("Successfully added article")
          }
        }
      )
    })
    .patch((req, res) => {
      Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
          if(!err){
            res.send("Successfully done")
          } else {
            res.send(err)
          }
        }
      )
    })
    .delete((req, res)=> {
      Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
          if(!err){
            res.send("Successfully deleted")
          } else {
            res.send(err)
          }
        }
      )
    })

app.listen(3000, function() {
  console.log("Server started on port 3000")

})
