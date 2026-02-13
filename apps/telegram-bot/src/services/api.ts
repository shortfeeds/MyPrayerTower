import axios from "axios";
import "dotenv/config";

const API_Base_URL = process.env.API_URL || "https://myprayertower.com/api";

export const getDailyReading = async () => {
    try {
        const response = await axios.get(`${API_Base_URL}/liturgical/today`);
        return response.data;
    } catch (error) {
        console.error("Error fetching daily reading:", error);
        return null;
    }
};

export const getSaintOfTheDay = async () => {
    try {
        const response = await axios.get(`${API_Base_URL}/saints/today`);
        return response.data;
    } catch (error) {
        console.error("Error fetching saint of the day:", error);
        return null;
    }
}
