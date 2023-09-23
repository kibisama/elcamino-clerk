import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    configs: null,
  },
  reducers: {
    loadSettings: (state, action) => {
      state.configs = action.payload;
    },
  },
});

export default settingsSlice.reducer;
export const { loadSettings } = settingsSlice.actions;
