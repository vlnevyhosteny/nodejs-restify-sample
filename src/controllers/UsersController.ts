import { interfaces, Controller } from "inversify-restify-utils";
import { injectable } from 'inversify';

@Controller("/users")
@injectable()
export class UsersController implements interfaces.Controller {

}