import mongoose from "mongoose";

import slugify from "slugify";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    bodyHtml: { type: String, required: true },
    bodyDoc: { type: mongoose.Schema.Types.Mixed, default: null },
    excerpt: { type: String, default: "" },
    tags: [{ type: String, index: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverImage: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    readTime: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true }
);

PostSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    const base = slugify(this.title, { lower: true, strict: true }).slice(
      0,
      120
    );
    this.slug = `${base}-${Math.random().toString(36).slice(2, 8)}`;
  }
  if (!this.excerpt && this.bodyHtml) {
    const text = this.bodyHtml.replace(/<\/?[^>]+(>|$)/g, "").trim();
    this.excerpt = text.length > 160 ? text.slice(0, 157) + "..." : text;
  }
  if (this.bodyHtml) {
    const text = this.bodyHtml.replace(/<\/?[^>]+(>|$)/g, "").trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    this.readTime = Math.max(1, Math.round(words / 200));
  }
  next();
});

PostSchema.virtual("likeCount").get(function () {
  return this.likes ? this.likes.length : 0;
});
PostSchema.index({ createdAt: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ title: "text", excerpt: "text", bodyHtml: "text" });

const Post = mongoose.model("Post", PostSchema);

export default Post;
