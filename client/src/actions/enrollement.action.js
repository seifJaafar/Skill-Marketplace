import toast from 'react-hot-toast';
import axios from '../custom/axios';

export async function GetEnrollments() {
    try {
        const response = await axios.get('/enrollement');
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
export async function verifyEnrollment(courseId) {
    try {
        const response = await axios.get(`/enrollement/verify/${courseId}`);
        console.log(response);
        if (response.status === 200) {
            return response.data.Enrolled;
        }
        return false;
    } catch (err) {
        console.error(err?.response);
        return false
    }
}