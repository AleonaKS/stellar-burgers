import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '@utils-types';
import { getOrdersApi } from '@api';
import { RootState } from '../store';

type ordersUserState = {
  orders: TOrder[];
  requestStatus: RequestStatus;
};

const initialState: ordersUserState = {
  orders: [],
  requestStatus: RequestStatus.Idle
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки заказов пользователя'
      );
    }
  }
);

const ordersUserSlice = createSlice({
  name: 'ordersUser',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.requestStatus = RequestStatus.Failed;
      });
  }
});

export const selectOrdersUser = (state: RootState) => state.orderUser;
export const selectOrders = (state: RootState) => state.orderUser.orders;
export const selectRequestStatus = (state: RootState) =>
  state.orderUser.requestStatus;

export const ordersUserActions = {
  ...ordersUserSlice.actions,
  fetchUserOrders
};

export default ordersUserSlice.reducer;
