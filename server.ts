import "reflect-metadata";

import { settings } from './config/AppSettings';
import { server } from './config/restify';
import { createConnection } from "typeorm";

createConnection();

export { server };
