import axios from '../custom/axios';
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
    const response = await axios.get(`/auth/users`);
    return response.data.data.users;
  } catch (error) {
    console.error(error?.response);
    return { error: error?.response?.data?.message };
  }
}
export async function RegisterUser(Newuser,) {
  try {
    const response = await axios.post(`/auth/register`, Newuser);
    if (response.status === 200) {
      if (response.data.data.user.role === "skillprovider") {
        toast.success("please pass the quizes !", {});

        return { user: response.data.data.user };
      } else {
        toast.success("Please wait for approval !", {});

        return { user: response.data.data.user };
      }
    } else {
      toast.error(response?.message);
    }
  } catch (err) {
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
    if (new_user && new_user?.role === "admin") {
      toast.error(`Cher Admin svp connectez-vous à la page Admin ou utiliser un autre compte non admin`);
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