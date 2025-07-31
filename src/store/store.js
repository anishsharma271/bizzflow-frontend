import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import dashboardSlice from "./dashboard/dashboardSlice";

const Store = configureStore({
   reducer: {
      authSlice,
      dashboardSlice
   }
})
export default Store;