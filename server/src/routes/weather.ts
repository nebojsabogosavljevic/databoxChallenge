import express from 'express';
import axios from 'axios';
import * as interf from '../interfaces';
import logger from '../modules/logger';
import { extractDailyAQMetrics, sendData } from '../modules/metricsFunctions';

const router = express.Router();

router.get('/', async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://air-quality-api.open-meteo.com/v1/air-quality',
        params: { latitude: '46.52', longitude: '16.43', hourly: 'pm10,carbon_monoxide,ozone,dust,uv_index' },
    };
    try {
        const response = await axios.request(options);
        logger.info('Successfully fetched data from Air Quality API');
        const airQualityMetrics = extractDailyAQMetrics(response.data);
        res.send(airQualityMetrics);
    } catch (error: any) {
        logger.error('Error while fetching data from Air Quality API', { RespErrMsg: error.message, success: false });
        return error;
    }
});
router.post('/', async (req, res) => {
    const weatherData = req.body;

    const failedMetrics = [];
    for (const [metricId, metricValue] of Object.entries(weatherData)) {
        const metricValueNum = Number(metricValue);
        const result = await sendData(metricId, metricValueNum, 'weather');
        if (!result) {
            failedMetrics.push(metricId);
        }
    };
    res.send({ status: true, failedMetrics});
});
export default router;