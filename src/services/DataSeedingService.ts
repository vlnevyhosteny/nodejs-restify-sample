import { createConnection, getRepository } from 'typeorm';
import { User } from '../models/User';

export interface IDataSeedingService {

     SeedUsersIfEmpty();

}

export class DataSeedingService implements IDataSeedingService {

    constructor() { }

    public async SeedUsersIfEmpty() {     
        let names: ['Applifting', 'Batman'];
        
        let userCount = await User.createQueryBuilder()
                                  .where("UserName IN (:...names)", { names })
                                  .getCount()

        if(userCount == 0) {
            var appliftingUser = new User();
            appliftingUser.UserName = "Applifting";
            appliftingUser.Email = "info@applifting.cz";

            await User.save(appliftingUser);

            var batman = new User();
            batman.UserName = "Batman";
            batman.Email = "batman@example.com";

            await User.save(batman);
        } else {
            
        }
    }
}