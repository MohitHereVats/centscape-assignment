import axios from "axios";

// IMPORTANT: Replace with your actual server IP/domain.
// For Expo Go on a real device, use your computer's local network IP.
// For simulators, `localhost` usually works.
const API_BASE_URL = 'http://localhost:3001';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getPreview = async (url: string) => {
    try {
        const response = await apiClient.post("/preview", { url });
        return response?.data;
    } catch(error) {
       console.log("Error: ", error);
    }
}