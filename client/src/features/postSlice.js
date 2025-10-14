import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/api/posts`
      );
      const { posts } = res.data;
      return posts; // goes to fulfilled
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);



const initialState = {
  posts: [],
  error: null,
  loading: "",
};

const PostSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = "loading..";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {} = PostSlice.actions;
export default PostSlice.reducer;
