import axios from "axios";
import get from "lodash/get";




const PUBLIC_APIS = [
  "/login/getloginData",
  "/login/addloginData",
  "/login/getRoles",
  "/login/generate",
  "/login/forgot-password",

];

axios.interceptors.request.use(

  (config) => {
    if (PUBLIC_APIS.some(url => config.url?.includes(url))) {
      return config;
    }
    const login = JSON.parse(localStorage.getItem("loginDetails"));
    try {
      const parsedData = login.userDetails;
      if (parsedData?.token) {
        config.headers.Authorization = `Bearer ${parsedData.token}`;
      }

      // Handle multipart upload globally 
      if (config.url?.includes("documents/uplods")) {
        config.headers["Content-Type"] = "multipart/form-data";
      }
    } catch { }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

axios.interceptors.response.use(
  (response) => {

    return response;
  },
  async (error) => {

    console.log("Complete Error:", error);

    console.log("Message:", error.message);

    console.log("Code:", error.code);

    console.log("Response:", error.response);

    console.log("Status:", error.response?.status);
    console.log("comfig:", error.config);




    const originalConfig = error.config;

    console.log("isAxiosError:", axios.isAxiosError(error));
    console.log("error:", error);
    console.log("request:", error.request);
    console.log("response:", error.response);
    console.log("status:", error.response?.status);

    

    if (error.response?.status === 401 && !originalConfig?._retry && !PUBLIC_APIS.some(url => originalConfig.url?.includes(url))) {
      originalConfig._retry = true;

      try {
        const parsedData = JSON.parse(localStorage.getItem("loginDetails"));

        if (!parsedData.userDetails?.token) {
          throw new Error("No token");
        }



        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/login/refresh`,
          {},
          {
            withCredentials: true
          }
        );

        const newToken = res?.data?.accessToken;

        if (newToken) {
          console.log("newtoken calleddddddddddddddddddddd", newToken);
          parsedData.userDetails.token = newToken;
          localStorage.setItem(
            "loginDetails",
            JSON.stringify(parsedData)
          );

          originalConfig.headers.Authorization =
            `Bearer ${newToken}`;

          return axios(originalConfig);
        }

        throw new Error("Refresh  token failed");

      } catch (err) {
          console.log("catch block called when in authInterceptor:::::::::::::::::::::::::::::::::::::::::::::::");
        localStorage.clear();
        showError("Session expired. Please login again.");
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

