import Logger = require('bunyan');
import { settings } from '../../config/AppSettings';

export let logger = Logger.createLogger({
    name: settings.name,
    streams: [
        {
            level: 'debug',
            stream: process.stdout
        },
        {
            level: 'error',
            path: 'error.log'
        }
    ]
});