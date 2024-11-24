import axios from '../custom/axios';

export async function GetSkills() {
    try {
        const response = await axios.get(`/skill`);
        return response.data.data.skills;
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}