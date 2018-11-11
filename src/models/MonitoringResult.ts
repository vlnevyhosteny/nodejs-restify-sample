import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
import { MonitoredEndpoint } from './MonitoredEndpoint';

@Entity()
export class MonitoringResult extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    DateChecked: Date;

    @Column()
    StatusCode: number;

    @Column()
    Payload: string;

    @ManyToOne(type => MonitoredEndpoint, MonitoredEndpoint => MonitoredEndpoint.MonitoringResults)
    MonitoredEndpoint: MonitoredEndpoint;
}