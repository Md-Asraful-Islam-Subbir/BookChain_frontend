import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface WishlistItem {
  _id: string;
  products: string[];
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<any>) => {
      state.items = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
    }
  }
})