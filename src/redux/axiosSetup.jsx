import axios from "axios";
import get from "lodash/get";


/* ================= REQUEST INTERCEPTOR ================= */

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
   

    const originalConfig = error.config;
     console.log(error, "::::::::::::::inside error");
    
    

    if (error.response?.status === 401 && !originalConfig?._retry &&!PUBLIC_APIS.some(url => originalRequest.url?.includes(url)) ){
      originalConfig._retry = true;

      try {
        const parsedData = JSON.parse(localStorage.getItem("loginDetails"));

        console.log(parsedData, "::::::::::::::::::::::::: parsedData ::::::::");

        if (!parsedData.userDetails?.token) throw new Error("No token");

        // 🔄 Call refresh token API
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/login/refresh`,
          {
            headers: {
              Authorization: `Bearer ${parsedData.token}`
            }
          }
        );

        const newToken = rs?.data?.data?.token;

        if (newToken) {
          parsedData.token = newToken;
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
        localStorage.clear();
         alert("Session expired. Please login again.");
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

