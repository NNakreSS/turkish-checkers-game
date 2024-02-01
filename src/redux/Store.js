import { configureStore } from "@reduxjs/toolkit";
import checkers from "./slices/checkersSlice";

const Store = configureStore({
  reducer: {
    checkers,
  },
});

export default Store;
