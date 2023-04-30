<template>
    <div>
        <div class="container">
            <div>
                <h1>Metrics</h1>
                <div class="btn-group">
                    <button @click="fetchData">Fetch Metrics</button>
                    <button @click="sendData">Send Metrics</button>
                </div>
                <div v-if="loading">Loading...</div>
                <div v-if="sendingData">Sending metrics to databox...</div>
                </div>
                <div>
                <div v-if="!loading">
                    <h2>API 1 Metrics</h2>
                    <ul>
                    <li v-for="metric in newsMetrics" :key="metric.name">
                        {{ metric.name }}: {{ metric.value }}
                    </li>
                    </ul>
                </div>
                <div v-if="!loading">
                    <h2>API 2 Metrics</h2>
                    <ul>
                    <li v-for="metric in weatherMetrics" :key="metric.name">
                        {{ metric.name }}: {{ metric.value }}
                    </li>
                    </ul>
                </div>
            </div>
        </div>
        <h1 class="graphs-section">Metrics per day</h1>
        <div class="container">
            <div v-if="!loading">
                <h2>Weather Metrics Chart</h2>
                <canvas ref="chartWeather"></canvas>
            </div>
            <div v-if="!loading">
                <h2>News Metrics Chart</h2>
                <canvas ref="chartNews"></canvas>
            </div>
        </div>
    </div>
</template>
  
<script>  
import getMetrics from '../services/getMetrics';
import postMetrics from '../services/postMetrics';
import Chart from 'chart.js/auto';
import newsData from '../../public/data/newsMetrics.json';
import weatherData from '../../public/data/weatherMetrics.json';
import { useToast } from 'vue-toast-notification';

export default {
    data() {
      return {
        loading: false,
        sendingData: false,
        api1NewsMetrics: {},
        api2WeatherMetrics: {},
        newsMetrics: [],
        weatherMetrics: [],
        chartWeather: null,
        chartNews: null,
        newsData: [],
        weatherData: [],
      };
    },
    mounted() {
        this.weatherData = weatherData;
        this.newsData = newsData;
    },
    methods: {
        padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        },
        toastMessage(msg, type) {
            const $toast = useToast();
            $toast.open({
                message: msg,
                type: type,
            });
        },
        async sendData() {
            if (!this.api2Metrics || !this.api1Metrics) {
                this.toastMessage('Please fetch metrics first', 'warning');
                return;
            }
            this.sendingData = true;
            const responseWeather = await postMetrics.postWeatherMetrics(this.api2Metrics);
            const responseNews = await postMetrics.postWeatherMetrics(this.api1Metrics);
            this.sendingData = false;

            if (responseWeather.status && !responseWeather.failedMetrics.length && responseNews.status && !responseNews.failedMetrics.length) {
                this.toastMessage('Metrics sent successfully', 'success');
            } else {
                this.toastMessage('Error sending metrics', 'error');
            }
        },
        async fetchData() {
            const responseNews = await getMetrics.getNewsMetrics();
            const responseWeather = await getMetrics.getWeatherMetrics();

            if (responseWeather && responseNews) {
                this.toastMessage('Metrics fetched successfully', 'success');
            } else {
                this.toastMessage('Error fetching metrics', 'error');
            }
            this.api1Metrics = responseNews;
            this.api2Metrics = responseWeather;

            Object.keys(responseNews).forEach((key) => {
                this.newsMetrics.push({
                    name: key,
                    value: responseNews[key],
                });
            });

            Object.keys(responseWeather).forEach((key) => {
                this.weatherMetrics.push({
                    name: key,
                    value: responseWeather[key],
                });
            });
            this.renderWeatherChart(responseNews);
            this.renderNewsChart(responseWeather);
        },
        renderWeatherChart(currDayData) {
            if (this.chartWeather) {
                this.chartWeather.destroy();
            }
            let [data, labels] = [[], []];
            const now = new Date();
            const currentDate = `${now.getDate()}/${this.padTo2Digits(now.getMonth())}`
            const [dataPM10, dataOzone, dataDust, dataUV, dataCO] = [[], [], [], [], []];
            Object.keys(this.weatherData).forEach((data) => {
                labels.push(data.split('-')[1]);
                dataPM10.push(this.weatherData[data].pm10);
                dataOzone.push(this.weatherData[data].ozone);
                dataDust.push(this.weatherData[data].dust);
                dataUV.push(this.weatherData[data].uvIndex);
                dataCO.push(this.weatherData[data].carbonMonoxide);
            });

            labels.push(currentDate);
            dataPM10.push(currDayData.pm10);
            dataOzone.push(currDayData.ozone);
            dataDust.push(currDayData.dust);
            dataUV.push(currDayData.uvIndex);
            dataCO.push(currDayData.carbonMonoxide);

            data.push(
                {
                    label: 'API 1 Metric - PM10',
                    data: dataPM10,
                    borderColor: '#3e95cd',
                    fill: false,
                }, 
                {
                    label: 'API 1 Metric - Ozone',
                    data: dataOzone,
                    borderColor: '#8e5ea2',
                    fill: false,
                }, 
                {
                    label: 'API 1 Metric - Dust',
                    data: dataDust,
                    borderColor: '#3cba9f',
                    fill: false,
                }, 
                {
                    label: 'API 1 Metric - UV Index',
                    data: dataUV,
                    borderColor: '#e8c3b9',
                    fill: false,
                }, 
                {
                    label: 'API 1 Metric - Carbon Monoxide',
                    data: dataCO,
                    borderColor: '#c45850',
                    fill: false,
                }
            );

            this.chartWeather = new Chart(this.$refs.chartWeather, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: data,
                },
                options: {
                    responsive: true,
                },
            });
        },
        renderNewsChart(currDayData) {
            if (this.chartNews) {
                this.chartNews.destroy();
            }
            let [data, labels] = [[], []];
            const now = new Date();
            const currentDate = `${now.getDate()}/${this.padTo2Digits(now.getMonth())}`
            const [dataKeywordHits, dataNumOfPages, dataNumOfAuthors, dataTwitterAccounts, dataNumOfCountries] = [[], [], [], [], []];
            Object.keys(this.newsData).forEach((data) => {
                labels.push(data.split('-')[1]);
                dataKeywordHits.push(this.newsData[data].totalKeywordHits);
                dataNumOfPages.push(this.newsData[data].totalNumberOfPages);
                dataNumOfAuthors.push(this.newsData[data].numberOfAuthors);
                dataTwitterAccounts.push(this.newsData[data].numberOfTwitterAccounts);
                dataNumOfCountries.push(this.newsData[data].numberOfCountries);
            });

            labels.push(currentDate);
            dataKeywordHits.push(currDayData.totalKeywordHits);
            dataNumOfPages.push(currDayData.totalNumberOfPages);
            dataNumOfAuthors.push(currDayData.numberOfAuthors);
            dataTwitterAccounts.push(currDayData.numberOfTwitterAccounts);
            dataNumOfCountries.push(currDayData.numberOfCountries);

            data.push(
                {
                    label: 'API 2 Metric - Total Keywords Hits',
                    data: dataKeywordHits,
                    borderColor: '#3e95cd',
                    fill: false,
                }, 
                {
                    label: 'API 2 Metric - Total Number Of Pages',
                    data: dataNumOfPages,
                    borderColor: '#8e5ea2',
                    fill: false,
                }, 
                {
                    label: 'API 2 Metric - Number Of Authors',
                    data: dataNumOfAuthors,
                    borderColor: '#3cba9f',
                    fill: false,
                }, 
                {
                    label: 'API 2 Metric - Number Of Twitter Accounts',
                    data: dataTwitterAccounts,
                    borderColor: '#e8c3b9',
                    fill: false,
                }, 
                {
                    label: 'API 2 Metric - Number Of Countries',
                    data: dataNumOfCountries,
                    borderColor: '#c45850',
                    fill: false,
                }
            );

            this.chartNews = new Chart(this.$refs.chartNews, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: data,
                },
                options: {
                    responsive: true,
                },
            });
        },
    },
};
</script>
  
<style scoped>
    button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #0077cc;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        margin-bottom: 20px;
    }
    ul {
        list-style-type: none;
        padding: 10px;
        margin: 0;
        border: 1px solid #d3dce0;
        border-radius: 5px;
        }

    h2 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    li {
        margin-bottom: 10px;
    }
    .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    button {
        background-color: #0077cc;
        color: #fff;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
    }

    button:hover {
        background-color: #005ba8;
    }
    .graphs-section {
        margin-top: 50px;
    }
    .btn-group button {
        margin: 10px 10px;
    }
</style>
  