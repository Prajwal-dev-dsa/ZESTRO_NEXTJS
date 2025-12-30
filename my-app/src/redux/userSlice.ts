import { createSlice } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IUser {
  _id?: string;
  name: string;
  email: string;
  mobile?: string;
  password?: string;
  image?: string;
  role: "user" | "admin" | "deliveryBoy";
  createdAt?: string;
  updatedAt?: string;
}

interface IUserSlice {
  userData: IUser | null;
}

const initialState: IUserSlice = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
