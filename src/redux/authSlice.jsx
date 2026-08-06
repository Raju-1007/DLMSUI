import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useMessage } from "../context/MessageContext";



export const loginUserThunk = createAsyncThunk(
  "auth/loginUserThunk",
  async (payload, { rejectWithValue }) => {

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/login/getloginData",
        payload,
        {
        withCredentials: true
    }

      );
      if (res.data.status === "error" || (res?.data?.message && res.data.message.includes("Invalid Password"))
      ) {
        return rejectWithValue(res.data.message);
      }
      localStorage.setItem("loginDetails", JSON.stringify(res.data));

      return res.data;
    }
    catch (err) {
      return rejectWithValue(err.response?.data?.message || "Server Error");
    }
  }
);

// SAFE localStorage read
const savedLogin = JSON.parse(localStorage.getItem("loginDetails"));


const authSlice = createSlice({

  name: "auth",
  initialState: {
    user: savedLogin || null,
    role: savedLogin?.role || null,
    loginId: savedLogin?.loginId || null,
    adhaar: savedLogin?.adhaar || null,
    token: savedLogin?.token || null,
    loading: false
  },


  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ API RESPONSE HERE
        state.user = action.payload;
        state.role = action.payload.role;
        state.loginId = action.payload.loginId;
        state.adhaar = action.payload.adhaar;
        state.token = action.payload.token;

        // ✅ SAVE PERMANENTLY
        localStorage.setItem(
          "loginDetails",
          JSON.stringify(action.payload)
        );
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
