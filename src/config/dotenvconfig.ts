import * as dotenv from 'dotenv';
import path from 'path';

export function loadEnvConfig() {
    ;
    dotenv.config({ path: process.env.NODE_ENV === 'test' ? './src/config/production.env' : './src/config/production.env' });
    const config = {
        secretKey: process.env.secret,
        saltRound: process.env.SALTROUND,
        admin: process.env.ADMIN,

        all: process.env.ALL,
        dbHost: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
        dbCollection: process.env.DB_COLLECTION,
    };
    return config;
}