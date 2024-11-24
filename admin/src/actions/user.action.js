import axios from '../custom/axios'
import { toast } from 'react-hot-toast';


export async function GetUserByToken() {
  try {
    const response = await axios.get(`/auth/bytoken`);
    const user = response.data.user
    return {
      is_connected: true,
      Backuser: user,
    };
  } catch (error) {
    console.error(error?.response);
    return { error: error?.response?.data?.message };
  }
}
export async function GetAllUsers() {
  try {
    const response = await axios.get(`/auth`);
    const usersBack = response.data.data.users;
    return {
      usersBack,
    };
  } catch (error) {
    console.error(error?.response);
    return { error: error?.response?.data?.message };
  }

}
export async function DeleteUser(id) {
  try {
    const response = await axios.delete(`/auth/${id}`);
    if (response.status === 200) {
      toast.success("User Deleted", {});
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
export async function LoginUser(user, callback) {
  try {
    const response = await axios.post(`/auth/login`, user);
    const new_user = response?.data?.data?.user;
    const token = response?.data?.data?.accessToken;
    if (new_user && !new_user?.approved) {
      toast.error(`your account is not approved yet, please wait for approval !`);
      return false;
    }
    if (new_user && new_user?.role !== "admin") {
      toast.error(`you are not an admin !`);
      return false;
    }
    localStorage.setItem("accessToken", token);
    window.location.reload();
    toast.success(`Welcome ${new_user.username} `, {});
    callback();
  } catch (error) {
    console.error(error?.response);
    toast.error(error?.response?.data?.message);
    return { error: error?.response?.data?.message };
  }
};
export async function ResetPass(email, callback) {
  try {
    const response = await axios.post(`/auth/resetpassword`, email);
    if (response.status === 200) {
      toast.success("Svp Verifiez votre Email", {});
      callback();
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
export async function UpdateUser(id, user) {
  try {
    const response = await axios.patch(`/auth/${id}`, user);
    if (response.status === 200) {
      toast.success("Profile Updated", {});
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
export async function RegisterUser(user) {
  try {
    const response = await axios.post(`/auth/addUser`, user);
    if (response.status === 200) {
      toast.success("User Added", {});
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