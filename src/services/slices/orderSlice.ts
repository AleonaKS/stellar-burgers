import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export interface OrderState {
  currentOrder: TOrder | null;
  fetchedOrder: TOrder | null;
  isSubmitting: boolean;
  isFetching: boolean;
  errorMessage: string | null;
  fetchErrorMessage: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  fetchedOrder: null,
  isSubmitting: false,
  isFetching: false,
  errorMessage: null,
  fetchErrorMessage: null
};

export const submitBurgerOrder = createAsyncThunk<TOrder, string[]>(
  'order/submit',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchByNumber',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      if (!response.success) {
        return rejectWithValue('Заказ не найден');
      }
      return response.orders[0];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.currentOrder = null;
      state.fetchedOrder = null;
      state.isSubmitting = false;
      state.isFetching = false;
      state.errorMessage = null;
    },
    setOrderError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setFetchOrderError: (state, action: PayloadAction<string>) => {
      state.fetchErrorMessage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBurgerOrder.pending, (state) => {
        state.isSubmitting = true;
        state.errorMessage = null;
      })
      .addCase(submitBurgerOrder.rejected, (state, action) => {
        state.isSubmitting = false;
      })
      .addCase(submitBurgerOrder.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentOrder = action.payload;
        state.errorMessage = null;
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isFetching = true;
        state.fetchErrorMessage = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isFetching = false;
        state.fetchedOrder = action.payload;
        state.fetchErrorMessage = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isFetching = false;
      });
  }
});

export const selectOrderState = (state: { order: OrderState }) => state.order;
export const selectIsSubmitting = (state: { order: OrderState }) =>
  state.order.isSubmitting;
export const selectCurrentOrder = (state: { order: OrderState }) =>
  state.order.currentOrder;
export const selectOrderError = (state: { order: OrderState }) =>
  state.order.errorMessage;

export const selectIsFetching = (state: { order: OrderState }) =>
  state.order.isFetching;
export const selectFetchedOrder = (state: { order: OrderState }) =>
  state.order.fetchedOrder;
export const selectFetchOrderError = (state: { order: OrderState }) =>
  state.order.fetchErrorMessage;

export const { resetOrderState, setOrderError, setFetchOrderError } =
  orderSlice.actions;

export const orderSliceActions = {
  ...orderSlice.actions,
  submitBurgerOrder,
  fetchOrderByNumber
};

export const orderSliceSelectors = {
  selectFetchedOrder,
  selectIsFetching,
  selectCurrentOrder,
  selectIsSubmitting,
  selectOrderError,
  selectFetchOrderError
};

export default orderSlice.reducer;
