import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsersList } from '../../shared/services/userService';

// Async Thunk
export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchUsersList();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to sync users.');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    // You can add clear or reset actions here if needed
    clearUserList: (state) => {
      state.list = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserList } = userSlice.actions;
export default userSlice.reducer;
