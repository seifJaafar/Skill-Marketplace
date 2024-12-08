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

export async function UpdatePass(user) {
  try {
    const response = await axios.patch(`/auth/updatePassword`, user);
    if (response.status === 200) {
      toast.success("Password Updated", {});
      return { user: response.data.data.user };
    } else {
      toast.error(response?.error);
    }
  } catch (err) {
    if (err?.response) {
      toast.error(err?.response?.data.error);
    }
    return { error: err?.response?.data?.message };
  }
}
export async function UpdatePendingSkills(user) {
  try {
    const response = await axios.patch(`/auth/updatePendingSkills`, user);
    if (response.status === 200) {
      toast.success("Skills Updated", {});
      return { user: response.data.data.user };
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
export async function UpdateUser(user) {
  try {
    const response = await axios.patch(`/auth/updateAccount`, user, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    if (response.status === 200) {
      toast.success("Account Updated", {});
      return { user: response.data.data.user };
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
export async function GetAllUsers(query) {
  try {
    const response = await axios.get(`/auth/users`, { params: { query } });
    return response.data.data.users;
  } catch (error) {
    console.error(error?.response);
    return { error: error?.response?.data?.message };
  }
}
export async function RegisterUser(Newuser,redirect) {
  try {
    const response = await axios.post(`/auth/register`, Newuser);
    if (response.status === 200) {
      if (response.data.data.user.role === "skillprovider") {
        toast.success("please pass the quizes !", {});

        return { user: response.data.data.user };
      } else {
        if (response.data.data.user.role === "skillexpert") {
          toast.success("Please wait for approval !", {});
        } else if (response.data.data.user.role === "client") {
          toast.success("Welcome !", {});
          redirect();
        }


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
export async function connectStripeAccount() {
  try {
    const response = await axios.post(`/auth/connectStripe`);
    if (response.data?.url) {
      window.location.href = response.data.url; // Redirect the user to the Stripe onboarding URL
    } else {
      console.error('No URL provided in response');
    }
  } catch (error) {
    console.error(error?.response);
    return { error: error?.response?.data?.message };
  }
}
export async function getUserById(id) {
  try {
    const response = await axios.get(`/auth/${id}`);
    console.log(response.data.data.user);
    return response.data.data.user;
  } catch (error) {
    console.error(error?.response);
    return { error: error?.response?.data?.message };
  }
}