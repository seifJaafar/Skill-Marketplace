import axios from '../custom/axios';

export async function GetJobsByClient() {
    try {
        const response = await axios.get(`/job/byClient`);
        if (response.status === 200) {
            return response.data;

        } else {
            return { error: response.data.message };
        }
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function GetJobsByProvider() {
    try {
        const response = await axios.get(`/job/byProvider`);
        if (response.status === 200) {
            return response.data.jobs;

        } else {
            return { error: response.data.message };
        }
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}