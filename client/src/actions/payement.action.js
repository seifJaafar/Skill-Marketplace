import axios from '../custom/axios';
import { toast } from "react-hot-toast";

export async function createPaymentIntent(data) {
    try {
        const response = await axios.post('/payment/create-payment-intent', data);
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
export async function requestRefund(data) {
    try {
        const response = await axios.post('/payment/refund', data);
        if (response.status === 200) {
            toast.success(response.data.message);
            return response.data.message
        } else {
            toast.error(response.data.error);
            return { error: response.data.error };
        }
    } catch (error) {
        console.error(error?.response);
        toast.error(error?.response?.data?.message);
        return { error: error?.response?.data?.error };
    }
}
export async function markJobAsPaid(data) {
    try {
        const response = await axios.post('/payment/mark-job-as-paid', data);
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
export async function markJobAsDone(data) {
    try {
        const response = await axios.post('/payment/mark-job-as-done', data);
        console.log(response)
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