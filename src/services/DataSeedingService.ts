import { User } from '../models/User';
import { inject, injectable } from "inversify";
import { logger } from '../logger/Logger';

export interface IDataSeedingService {

     SeedUsersIfEmpty();

}

@injectable()
export class DataSeedingService implements IDataSeedingService {

    constructor() { }

    public async SeedUsersIfEmpty() {     
        let names: ['Applifting', 'Batman'];
        
        let userAppLifting = await User.findOne({ UserName: "Applifting" })
        let userBatman = await User.findOne({ UserName: "Batman" })

        if(userAppLifting != null && userBatman != null) {
            logger.info("Users exists - no need to seed them.")

            return;
        }

        if(userAppLifting == null) {
            var appliftingUser = new User();
            appliftingUser.UserName = "Applifting";
            appliftingUser.Email = "info@applifting.cz";

            await User.save(appliftingUser);
        }

        if(userBatman == null)
        {
            var batman = new User();
            batman.UserName = "Batman";
            batman.Email = "batman@example.com";

            await User.save(batman);
        }

        logger.info("User data seeded.");
    }
}