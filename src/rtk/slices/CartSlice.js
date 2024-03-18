import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "App";
import axios from "axios";
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/cart`, {
        headers: {
          token,
        },
      });

      return res.data;
    } catch (error) {

      return rejectWithValue(error.response.data.message);
    }
  }
);
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (values, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API}/cart`,
        {
          productId: values.product.id,
        },
        {
          headers: {
            token: values.token,
          },
        }
      );

      return { res: res.data, product: values.product };
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (values, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API}/cart/${values.itemId}`, {
        headers: {
          token: values.token,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const clearUserCart = createAsyncThunk(
  "cart/clearUserCart",
  async (token, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/cart`, {
        headers: {
          token
        },
      });


    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
export const updateItemCount = createAsyncThunk(
  "cart/updateItemCount",
  async (values, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API}/cart/${values.itemId}`,
        {
          count: values.count,
        },
        {
          headers: {
            token: values.token,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    totalPrice: 0,
    error: null,
    isAdding: false,
    cartId: localStorage.getItem("cartId") || null,
    isLoading: false,
    isUpdating: false,
    isRemoving: false,
  },
  reducers: {
    clearCart: () => {
      localStorage.setItem('cartId', null)
      return {
        cart: [],
        totalPrice: 0,
        error: null,
        isAdding: false,
        cartId: null,
        isLoading: false,
        isUpdating: false,
        isRemoving: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCart.fulfilled, (state, action) => {

      localStorage.setItem('cartId', action.payload.data._id)
      state.cart = action.payload.data.products;
      state.totalPrice = action.payload.data.totalCartPrice;
      state.cartId = action.payload.data._id;

      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.message;
    });
    builder.addCase(addToCart.pending, (state) => {
      state.isAdding = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      localStorage.setItem('cartId', action.payload.res.data._id)
      let product = action.payload.product;
      let found = state.cart.find(item => item.product.id === product.id)
      if (!found) {
        state.cart = [...state.cart, {
          count: 1,
          price: product.price,
          product,
        }]
      } else {

        state.cart = state.cart.map(item => {
          if (item.product.id === product.id) {
            return {
              count: item.count++,
              ...item
            }
          }
          return item
        })
      }
      state.totalPrice = action.payload.res.data.totalCartPrice;
      state.cartId = action.payload.res.data._id;

      state.isAdding = false;
    });
    builder.addCase(addToCart.rejected, (state) => {
      state.isAdding = false;
    });
    builder.addCase(removeCartItem.pending, (state, action) => {
      state.isRemoving = true;
      state.error = null;
    });
    builder.addCase(removeCartItem.fulfilled, (state, action) => {
      state.cart = action.payload.data.products;
      state.totalPrice = action.payload.data.totalCartPrice;
      state.isRemoving = false;
    });
    builder.addCase(removeCartItem.rejected, (state, action) => {
      state.error = action.payload;
      state.isRemoving = false;
    });
    builder.addCase(updateItemCount.pending, (state, action) => {
      state.error = null;
      state.isUpdating = true;
    });
    builder.addCase(updateItemCount.fulfilled, (state, action) => {
      state.isUpdating = false;
      state.cart = action.payload.data.products;
      state.totalPrice = action.payload.data.totalCartPrice;
    });
    builder.addCase(updateItemCount.rejected, (state, action) => {
      state.isUpdating = false;
      state.error = action.payload;
    });
    builder.addCase(clearUserCart.pending, (state, action) => {
      state.error = null;
      state.isLoading = true;
    })
    builder.addCase(clearUserCart.fulfilled, (state, action) => {
      localStorage.setItem('cartId', null)
      state.isLoading = false
      state.cart = []
      state.cartId = null
    })
    builder.addCase(clearUserCart.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
  },
});

export const { clearCart } = CartSlice.actions;
export default CartSlice.reducer;
