import * as restify from 'restify';
import * as path from 'path';
import { settings } from './AppSettings';
import { CreateTypeormConnection } from '../src/database/CreateTypeormConnection';
// import { logger } from '../utils/logger';
import { DataSeedingService } from '../src/services/DataSeedingService';

export const StartServer = async () => {
  // get path to route handlers
  const pathToRoutes: string = path.join(settings.root, '/app/routes');

  // create Restify server with the configured name
  const server: restify.Server = restify.createServer({ name: settings.name });

  await CreateTypeormConnection();

  var env = process.env.NODE_ENV || 'dev';
  if(env == 'dev') {
    new DataSeedingService().SeedUsersIfEmpty();
  }

  function respond(req, res, next) {
      res.send('hello ' + req.params.name);

      next();
  }

  server.get('/hello/:name', respond);
  server.head('/hello/:name', respond);

  server.listen(settings.port, function() {
    console.log('%s listening at %s', server.name, server.url);
  });

  return server;
}