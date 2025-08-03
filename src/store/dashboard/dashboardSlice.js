import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../../services/http/baseUrl";
import { showToast } from "../../services/toast/ToastCenterPopup";

export const getCustomerData = createAsyncThunk(
    "auth/getCustomerData",
    async ({ page = 1, limit = 10 }, { dispatch }) => {
        try {
            const response = await http.get(`/transactions/summary?page=${page}&limit=${limit}`);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            showToast({ type: "error", message: error.response.data.message });
            return error.response.data;


        }
    }
);

export const getCustomerTransactionHistory = createAsyncThunk(
    "auth/getCustomerTransactionHistory",
    async ({ page = 1, limit = 10, customer_id }, { dispatch }) => {
        try {
            const response = await http.get(`/transactions/${customer_id}?page=${page}&limit=${limit}`);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            showToast({ type: "error", message: error.response.data.message });
            return error.response.data;


        }
    }
);

export const createCustomer = createAsyncThunk(
    "auth/createCustomer",
    async (data, { dispatch }) => {
        try {
            const response = await http.post("/customer/create", data);

            if (response.status === 201) {
                showToast({ type: "success", message: response.data.msg });
                await dispatch(getCustomerData());
                return response.data;
            }
        } catch (error) {
            showToast({ type: "error", message: error.response.data.message });
            return error.response.data;


        }
    }
);
export const createTransaction = createAsyncThunk(
    "auth/createTransaction",
    async (data, { dispatch }) => {
        try {
            const response = await http.post("/transactions/add", data);

            if (response.status === 201) {
                showToast({ type: "success", message: response.data.msg });
                await dispatch(getCustomerData());
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
            customerTransactionHistory: null,
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
                if (action.payload.statusCode === 404) {
                    state.data.message = action.payload.message;
                }
                state.data.customerData = action.payload?.data?.data?.data || [];
                state.loading = false;
            })
            .addCase(getCustomerData.rejected, (state, action) => {
                state.loading = false;
            })
            //get customer transaction history data
            .addCase(getCustomerTransactionHistory.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getCustomerTransactionHistory.fulfilled, (state, action) => {
                console.log(`Response from getCustomerTransactionHistory fulfilled:`, action.payload);
                if (action.payload.statusCode === 404) {
                    state.data.message = action.payload.message;
                }
                state.data.customerTransactionHistory = action.payload?.data || [];
                state.loading = false;
            })
            .addCase(getCustomerTransactionHistory.rejected, (state, action) => {
                state.loading = false;
            })
            //create customer 
            .addCase(createCustomer.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.loading = false;
            })
    },
});
export default dashboardSlice.reducer;
