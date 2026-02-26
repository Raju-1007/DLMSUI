import axios from "axios";

export const LoginActivity = async (loginData, showSuccess, showError) => {



  const payLoad = {
    loginId: loginData?.userDetails?.loginid,
    role: loginData?.userDetails?.role,
    adhaar: loginData?.userDetails?.adhaarValue,
    name: loginData?.userDetails?.fullName,
    email: loginData?.userDetails?.email,
  };

  try {
    const res = await axios.post(
      import.meta.env.VITE_API_BASE_URL + "/login/login/loginActivty",
      payLoad
    );

    if (res?.data) {
      showSuccess("Login activity added");
    }

  } catch (e) {
    console.log("API Error:", e);
    showError("loginActivity Failed");
  }
};