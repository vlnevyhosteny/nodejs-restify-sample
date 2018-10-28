import * as path from 'path';
import './IAppSettings';

const env: string = process.env.NODE_ENV || 'development';
//const debug: boolean = process.env.DEBUG || false;

const settings: IAppSettings = {
    name: 'nodejs-restify-sample',
    env: env,
    debug: true, // temporary
    root: path.join(__dirname, '/..'),
    port: 5000,
    db: 'mysql://localhost:#3306/nodejsDEV'
  };

if (env === 'test') {
  // TODO
  settings.db = 'sometestdb';
}

export { settings };