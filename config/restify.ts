import * as path from 'path';
import { settings } from './AppSettings';
import { CreateTypeormConnection } from '../src/database/CreateTypeormConnection';
import { DataSeedingService } from '../src/services/DataSeedingService';
import { InversifyRestifyServer } from 'inversify-restify-utils';
import { container } from './inversify.config';
import { TYPES } from '../src/services/Types';
import { logger } from '../src/logger/Logger';

export const StartServer = async () => {
  // get path to route handlers
  const pathToRoutes: string = path.join(settings.root, '/app/routes');

  const inversify = new InversifyRestifyServer(container, { name: settings.name, log: logger });
  const server = inversify.build();

  await CreateTypeormConnection();

  var env = process.env.NODE_ENV || 'dev';
  if(env == 'dev') {
    container.get<DataSeedingService>(TYPES.DataSeedingService).SeedUsersIfEmpty();
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