import axios from '../custom/axios';

export async function GetQuiz(skillId) {
    try {
        const response = await axios.get(`/quiz/${skillId}`);
        return response.data.data;
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function SubmitQuizResult(data) {
    try {
        const response = await axios.post(`/auth/quiz-Result`, data);
        return response.data;
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}