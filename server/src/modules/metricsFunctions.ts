import axios from 'axios';
import dotenv from 'dotenv';
import { resolve } from 'path'
import * as interf from '../../types/interfaces'
import { connectToDatabase } from '../services/database.service';
import logger from '../modules/logger';
import { DateTime } from 'luxon';

async function getBitcoinArticlesMetrics(): Promise<interf.ArticleResponse> {
    const options = {
        method: 'GET',
        url: 'https://api.newscatcherapi.com/v2/search',
        params: {q: 'Bitcoin', sort_by: 'relevancy', page: '1'},
        headers: { 'X-Api-Key': process.env.NEWS_API_KEY },
    };
    try {
        const response = await axios.request(options);
        logger.info('Successfully fetched data from News API');
        return response.data;
    } catch (error: any) {
        logger.error('Error while fetching data from News API', { RespErrMsg: error.message, success: false });
        return error;
    }
}

/**
 * @param data - raw data that we have received from API
 * @returns metrics - object with defined metrics by @interface NewsMetric
 * @description - this function extracts metrics from data that we have received
 * from API about news where Bitcoin has been mensioned, and returns object with suitable metrics
 */
function extractNewsMetricsBitNews(data: interf.ArticleResponse): Object {
    const extractedDate = data.articles.map((article: any) => {
        return {
            author: article.author,
            topic: article.topic,
            country: article.country,
            language: article.language,
            twitterAccount: article.twitter_account,
            multiAuthors: article.authors,
        }
    });
    const [numberOfAuthors, numberOfTwitterAccounts, numberOfCountries] = extractedDate.reduce((acc: number[], curr: any) => {
        if (curr.multiAuthors) {
            acc[0] += curr.multiAuthors.length;
        }
        if (curr.twitterAccount) {
            acc[1] += 1;
        }
        if (curr.country) {
            acc[2] += 1;
        }
        return acc;
    }, [0, 0, 0, 0]);

    const metrics: interf.NewsMetric = {
        totalKeywordHits: data.total_hits,
        totalNumberOfPages: data.total_pages,
        numberOfAuthors,
        numberOfTwitterAccounts,
        numberOfCountries,
    }
    return metrics;
}


async function getAirQualityMetrics(): Promise<interf.AirQualityResponse> {
    const options = {
        method: 'GET',
        url: 'https://air-quality-api.open-meteo.com/v1/air-quality',
        params: { latitude: '46.52', longitude: '16.43', hourly: 'pm10,carbon_monoxide,ozone,dust,uv_index' },
    };
    try {
        const response = await axios.request(options);
        logger.info('Successfully fetched data from Air Quality API');
        return response.data;
    } catch (error: any) {
        logger.error('Error while fetching data from Air Quality API', { RespErrMsg: error.message, success: false });
        return error;
    }
}

/**
 * @param data - raw data that we have received from API
 * @returns metrics - object with defined metrics by @interface AirQualityMetric
 * @description - this function extracts metrics and calculate avarage values for current day
 * API returns hourly data for first 4 days from today, that's why we pick only first 24 values
 */
function extractDailyAQMetrics(data: interf.AirQualityResponse): Object {
    const pm10= data.hourly.pm10.slice(0, 24).reduce((acc: any, curr: any) => acc + curr, 0) / 24;
    const carbonMonoxide = data.hourly.carbon_monoxide.slice(0, 24).reduce((acc: any, curr: any) => acc + curr, 0) / 24;
    const ozone = data.hourly.ozone.slice(0, 24).reduce((acc: any, curr: any) => acc + curr, 0) / 24;
    const dust = data.hourly.dust.slice(0, 24).reduce((acc: any, curr: any) => acc + curr, 0) / 24;
    const uvIndex = data.hourly.uv_index.slice(0, 24).reduce((acc: any, curr: any) => acc + curr, 0) / 24;

    const metrics: interf.AirQualityMetric = {
        pm10,
        carbonMonoxide,
        ozone,
        dust,
        uvIndex,
    }
    return metrics;
}

/**
 * 
 * @param metricId 
 * @param metricValue 
 * @param metricLibrary - Pass parameters: news or weather 
 * @returns 
 */
async function sendData(metricId: string, metricValue: number, metricLibrary: string) {
    const username = metricLibrary === 'news' ? process.env.NEWS_METRICS_LIBRARY_TOKEN || '' : process.env.WEATHER_METRICS_LIBRARY_TOKEN || '';
    console.log(metricId, metricValue, metricLibrary, username)
    
    const config = {
        method: 'POST',
        url: 'https://push.databox.com',
        headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/vnd.databox.v2+json', 
        },
        auth: {
            username: username,
            password: ''
        },
        data : JSON.stringify({
            "data": [
                {
                    [`$${metricId}`]: metricValue
                }
            ]
        })
    };
    try {
        const response = await axios.request(config);
        const status = response.data.status === 'OK' ? true : false;
        if (status) {
            logger.info('Successfully sent data to Databox', { success: true, metricSent: metricId });
        } else {
            logger.error('Error while sending data to Databox, request status false', { success: false, metricSent: metricId });
        }
    } catch (error: any) {
        logger.error('Request failed while sending data to Databox', { RespErrMsg: error.message, success: false });
        return error;
    }
    
}

export {
    getBitcoinArticlesMetrics,
    extractNewsMetricsBitNews,
    getAirQualityMetrics,
    extractDailyAQMetrics,
    sendData,
}