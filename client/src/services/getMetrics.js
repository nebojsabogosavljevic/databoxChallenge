import axios from "axios";

export default {
  async getNewsMetrics() {
    const response = await axios.get("/news");
    return response.data;
  },
  async getWeatherMetrics() {
    const response = await axios.get("/weather");
    return response.data;
  },
}
  