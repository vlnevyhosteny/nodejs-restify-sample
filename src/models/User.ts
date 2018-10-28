import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Generated, OneToMany} from "typeorm";
import { MonitoredEndpoint } from './MonitoredEndpoint';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    UserName: string;

    @Column()
    Email: string;

    @Generated("uuid")
    AccessToken: string;

    @OneToMany(type => MonitoredEndpoint, MonitoredEndpoint => MonitoredEndpoint.Owner)
    MonitoredEndpoints: MonitoredEndpoint[];
}