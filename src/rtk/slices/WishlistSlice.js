import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "App";
import axios from 'axios'

export const getWishlist = createAsyncThunk("wishlist/getWishlist", async (token, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${API}/wishlist`, {
            headers: {
                token
            }
        })
        return res.data
    } catch (error) {

        return rejectWithValue(error.response)
    }
})
export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async (values, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`${API}/wishlist/${values.productId}`, {
            headers: {
                token: values.token
            }
        })

        return res.data
    } catch (error) {
        return rejectWithValue(error.response)
    }
})
export const addToWishlist = createAsyncThunk("wishlist/addToWishlist", async (values, { rejectWithValue }) => {
    try {
        await axios.post(`${API}/wishlist`, {
            productId: values.productId
        }, {
            headers: {
                token: values.token
            }
        })

        return values.product
    } catch (error) {
        return rejectWithValue(error.response)
    }
})
const WishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        wishlist: [],
        isLoading: false,
        isAdding: false,
        isRemoving: false,
    },
    extraReducers: (builder) => {
        builder.addCase(getWishlist.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getWishlist.fulfilled, (state, action) => {
            state.isLoading = false
            state.wishlist = action.payload.data
        })
        builder.addCase(getWishlist.rejected, (state, action) => {
            state.isLoading = false
        })
        builder.addCase(removeFromWishlist.pending, (state) => {
            state.isRemoving = true;
        })
        builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
            state.isRemoving = false
            state.wishlist = state.wishlist.filter((product) => action.payload.data.includes(product.id))
        })
        builder.addCase(removeFromWishlist.rejected, (state) => {
            state.isRemoving = false;
        })
        builder.addCase(addToWishlist.pending, (state) => {
            state.isAdding = true
        })
        builder.addCase(addToWishlist.fulfilled, (state, action) => {
            state.isAdding = false
            state.wishlist = [...state.wishlist, action.payload]
        })
        builder.addCase(addToWishlist.rejected, (state) => {
            state.isAdding = false;
        })
    }
})

export default WishlistSlice.reducer

