import { Container } from 'inversify';
import { interfaces, Controller, TYPE } from 'inversify-restify-utils';
import { UsersController } from '../src/controllers/UsersController';
import { IDataSeedingService, DataSeedingService } from '../src/services/DataSeedingService';
import { TYPES } from '../src/services/Types';
import { MonitoredEndpointsController } from '../src/controllers/MonitoredEndpointsController';
import { MonitoringResultsController } from '../src/controllers/MonitoringResultsController';

const container = new Container();

container.bind<interfaces.Controller>(TYPE.Controller)
    .to(UsersController).whenTargetNamed("UsersController");
container.bind<interfaces.Controller>(TYPE.Controller)
    .to(MonitoredEndpointsController).whenTargetNamed("MonitoredEndpointsController")
container.bind<interfaces.Controller>(TYPE.Controller)
    .to(MonitoringResultsController).whenTargetNamed("MonitoringResultsController")

container.bind<IDataSeedingService>(TYPES.DataSeedingService).to(DataSeedingService);

export { container };