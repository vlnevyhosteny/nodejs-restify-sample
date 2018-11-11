import * as path from 'path';
import { settings } from './AppSettings';
import { CreateTypeormConnection } from '../src/database/CreateTypeormConnection';
import { DataSeedingService } from '../src/services/DataSeedingService';
import { InversifyRestifyServer } from 'inversify-restify-utils';
import { container } from './inversify.config';
import { TYPES } from '../src/services/Types';
import { logger } from '../src/logger/Logger';
import { User } from '../src/models/User';
const restify = require("restify");

export const StartServer = async () => {
  const pathToRoutes: string = path.join(settings.root, '/app/routes');

  const inversify = new InversifyRestifyServer(container, { name: settings.name, log: logger });

  inversify.setConfig((app) => {
    app.use(restify.plugins.acceptParser(app.acceptable));
    app.use(restify.plugins.queryParser({
      mapParams: true
     }));
    app.use(restify.plugins.bodyParser({
      mapParams: true,
      requestBodyOnGet: true
    }));

    app.use(restify.authorizationParser());
    app.use(async function (req, res, next) {
      if(req.username == undefined || req.authorization.basic.password == undefined) {
        return next(new restify.NotAuthorizedError());
      }

      if(await User.count({ UserName: req.username, AccessToken: req.authorization.basic.password }) == 0) {
        return next(new restify.NotAuthorizedError());
      } else {
        return next();
      }
    });
  });

  await CreateTypeormConnection();

  var env = process.env.NODE_ENV || 'dev';
  if(env == 'dev') {
    let seedingService = container.get<DataSeedingService>(TYPES.DataSeedingService);

    seedingService.SeedUsersIfEmpty();
  }

  const server = inversify.build();
  server.listen(settings.port)

  return server;
}