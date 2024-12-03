import axios from '../custom/axios';

export async function GetMessagesByConversations(conversationId) {
    try {
        const response = await axios.get(`/message/${conversationId}/messages`);
        if (response.status === 200) {
            return response.data.messages;

        } else {
            return { error: response.data.message };
        }
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function SendMessage(message) {
    try {
        const response = await axios.post('/message', message);

        if (response.status === 201) {

            return response.data;
        } else {
            return { error: response.data.message };
        }
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function GetLastMessageByConversation(conversationId) {
    try {
        const response = await axios.get(`/message/${conversationId}/last-message`);
        if (response.status === 200) {
            return response.data.message;
        } else {
            return { error: response.data.message };
        }
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}