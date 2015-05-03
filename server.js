var http = require('http');
var fs = require('fs');
var log = require('winston');
var chat = require('chat');

http.createServer(function(req, res) {

    if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'

        fs.readFile(__dirname + '/css/bootstrap.css', function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.write(data);
            res.end();
        });

    }

    switch(req.url) {
        case "/":
            sendFile("index.html", res);
            break;
        case "/subscribe":
            chat.subscribe(req, res);
            break;
        case "/publish":
            var body = '';

            req.on('readable', function() {
                body += req.read();

                if(body.length > 1e4) {
                    res.statusCode = 413;
                    res.end("Your message is too big for my little chat...");
                }
            }).on('end', function() {
                try {
                    body = JSON.parse(body);
                } catch(e) {
                    res.statusCode = 400;
                    res.end("Bad Request");
                    return;
                }


                chat.publish('- ' + body.message);
                res.end('ok');
            });
            break;
        default:
            res.statusCode = 404;
            res.end('Not Found');
    }
}).listen(process.env.PORT || 3000);

function sendFile(fileName, res) {
    var fileStream = new fs.createReadStream(fileName);

    fileStream.pipe(res);

    fileStream.on('error', function(err) {
        res.statusCode = 404;
        res.end("Error!");
        log.error(err);
    });

    fileStream.on('close', function() {
        res.end();
    });
}