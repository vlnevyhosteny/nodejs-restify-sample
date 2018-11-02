import { Controller, interfaces, Get } from "inversify-restify-utils";
import { injectable } from 'inversify';
import { MonitoredEndpoint } from '../models/MonitoredEndpoint';
import { Next, Request, Response, NotFoundError, BadRequestError } from "restify";
import { User } from "../models/User";

@Controller("/monitoredEndpoints")
@injectable()
export class MonitoredEndpointsController implements interfaces.Controller {

    constructor() { }

    @Get("/")
    public index(req: Request) {  
        if(req.body.ownerId == undefined) {
            return new BadRequestError("Owner id not given.")
        }
        
        let owner = new User();
        owner.Id = req.body.ownerId;

        return MonitoredEndpoint.find({ Owner: owner });
    }

}