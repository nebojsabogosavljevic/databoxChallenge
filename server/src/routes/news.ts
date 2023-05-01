import express from 'express';
import axios from 'axios';
import * as interf from '../interfaces';
import logger from '../modules/logger';
import { extractNewsMetricsBitNews, sendData } from '../modules/metricsFunctions';

const router = express.Router();

router.get('/', async (req, res) => {
    console.log("News route")
    const options = {
        method: 'GET',
        url: 'https://api.newscatcherapi.com/v2/search',
        params: {q: 'Bitcoin', sort_by: 'relevancy', page: '1'},
        headers: { 'X-Api-Key': process.env.NEWS_API_KEY },
    };
    try {
        const response = await axios.request(options);
        logger.info('Successfully fetched data from News API');
        const bitcoinNewsMetrics = extractNewsMetricsBitNews(response.data);
        res.send(bitcoinNewsMetrics);
    } catch (error: any) {
        logger.error('Error while fetching data from News API', { RespErrMsg: error.message, success: false });
        return error;
    }
});

router.post('/', async (req, res) => {
    const newsData = req.body;

    for (const [metricId, metricValue] of Object.entries(newsData)) {
        const metricValueNum = Number(metricValue);
        await sendData(metricId, metricValueNum, 'news');
    };
    res.send("Hello from backend");
});

export default router;