import axios from '../custom/axios';

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