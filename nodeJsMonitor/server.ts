import { NotFoundError, BadRequestError } from 'restify';

var restify = require('restify');

function respond(req, res, next) {
    if(req.body.url == undefined) {
        return new NotFoundError("URL not defined");
    }

    

    return "foo";
}

var server = restify.createServer();

server.use(restify.plugins.bodyParser({
    mapParams: true,
    requestBodyOnGet: true
}));

server.get('/monitor/', respond);

server.listen(5001, function() {
  console.log('%s listening at %s', server.name, server.url);
});