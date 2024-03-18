import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./slices/UserSlice";
import CartReducer from "./slices/CartSlice";
import WishlistReducer from "./slices/WishlistSlice";


export const store = configureStore({
    reducer: {
        user: UserReducer,
        cart: CartReducer,
        wishlist: WishlistReducer
    }
})

