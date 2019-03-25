let express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({ extended: true }),
    app = express()

// let options = {
//     key:fs.readFileSync('./keys/server.key'),
//     cert:fs.readFileSync('./keys/server.crt')
// }

app.use(urlencodedParser)
app.use(express.static('public'))
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/dynamaker.html'));
});
app.all('*', function(req, res, next) {
    console.log(req.url)
    let deviceAgent = req.headers["user-agent"].toLowerCase()
    req.agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/)
    next()
})
/*
app.get('*', (req, res, next) => {
res.set('Content-Type', 'text/html')
res.send('<h1>STAY QUIET</h1>')
})
*/


app.set(function(err, req, res, next) {
    res.status(404).send('404')
})

http.createServer(app).listen(3000)
