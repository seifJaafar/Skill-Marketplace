
import axios from '../custom/axios';
import { toast } from 'react-hot-toast';
export async function GetSkillPosts() {
    try {
        const response = await axios.get(`/skillpost`);
        if (response.status === 200) {
            return response.data.data;
        } else {
            toast.error(response?.message);
            return { error: response?.message };
        }
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function LinkSkillPost(id, data) {
    try {
        const response = await axios.patch(`/skillpost/${id}/link`, data);
        if (response.status === 200) {
            toast.success("Skill Post linked successfully", {});
            return { message: "Skill Post linked successfully" };
        } else {
            toast.error(response?.data?.message);
            return { error: response?.message };
        }
    } catch (error) {
        toast.error(error?.response?.data?.message);
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function UpdateSkillPost(id, data) {
    try {
        const response = await axios.patch(`/skillpost/${id}`, data);
        if (response.status === 200) {
            toast.success("Skill Post updated successfully", {});
            return { message: "Skill Post updated successfully" };
        } else {
            toast.error(response?.data?.message);
            return { error: response?.message };
        }
    } catch (error) {
        toast.error(error?.response?.data?.message);
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function DeleteSkillPost(id) {
    try {
        const response = await axios.delete(`/skillpost/${id}`);
        if (response.status === 200) {
            toast.success("Skill Post deleted successfully", {});
            return response.data.data;
        } else {
            toast.error(response?.message);
            return { error: response?.message };
        }
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function GetSkillPostById(id) {
    try {
        const response = await axios.get(`/skillpost/${id}`);
        if (response.status === 200) {
            return response.data.data;
        } else {
            toast.error(response?.message);
            return { error: response?.message };
        }
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function GetSkillPostsByUser() {
    try {
        const response = await axios.get(`/skillpost/user`);
        if (response.status === 200) {
            return response.data.data;

        } else {
            toast.error(response?.message);
            return { error: response?.message };
        }
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}
export async function PostSkillPost(data) {
    try {
        const response = await axios.post(`/skillpost`, data);
        if (response.status === 200) {
            toast.success("Skill Post added successfully", {});
            return response.data.skillPost;
        } else {
            toast.error(response?.message);
            return { error: response?.message };
        }
    } catch (error) {
        console.error(error?.response);
        return { error: error?.response?.data?.message };
    }
}