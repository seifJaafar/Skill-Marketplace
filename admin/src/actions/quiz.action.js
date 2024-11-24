import axios from '../custom/axios';
import { toast } from 'react-hot-toast';

export async function GetQuizzes() {
    try {
        const response = await axios.get(`/quiz`);
        return response.data.data.quizzes;
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}

export async function updateQuiz(quizId, data) {
    try {
        const response = await axios.patch(`/quiz/update/${quizId}`, data)
        if (response.status === 200) {
            toast.success("Quiz Updated", {});
            return true;
        } else {
            toast.error(response?.message);
        }
    } catch (err) {
        console.error(err?.response);
        if (err?.response) {
            toast.error(err?.response?.data.message);
        }
        return { error: err?.response?.data?.message };
    }
}
export async function addQuiz(data) {
    try {
        const response = await axios.post('/quiz', data)
        if (response.status === 200) {
            toast.success("Quiz Added", {})
            return true;
        } else {
            toast.error(response?.message)
        }

    } catch (err) {
        console.error(err?.response);
        if (err?.response) {
            toast.error(err?.response?.data.message);
        }
        return { error: err?.response?.data?.message };
    }
}
export async function updateQuestion(questionId, data) {
    try {
        const response = await axios.patch(`/quiz/question/${questionId}`, data)
        if (response.status === 200) {
            toast.success("Question Updated", {});
            return true;
        } else {
            toast.error(response?.message);
        }
    } catch (err) {
        console.error(err?.response);
        if (err?.response) {
            toast.error(err?.response?.data.message);
        }
        return { error: err?.response?.data?.message };
    }
}
export async function DeleteQuiz(id) {
    try {
        const response = await axios.delete(`/quiz/update/${id}`);
        if (response.status === 200) {
            toast.success("Quiz Deleted", {});
            return true;
        } else {
            toast.error(response?.message)
            return { error: response?.message };
        }

    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function addQuestionToQuiz(data) {
    try {
        console.log(data);
        const response = await axios.post('/quiz/addQuestion',data);
        if (response.status === 200) {
            toast.success("Question Added", {});
            return true;
        } else {
            toast.error(response?.message);
        }
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function DeleteQuestion(id) {
    try {
        const response = await axios.delete(`/quiz/question/${id}`);
        if (response.status === 200) {
            toast.success("Question Deleted", {});
            return true;
        } else {
            toast.error(response?.message)
            return { error: response?.message };
        }

    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}