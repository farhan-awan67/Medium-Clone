import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

// add new post
export const addNewPost = createAsyncThunk(
  "posts/newPost",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/posts/create-post`, formData);
      return res.data.post;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// update post
export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ formData, slug }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/posts/update-post/${slug}`, formData);
      return { message: res.data.message, post: res.data.post };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// get post by slug
export const getPostBySlug = createAsyncThunk(
  "posts/getPostBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/posts/${slug}`);
      return res.data.post;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load post"
      );
    }
  }
);

// draft post
export const saveDraftPost = createAsyncThunk(
  "post/draftPost",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/posts/draft-post`, formData);
      return res.data.post;
    } catch (error) {
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
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// publish post
export const makePostPublished = createAsyncThunk(
  "posts/publish",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/api/posts/publish/${id}`);
      return { id, post: res.data.post };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// delete post
export const deletePostBySlug = createAsyncThunk(
  "posts/delete",
  async ({ slug }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/api/posts/delete-post/${slug}`);
      return { slug, data: res.data }; // goes to fulfilled
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// get the trending tags
export const trendingTags = createAsyncThunk(
  "post/tags",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/tags/trending-tags");
      return res.data.tags;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  posts: [],
  currentPost: null,
  trendingTags: [],
  error: null,
  loading: false,
};

const PostSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.error = action.payload;
      })

      // new post
      .addCase(addNewPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(addNewPost.rejected, (state, action) => {
        state.error = action.payload;
      })

      // update post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const { message, post } = action.payload;
        // ✅ Find the index of the updated post
        const index = state.posts.findIndex((p) => p._id === post._id);

        if (index !== -1) {
          // ✅ Replace the existing post with the updated one
          state.posts[index] = post;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // post by slug
      .addCase(getPostBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })

      // draft post
      .addCase(saveDraftPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveDraftPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(saveDraftPost.rejected, (state, action) => {
        state.error = action.payload;
      })

      // make post publish
      .addCase(makePostPublished.pending, (state) => {
        state.loading = true;
      })
      .addCase(makePostPublished.fulfilled, (state, action) => {
        state.loading = false;
        const { id, post } = action.payload;

        // Remove the draft
        state.posts = state.posts.filter((p) => p._id !== id);

        // Add the new published version
        state.posts.unshift(post);
      })
      .addCase(makePostPublished.rejected, (state, action) => {
        state.error = action.payload;
      })

      // delete post
      .addCase(deletePostBySlug.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deletePostBySlug.fulfilled, (state, action) => {
        state.loading = false;
        const { slug, data } = action.payload;
        state.posts = state.posts.filter((post) => post.slug !== slug);
      })
      .addCase(deletePostBySlug.rejected, (state, action) => {
        state.error = action.payload;
      })

      // trending tags
      .addCase(trendingTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(trendingTags.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingTags = action.payload;
      })
      .addCase(trendingTags.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {} = PostSlice.actions;
export default PostSlice.reducer;
