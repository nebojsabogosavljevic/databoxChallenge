import winston from 'winston';
import { DateTime } from 'luxon';

const LOGGING_TIME = DateTime.now().toFormat('dd/MM/yyyy HH:mm:ss');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { logginTime: LOGGING_TIME, service: 'DataBox Metrics Aquisition' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export default logger;
