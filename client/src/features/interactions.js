import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";

// toggleFolow
export const toggleFollow = createAsyncThunk(
  "user/toggleFollow",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/auth/follow/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// toggle likes
export const toggleLikes = createAsyncThunk(
  "user/toggleLikes",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/posts/${id}/like`);
      return { postId: id, like: res.data.like, likeCount: res.data.likeCount };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// comments
export const addComment = createAsyncThunk(
  "post/comment",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/post/${postId}/comment`, {
        postId,
        body: comment, // 🔁 match the expected backend structure
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get comments
export const getComments = createAsyncThunk(
  "comments/get",
  async ({ postId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/post/${postId}`);
      return { postId, comments: res.data.comments }; // ✅ structured properly;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update comment
export const updateComment = createAsyncThunk(
  "comment/update",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/post/comment/${id}`, { body });
      return { comment: res.data.comment };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// delete comment
export const deleteComment = createAsyncThunk(
  "comment/delete",
  async ({ id, postId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/api/post/comment/${id}`);
      return { id, postId, message: res.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// bookmark
export const addBookmark = createAsyncThunk(
  "user/bookmarks",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/auth/bookmark/${id}`);
      return { postId: id, bookmarked: res.data.isBookmarked };
    } catch (error) {
      rejectWithValue(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  followStatus: {},
  likesStatus: {},
  commentsByPost: {},
  bookmark: null,
  loading: false,
  error: "",
};

const interactionSlice = createSlice({
  name: "interactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleFollow.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        state.loading = false;
        state.followStatus = action.payload;
      })
      .addCase(toggleFollow.rejected, (state, action) => {
        state.error = action.payload;
      })

      //   toggle likes
      .addCase(toggleLikes.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleLikes.fulfilled, (state, action) => {
        const { postId, like, likeCount } = action.payload;
        state.likesStatus[postId] = { like, likeCount };
      })
      .addCase(toggleLikes.rejected, (state, action) => {
        state.error = action.payload;
      })

      //   comments
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const { comment } = action.payload;
        const postId = comment.post.toString();
        if (!state.commentsByPost[postId]) {
          state.commentsByPost[postId] = [];
        }
        state.commentsByPost[postId].push(comment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload;
      })

      // get comments
      .addCase(getComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        const { comments, postId } = action.payload;
        if (!comments) return;
        state.commentsByPost[postId] = comments;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.error = action.payload;
      })

      // update comment
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        const { comment } = action.payload;
        state.commentsByPost[comment.post] = state.commentsByPost[
          comment.post
        ].map((comm) =>
          comm._id === comment._id ? { ...comm, body: comment.body } : comm
        );
      })
      .addCase(updateComment.rejected, (action, state) => {
        state.error = action.payload;
      })

      // delete comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        const { id, message, postId } = action.payload;
        state.commentsByPost[postId] = state.commentsByPost[postId].filter(
          (comment) => comment._id.toString() !== id
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload;
      })

      // handle bookmarks
      .addCase(addBookmark.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, bookmarked } = action.payload;
        if (!state.bookmark) state.bookmark = {};
        state.bookmark[postId] = bookmarked;
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default interactionSlice.reducer;
