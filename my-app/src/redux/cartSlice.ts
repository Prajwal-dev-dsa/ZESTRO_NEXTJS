import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IGrocery {
  _id: string;
  name: string;
  category: string;
  unit: string;
  price: string;
  image: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICartSlice {
  cartData: IGrocery[];
}

const initialState: ICartSlice = {
  cartData: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      state.cartData.push(action.payload);
    },
    increaseItemQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartData.find((i) => i._id == action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseItemQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartData.find((i) => i._id == action.payload);
      if (item?.quantity && item?.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cartData = state.cartData.filter((i) => i._id != action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartData = state.cartData.filter((i) => i._id != action.payload);
    },
  },
});

export const {
  addToCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  removeFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;
