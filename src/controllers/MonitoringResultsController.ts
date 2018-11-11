import { Controller, interfaces, Get, Post, Put, Delete } from "inversify-restify-utils";
import { injectable } from 'inversify';
import { MonitoredEndpoint } from '../models/MonitoredEndpoint';
import { Next, Request, Response, NotFoundError, BadRequestError } from "restify";
import { User } from "../models/User";
import { MonitoringResult } from "../models/MonitoringResult";

@Controller("/monitoredResults")
@injectable()
export class MonitoringResultsController implements interfaces.Controller {

    constructor() { }

    @Get("/")
    public async Get(req: Request) {  
        if(req.body.ownerId == undefined) {
            return new BadRequestError("Owner id not given.");
        }

        var result;
        if(req.body.monitoredEndpointId == undefined)
        {
            result = await MonitoringResult.createQueryBuilder("result")
                                           .innerJoin("result.MonitoredEndpoint", "endpoint")
                                           .where("endpoint.ownerId = :ownerId", { ownerId: req.body.ownerId })
                                           .orderBy("result.DateChecked", "DESC")
                                           .limit(10)
                                           .getMany();
        } else {
            result = await MonitoringResult.createQueryBuilder("result")
                                            .innerJoin("result.MonitoredEndpoint", "endpoint")
                                            .where("endpoint.ownerId = :ownerId", { ownerId: req.body.ownerId })
                                            .andWhere("endpoint.Id = :endpointId", { endpointId: req.body.monitoredEndpointId})
                                            .orderBy("result.DateChecked", "DESC")
                                            .limit(10)
                                            .getMany();
        }
                                    
        if(result == undefined) {
            return new MonitoringResult[0];
        }

        return result;
    }

    @Get("/:id")
    public async GetId(req: Request) {  
        if(req.body.ownerId == undefined) {
            return new BadRequestError("Owner id not given.");
        }

        if(req.params.id == undefined) {
            return new BadRequestError("Id param not given.");
        }

        var result = await MonitoringResult.createQueryBuilder("result")
                                           .innerJoin("result.MonitoredEndpoint", "endpoint")
                                           .where("endpoint.ownerId = :ownerId", { ownerId: req.body.ownerId })
                                           .andWhere("result.Id = :id", { id: req.params.id })
                                           .getOne();

        if(result == undefined) {
            return new MonitoringResult[0];
        }

        return result;
    }

    @Post("/")
    public async Create(req: Request) {
        let newItem = this.MapNewMonitoringResult(req);
        if(newItem == undefined) {
            return new BadRequestError("Unable to parse body values.") 
        }
        
        return await MonitoringResult.insert(newItem);
    }

    @Delete("/:id")
    public async Delete(req: Request) {
        if(req.body.ownerId == undefined) {
            return new BadRequestError("Owner id not given.")
        }

        if(req.params.id == undefined) {
            return new BadRequestError("Id param not given.");
        }

        let item = await MonitoringResult.createQueryBuilder("result")
                                         .innerJoin("result.MonitoredEndpoint", "endpoint")
                                         .where("endpoint.ownerId = :ownerId", { ownerId: req.body.ownerId })
                                         .andWhere("result.Id = :id", { id: req.params.id })
                                         .getOne();
        if(item == undefined) {
            return new NotFoundError();
        }

        return await MonitoringResult.delete(req.params.id);
    }

    private MapNewMonitoringResult(req: Request): MonitoringResult {
        try {
            let result = new MonitoringResult();
            result.StatusCode = req.body.statusCode;
            result.Payload = req.body.payload;
            result.DateChecked = new Date(req.body.dateChecked);
            
            let endpoint = new MonitoredEndpoint();
            endpoint.Id = req.body.monitoredEndpointId;
            result.MonitoredEndpoint = endpoint;

            return result;
        } catch(err) {
            req.log.debug("Problem with parsing req body.", err);
            return undefined;
        }
    }

}