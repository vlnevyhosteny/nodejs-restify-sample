import { Controller, interfaces, Get, Post, Put, Delete } from "inversify-restify-utils";
import { injectable } from 'inversify';
import { MonitoredEndpoint } from '../models/MonitoredEndpoint';
import { Next, Request, Response, NotFoundError, BadRequestError } from "restify";
import { User } from "../models/User";

@Controller("/monitoredEndpoints")
@injectable()
export class MonitoredEndpointsController implements interfaces.Controller {

    constructor() { }

    @Get("/")
    public Get(req: Request) {  
        if(req.body.ownerId == undefined) {
            return new BadRequestError("Owner id not given.");
        }
        
        let owner = new User();
        owner.Id = req.body.ownerId;

        return MonitoredEndpoint.find({ Owner: owner });
    }

    @Get("/:id")
    public GetId(req: Request) {  
        if(req.body.ownerId == undefined) {
            return new BadRequestError("Owner id not given.");
        }

        if(req.params.id == undefined) {
            return new BadRequestError("Id param not given.");
        }
        
        return MonitoredEndpoint.createQueryBuilder("endpoint")
                                .where("endpoint.id = :id AND endpoint.ownerId = :ownerId",
                                    { id: req.params.id, ownerId: req.body.ownerId });
    }

    @Post("/")
    public Create(req: Request) {
        let newItem = this.MapNewMonitoredEndpoint(req);
        if(newItem == undefined) {
            return new BadRequestError("Unable to parse body values.") 
        }
        
        return MonitoredEndpoint.insert(newItem);
    }

    @Put("/:id")
    public Update(req: Request) {
        if(req.body.ownerId == undefined) {
            return new BadRequestError("Owner id not given.")
        }

        if(req.params.id == undefined) {
            return new BadRequestError("Id param not given.");
        }
 
        let item = MonitoredEndpoint.createQueryBuilder("endpoint")
                                    .where("endpoint.id = :id AND endpoint.ownerId = :ownerId",
                                        { id: req.params.id, ownerId: req.body.ownerId })
                                    .getOne();
        if(item == undefined) {
            return new NotFoundError();
        }

        let itemToUpdate = this.MapUpdateMonitoredEndpoint(req);
        if(itemToUpdate == undefined) {
            return new BadRequestError("Unable to parse body values.") 
        }
        
        return MonitoredEndpoint.update(req.params.id, itemToUpdate);
    }

    @Delete("/:id")
    public Delete(req: Request) {
        if(req.body.ownerId == undefined) {
            return new BadRequestError("Owner id not given.")
        }

        if(req.params.id == undefined) {
            return new BadRequestError("Id param not given.");
        }

        let item = MonitoredEndpoint.createQueryBuilder("endpoint")
                                    .where("endpoint.id = :id AND endpoint.ownerId = :ownerId",
                                        { id: req.params.id, ownerId: req.body.ownerId })
                                    .getOne();
        if(item == undefined) {
            return new NotFoundError();
        }

        return MonitoredEndpoint.delete(req.params.id);
    }

    private MapUpdateMonitoredEndpoint(req: Request) : MonitoredEndpoint {
        let result = this.MapNewMonitoredEndpoint(req);
        result.Id = req.params.id;

        return result;
    }

    private MapNewMonitoredEndpoint(req: Request): MonitoredEndpoint {
        try {
            let owner = new User();
            owner.Id = req.body.ownerId;

            let result = new MonitoredEndpoint();
            result.Name = req.body.name;
            result.Url = req.body.url;
            result.MonitoredInterval = req.body.monitoredInterval;
            result.Owner = owner;
            result.DateOfCreation = new Date();

            return result;
        } catch(err) {
            req.log.debug("Problem with parsing req body.", err);
            return undefined;
        }
    }

}