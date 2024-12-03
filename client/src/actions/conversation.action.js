import axios from '../custom/axios';

export async function GetConversations() {
    try {
        const response = await axios.get(`/conversation/byUser`);
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
export async function CreateConversation(providerId) {
    try {
        const response = await axios.post('/conversation', { providerId });
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