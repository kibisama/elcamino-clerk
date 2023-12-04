import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as mongodAPI from '../lib/api/mongod';

const asyncSearchDrugs = createAsyncThunk(
  'drugDBSlice/asynSearchDrugs',
  async (body, { rejectWithValue }) => {
    try {
      const res = await mongodAPI.searchDrugs(body);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);

const drugDBSlice = createSlice({
  name: 'drugDBSlice',
  initialState: {
    isSearching: false,
    autocompleteOptions: [],
    dataSelected: null,
    error: null,
  },
  reducers: {
    setAutocompleteOptions: (state, action) => {
      state.autocompleteOptions = action.payload;
    },
    setDataSelected: (state, action) => {
      state.dataSelected = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncSearchDrugs.pending, (state, action) => {
      state.isSearching = true;
    });
    builder.addCase(asyncSearchDrugs.fulfilled, (state, action) => {
      if (!action.payload.results) {
        state.autocompleteOptions = [];
        state.error = action.payload.error;
      } else {
        state.autocompleteOptions = action.payload.results;
        state.error = null;
      }
      state.isSearching = false;
    });
    builder.addCase(asyncSearchDrugs.rejected, (state, action) => {
      console.log('Post "mongod/drugs/search" Request Rejected');
      state.autocompleteOptions = [];
      state.error = null;
      state.isSearching = false;
    });
  },
});

export default drugDBSlice.reducer;
export const { setAutocompleteOptions, setDataSelected, setIsSearching } =
  drugDBSlice.actions;
export { asyncSearchDrugs };
