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


export const  getStudentUpdatePropfileDetails = async (loginData, showSuccess, showError) => {

  try {
    const res = await axios.get(
      import.meta.env.VITE_API_BASE_URL + "/login/login/getUpdateProfileDetails",
        {
          params:{
              Studentid: loginData?.userDetails?.loginid
          }
        }
    );
    

    if (res?.data) {
      return res.data; // Return the data to be used in the component
      showSuccess("Successfully fetched details");
    }

  } catch (e) {
    console.log("API Error:", e);
    showError("Failed to fetch  Student profile details");
  }
};


export const  getDepartmentUpdatePropfileDetails = async (loginData, showSuccess, showError) => {
  

  try {
    const res = await axios.get(
      import.meta.env.VITE_API_BASE_URL + "/login/login/getdepartmentUpdateDetails",
        {
          params:{
              teacherId: loginData?.userDetails?.loginid
          }
        }
    );

  

    if (res?.data) {
      return res.data; // Return the data to be used in the component
      showSuccess("Successfully fetched details");
    }

  } catch (e) {
    console.log("API Error:", e);
    showError("Failed to fetch Teacher profile details");
  }
};



