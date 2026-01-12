import axios from "axios";
import get from "lodash/get";


/* ================= REQUEST INTERCEPTOR ================= */

axios.interceptors.request.use(

  (config) => {
    const login = JSON.parse(localStorage.getItem("loginDetails"));
    try {
      const parsedData = login;
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
    console.log("inside response");
    return response;
  },
  async (error) => {
    console.log(error, "::::::::::::::inside error");

    const originalConfig = error.config;
    console.log(originalConfig, ":::::::::::::::::originalConfig")

    if (error.response?.status === 401 && !originalConfig?._retry) {
      originalConfig._retry = true;

      try {
        const parsedData = JSON.parse(localStorage.getItem("loginDetails"));

        console.log(parsedData, ":::::::: parsedData ::::::::");

        if (!parsedData?.token) throw new Error("No token");

        const rs = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/roles/token`
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

        throw new Error("Refresh failed");

      } catch (err) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

