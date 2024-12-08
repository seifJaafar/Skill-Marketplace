import toast from 'react-hot-toast';
import axios from '../custom/axios';

export async function GetCourses() {
    try {
        const response = await axios.get('/courses');
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
export async function AddNewCourse(course) {
    try {
        const response = await axios.post('/courses', course);
        if (response.status === 200) {
            toast.success('Course added successfully.');
            return response;
        } else {
            toast.error('An error occurred while adding the course.');
            return { error: response.data.message };
        }
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return { error: error?.response?.data?.message };
    }
}
export async function GetCourseById(id) {
    try {
        const response = await axios.get(`/courses/${id}`);
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
export async function UpdateCourse(id, course) {
    try {
        const response = await axios.patch(`/courses/${id}`, course);
        if (response.status === 200) {
            toast.success('Course updated successfully.');
            return response;
        } else {
            toast.error('An error occurred while updating the course.');
            return { error: response.data.message };
        }
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return { error: error?.response?.data?.message };
    }
}
export async function DeleteCourse(id) {
    try {
        const response = await axios.delete(`/courses/${id}`);
        if (response.status === 200) {
            toast.success('Course deleted successfully.');
            return response;
        } else {
            toast.error('An error occurred while deleting the course.');
            return { error: response.data.message };
        }
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return { error: error?.response?.data?.message };
    }
}
export async function UpdateChapter(id, chapter) {
    try {
        const response = await axios.patch(`/courses/updateChapter/${id}`, chapter, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        if (response.status === 200) {
            toast.success('Chapter updated successfully.');
            return response;
        } else {
            toast.error('An error occurred while updating the chapter.');
            return { error: response.data.message };
        }
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return { error: error?.response?.data?.message };
    }
}
export async function AddChapterCourse(id, chapter) {
    try {
        const response = await axios.post(`/courses/addChapter/${id}`, chapter, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        if (response.status === 200) {
            toast.success('Chapter added successfully.');
            return response;
        } else {
            toast.error('An error occurred while adding the chapter.');
            return { error: response.data.message };
        }
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return { error: error?.response?.data?.message };
    }
}
export async function GetChaptersByCourse(id) {
    try {
        const response = await axios.get(`/courses/getChapters/${id}`);
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
export async function DeleteChapter(id, data) {
    try {
        const response = await axios.delete(`/courses/updateChapter/${id}`, { params: data });
        if (response.status === 200) {
            toast.success('Chapter deleted successfully.');
            return response;
        } else {
            toast.error('An error occurred while deleting the chapter.');
            return { error: response.data.message };
        }
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return { error: error?.response?.data?.message };
    }
}
export async function UpdateFile(id, file) {
    try {
        const response = await axios.patch(`/courses/updateFile/${id}`, file);
        if (response.status === 200) {
            toast.success('File updated successfully.');
            return response;
        } else {
            toast.error('An error occurred while updating the file.');
            return { error: response.data.message };
        }
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return { error: error?.response?.data?.message };
    }
}
export async function DeleteFile(id, data) {
    try {
        const response = await axios.delete(`/courses/updateFile/${id}`, { params: data });
        if (response.status === 200) {
            toast.success('File deleted successfully.');
            return response;
        } else {
            toast.error('An error occurred while deleting the file.');
            return { error: response.data.message };
        }
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return { error: error?.response?.data?.message };
    }
}