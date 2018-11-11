import { createConnection } from 'typeorm';

export const CreateTypeormConnection = async () => {
    return createConnection();
}