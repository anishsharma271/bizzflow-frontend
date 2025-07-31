import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../services/http/baseUrl";
import { showToast } from "../../services/toast/ToastCenterPopup";

export const getCustomerData = createAsyncThunk(
    "auth/getCustomerData",
    async (data, { dispatch }) => {
        try {
            const response = await http.get("/customer/getcustomerofowner");

            if (response.status === 201) {
                return response.data;
            }
        } catch (error) {
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







const dashboardSlice = createSlice({
    name: "auth",
    initialState: {
        data: {
            customerData: null,
            message: null,
        },
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            //get customer data
            .addCase(getCustomerData.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getCustomerData.fulfilled, (state, action) => {
                console.log(`Response from getCustomerData fulfilled:`, action.payload);
                if (action.payload.statusCode === 404) {
                    state.data.message = action.payload.message;
                }
                state.loading = false;
            })
            .addCase(getCustomerData.rejected, (state, action) => {
                state.loading = false;
            })
    },
});
export default dashboardSlice.reducer;
