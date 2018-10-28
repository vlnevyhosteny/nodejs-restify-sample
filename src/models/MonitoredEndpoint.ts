import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { type } from "os";
import { MonitoringResult } from './MonitoringResult';

@Entity()
export class MonitoredEndpoint extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Name: string;

    @Column()
    Url: string;

    @Column()
    DateOfCreation: Date;

    @Column()
    DateOfLastCheck: Date;

    @Column()
    MonitoredInterval: number;

    @ManyToOne(type => User, Owner => Owner.MonitoredEndpoints)
    Owner: User;

    @OneToMany(type => MonitoringResult, MonitoringResult => MonitoringResult.MonitoredEndpoint)
    MonitoringResults: MonitoringResult[];
}