
import axios from 'axios';
export const fetchHtml = async (url: string): Promise<string> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching the URL: ${url}`);
    }
}