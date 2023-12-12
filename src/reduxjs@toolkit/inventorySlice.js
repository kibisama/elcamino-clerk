import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cardinalAPI from '../lib/api/cardinal';
import * as mongodAPI from '../lib/api/mongod';

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
      console.error(e.message);
      return rejectWithValue(e.code);
    }
  },
);
const asyncManageCSOSOrders = createAsyncThunk(
  'userSlice/asyncManageCSOSOrders',
  async (body, { rejectWithValue }) => {
    try {
      const res = await cardinalAPI.manageCSOSOrders(body);
      return res.data;
    } catch (e) {
      console.error(e.message);
      return rejectWithValue(e.code);
    }
  },
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    isPuppeteering: false,
    cardinalInvoiceData: [],
    currentTab: 0,
    error: null,
  },
  reducers: {
    setCurrentTabInventory: (state, action) => {
      state.currentTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncReloadCardinal.pending, (state, action) => {});
    builder.addCase(asyncReloadCardinal.fulfilled, (state, action) => {});
    builder.addCase(asyncReloadCardinal.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(asyncCheckCardinalInvoice.pending, (state, action) => {
      state.isPuppeteering = true;
      state.cardinalInvoiceData = [];
    });
    builder.addCase(asyncCheckCardinalInvoice.fulfilled, (state, action) => {
      state.cardinalInvoiceData = action.payload.results;
      if (action.payload.error) {
        state.error = action.payload.error;
      }
      state.isPuppeteering = false;
    });
    builder.addCase(asyncCheckCardinalInvoice.rejected, (state, action) => {
      state.error = action.payload;
      state.isPuppeteering = false;
    });
    builder.addCase(asyncManageCSOSOrders.pending, (state, action) => {
      state.isPuppeteering = true;
    });
    builder.addCase(asyncManageCSOSOrders.fulfilled, (state, action) => {
      // state.cardinalInvoiceData = action.payload.results;
      if (action.payload.error) {
        state.error = action.payload.error;
      }
      state.isPuppeteering = false;
    });
    builder.addCase(asyncManageCSOSOrders.rejected, (state, action) => {
      state.error = action.payload;
      state.isPuppeteering = false;
    });
  },
});

export default inventorySlice.reducer;
export const { setCurrentTabInventory } = inventorySlice.actions;
export {
  asyncReloadCardinal,
  asyncCheckCardinalInvoice,
  asyncManageCSOSOrders,
};
