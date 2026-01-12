import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUserThunk = createAsyncThunk(
  "auth/loginUserThunk",
  async (payload,{ rejectWithValue }) => {
    const res = await axios.post(
      import.meta.env.VITE_API_BASE_URL+"/api/roles/getloginData",
      payload
    );
    console.log(res,"=====================++++++++++++++++++")
     if (res.data.status === "error") {
        return rejectWithValue(res.data.message);
      }

    return res.data;
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

        // ✅ SAVE PERMANENTLY
        localStorage.setItem(
          "loginDetails",
          JSON.stringify(action.payload)
        );
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
       alert("LOGIN FAILED:", action.error);
      });
  },
});

export default authSlice.reducer;
