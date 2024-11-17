import * as dotenv from 'dotenv';
import path from 'path';

export function loadEnvConfig() {
    
    dotenv.config({ path: process.env.NODE_ENV === 'testing' ? './src/config/testing.env' : './src/config/production.env' });
    console.log("using: "+process.env.NODE_ENV)
    const config = {
        secretKey: process.env.secret || 'secret',
        saltRound: process.env.SALTROUND || "0",
        admin: process.env.ADMIN || "admin",

        all: process.env.ALL || 'employee,admin',
        dbHost: process.env.DB_HOST || 'localhost',
        dbName: process.env.DB_NAME || 'test',
        dbCollection: process.env.DB_COLLECTION || 'test',
    };
    return config;
}