import { createSlice } from '@reduxjs/toolkit';

const printSlice = createSlice({
  name: 'print',
  initialState: {
    paperBill: null,
  },
  reducers: {
    setPaperBill: (state, action) => {
      state.paperBill = action.payload;
    },
  },
});

export default printSlice.reducer;
export const { setPaperBill } = printSlice.actions;
