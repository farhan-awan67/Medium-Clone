import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../utils/api";

// add new post
export const addNewPost = createAsyncThunk(
  "posts/newPost",
  async ({ formData }, { rejectWithValue }) => {
    try {
      console.log("inside add new post thunk", formData);
      const res = await api.post(`/api/posts/create-post`, formData);
      return res.data.post;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// get posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/posts`);
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
      })

      // new post
      .addCase(addNewPost.pending, (state) => {
        state.loading = "loading..";
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(addNewPost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {} = PostSlice.actions;
export default PostSlice.reducer;
