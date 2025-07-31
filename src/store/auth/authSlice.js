import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../services/http/baseUrl";
import {  showToast } from "../../services/toast/ToastCenterPopup";

export const checkUser = createAsyncThunk(
    "auth/checkUser",
    async (data, { dispatch }) => {
        try {
            const response = await http.post("/user/check-user", {
                phone: data.mobile,
            });

            if (response.status === 201) {
                return response.data;
            }
        } catch (error) {
            return error.response.data;

            // dispatch(handlecloseLoader(false)),
            //     showToast({ type: "error", message: error.response.data.message });
        }
    }
);
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (data, { dispatch }) => {
        try {
            const response = await http.post("/user/register", {
                phone: data.mobile,
                full_name: data.fullName,
                pin: data.pin,
                confirmPin: data.confirmPin,
            });

            if (response.status === 201) {
                return response.data;
            }
        } catch (error) {
            console.log("Error in registerUser:", error);
            showToast({ type: "error", message: error.response.data.message });
            return error.response.data;


        }
    }
);
export const signInUser = createAsyncThunk(
    "auth/signInUser",
    async (data, { dispatch }) => {
        try {
            const response = await http.post("/user/login", {
                phone: data.mobile,
                pin: data.pin,

            });

            if (response.status === 201) {
                return response.data;
            }
        } catch (error) {
            console.log("Error in loginUser:", error);
            showToast({ type: "error", message: error.response.data.message });
            return error.response.data;

          

        }
    }
);

export const handlecloseLoader = createAsyncThunk(
    "auth/handlecloseLoader",
    async (value) => {
        return value;
    }
);







const authSlice = createSlice({
    name: "auth",
    initialState: {
        data: {
            userData: null,
            token: null,
            message: null,
        },
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // check user
            .addCase(checkUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(checkUser.fulfilled, (state, action) => {
                if (action.payload.statusCode === 404) {
                    state.data.message = action.payload.message;
                }
                state.data.userData = action.payload.data;
                state.loading = false;
            })
            .addCase(checkUser.rejected, (state, action) => {
                state.loading = false;
            })
            // register user
            .addCase(registerUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                if (action.payload.statusCode === 404) {
                    state.data.message = action.payload.message;
                }
                localStorage.setItem("token", action.payload.data.access_token);
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
            })
            // lohin user
            .addCase(signInUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                if (action.payload.statusCode === 404) {
                    state.data.message = action.payload.message;
                }
                if( action.payload.success ) {
                localStorage.setItem("token", action.payload.data.access_token);
                state.loading = false;
                }
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.loading = false;
            })
            //close Loader
            .addCase(handlecloseLoader.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(handlecloseLoader.fulfilled, (state, action) => {
                state.loading = action.payload;
            })
            .addCase(handlecloseLoader.rejected, (state, action) => {
                state.loading = false;
            })
    },
});
export default authSlice.reducer;
