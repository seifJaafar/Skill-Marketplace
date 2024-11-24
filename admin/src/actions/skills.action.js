import axios from '../custom/axios';
import { toast } from 'react-hot-toast';
export async function GetSkills() {
    try {
        const response = await axios.get(`/skill`);
        return response.data.data.skills;
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function updateSkill(id, data) {
    try {
        const response = await axios.patch(`/skill/${id}`, data);
        if (response.status === 200) {
            toast.success("Skill Updated", {});
            return response.data.data.skill;
        } else {
            toast.error(response?.message)
            return { error: response?.message };
        }

    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function deleteSkill(id) {
    try {
        const response = await axios.delete(`/skill/${id}`);
        if (response.status === 200) {
            toast.success("Skill Deleted", {});
            return response.data.data.skill;
        } else {
            toast.error(response?.message)
            return { error: response?.message };
        }

    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function addSkill(data) {
    try {
        const response = await axios.post(`/skill`, data);
        if (response.status === 200) {
            toast.success("Skill Added", {});
            return response.data.data.skill;
        } else {
            toast.error(response?.message)
            return { error: response?.message };
        }

    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}