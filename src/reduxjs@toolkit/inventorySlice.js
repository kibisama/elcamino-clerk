import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cardinalAPI from '../lib/api/cardinal';

const asyncReloadCardinal = createAsyncThunk(
  'userSlice/asyncReloadCardinal',
  async (body, { rejectWithValue }) => {
    try {
      const res = await cardinalAPI.reloadCardinal();
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);
const asyncCheckCardinalInvoice = createAsyncThunk(
  'userSlice/asyncCheckCardinalInvoice',
  async (body, { rejectWithValue }) => {
    try {
      const res = await cardinalAPI.checkCardinalInvoice(body);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data.error);
    }
  },
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    isLoading: false,
    cardinalInvoiceData: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncReloadCardinal.pending, (state, action) => {});
    builder.addCase(asyncReloadCardinal.fulfilled, (state, action) => {
      console.log(action.payload);
    });
    builder.addCase(asyncReloadCardinal.rejected, (state, action) => {
      state.error = action.payload.error;
    });
    builder.addCase(asyncCheckCardinalInvoice.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(asyncCheckCardinalInvoice.fulfilled, (state, action) => {
      console.log(action.payload);
      state.isLoading = false;
    });
    builder.addCase(asyncCheckCardinalInvoice.rejected, (state, action) => {
      state.error = action.payload.error;
      state.isLoading = false;
    });
  },
});

export default inventorySlice.reducer;
export { asyncReloadCardinal, asyncCheckCardinalInvoice };
