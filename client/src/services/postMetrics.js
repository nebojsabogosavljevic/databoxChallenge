import axios from "axios";

export default {
  async postNewsMetrics(metricsObj) {
    const response = await axios.post("/news", metricsObj);
    console.log(response.data)
  },
  async postWeatherMetrics(metricsObj) {
    const response = await axios.post("/weather", metricsObj);
    console.log(response.data)
  },
}
  