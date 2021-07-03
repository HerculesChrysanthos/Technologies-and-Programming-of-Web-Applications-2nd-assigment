const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
var Workd = require('./models/WorkDao.js');
var WorkDao = new Workd();

app.listen(port, () => console.log(`Stating server at port ${port}`));

app.use('/static', express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// set index.html as content root
app.get('/', function(req, res){

    var options = {
        root: path.join(__dirname, 'public')
    };

    res.sendFile('index.html', options, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log('Sent:', 'index.html');
        }
        
    });
});

app.get('/favorites', function(req, res){

    var options = {
        root: path.join(__dirname, 'public')
    };

    res.sendFile('favorites.html', options, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log('Sent:', 'favorites.html');
        }
    });
});

app.get('/favorites/work=:id', function(req, res){

    var options = {
        root: path.join(__dirname, 'public')
    };

    res.sendFile('editBook.html', options, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log('Sent:', 'editBook.html');
        }
    });
});

app.post('/Work', function(req, res) {
    var result = WorkDao.addWork(req.body['title'],req.body['author'],req.body['id']);
    if(result){
        res.sendStatus(201);
    }
    else{
        res.sendStatus(401);
    }
  })

app.delete('/Work', function(req, res){
    var deleteResult = WorkDao.deleteWork(req.body['id']);
    if(deleteResult){
        res.sendStatus(201);
    }
    else{
        res.sendStatus(401);
    }
});

app.get('/Work/worklist', function(req, res){
    var workslist = JSON.stringify(WorkDao.worklist);
    res.send(workslist);
});

app.get('/Work/worklist/:id', function(req, res){
    var id = req.params.id;
    var workFound = WorkDao.findWork(id);
    res.send(workFound);
});

app.post('/favorites', function(req, res){
    WorkDao.updateWork(req.body['title'],req.body['author'],req.body['bookId'],req.body['review']);
    res.writeHead(302, {
        'Location': '/favorites'
      });
    res.end();
});


app.get('/Work/fiterlist/:key', function(req, res){
    //console.log(req.params.key)
    var filteredList = WorkDao.search(req.params.key);
    res.send(JSON.stringify(filteredList));
});
