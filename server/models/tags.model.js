import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    postCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

tagsSchema.pre("validate", function (next) {
  if (!this.slug && this.name)
    this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

const Tags = mongoose.model("Tags", tagsSchema);

export default Tags;
