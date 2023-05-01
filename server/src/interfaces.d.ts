export interface Options {
    method: string,
    url: string,
    data?: any,
    params?: {
        q: string,
        lang?: string,
        sort_by: string,
        page?: string
    },
    headers?: Object,
    auth?: {
        username: string,
        password?: string
    }
}

interface ArticleResponse {
    status: string,
    total_hits: number,
    page: number,
    total_pages: number,
    page_size: number,
    articles: Array<any>,
}

interface NewsMetric {
    totalKeywordHits: number,
    totalNumberOfPages: number,
    numberOfAuthors: number,
    numberOfTwitterAccounts: number,
    numberOfCountries: number,
    [key: string]: number,
}


interface AirQualityResponse {
    latitude: number,
    longitude: number,
    generationtime_ms: number,
    utc_offset_seconds: number,
    timezone: string,
    timezone_abbreviation: string,
    hourly_units: Object,
    hourly: AirQualityMetricHourly,
}

interface AirQualityMetricHourly {
    pm10: Array<number>,
    carbonMonoxide: Array<number>,
    ozone: Array<number>,
    dust: Array<number>,
    uvIndex: Array<number>,
    [key: string]: Array<number>,
}

interface AirQualityMetric {
    pm10: number,
    carbonMonoxide: number,
    ozone: number,
    dust: number,
    uvIndex: number,
    [key: string]: number,
}
