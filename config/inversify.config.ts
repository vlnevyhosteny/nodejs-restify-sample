import { Container } from 'inversify';
import { interfaces, Controller, TYPE } from 'inversify-restify-utils';
import { UsersController } from '../src/controllers/UsersController';
import { IDataSeedingService, DataSeedingService } from '../src/services/DataSeedingService';
import { TYPES } from '../src/services/Types';

const container = new Container();

container.bind<interfaces.Controller>(TYPE.Controller).to(UsersController);

container.bind<IDataSeedingService>(TYPES.DataSeedingService).to(DataSeedingService);

export { container };