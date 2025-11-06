import React, { useCallback, useState } from "react";
import ReactQuill from "react-quill-new";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
import { updatePost } from "../features/postSlice";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

const EditPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { posts,loading,error } = useSelector((state) => state.posts);

  if (loading) {
    return <Loading className="w-8 h-8 mt-6" />;
  }
  // error
  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  const postToEdit = posts?.find((post) => post._id === id);
  // fallback if posts are not loaded yet
  if (!postToEdit) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading post data...
      </div>
    );
  }

  const [title, setTitle] = useState(postToEdit?.title || "");
  const [bodyHtml, setBodyHtml] = useState(postToEdit?.bodyHtml || "");
  const [tags, setTags] = useState(
    Array.isArray(postToEdit?.tags)
      ? postToEdit.tags.join(", ")
      : postToEdit?.tags || ""
  );
  const [coverImage, setCoverImage] = useState(null);
  const [status, setStatus] = useState(postToEdit?.status || "draft");
  const [preview, setPreview] = useState(postToEdit?.coverImage || "");
  const [isDragging, setIsDragging] = useState(false);

  // --- validation ---
  const isFormValid = () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return false;
    }
    if (!bodyHtml.trim()) {
      alert("Please enter the body content");
      return false;
    }
    if (!tags.trim()) {
      alert("Please enter at least one tag");
      return false;
    }
    if (!coverImage && !preview) {
      alert("Please upload a cover image");
      return false;
    }
    return true;
  };

  // --- submit form ---
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("bodyHtml", bodyHtml);
    formData.append("tags", tags);
    formData.append("status", status);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    dispatch(updatePost({ formData, slug: postToEdit?.slug }))
      .unwrap()
      .then(() => {
        toast.success("Post updated successfully");
        navigate(`/post/${postToEdit?.slug}`);
      })
      .catch(() => toast.error("Failed to update post"));
  };

  // --- body change handler ---
  const handleBodyChange = (content) => {
    setBodyHtml(content);
  };

  // --- image upload handler ---
  const handleImageChange = (file) => {
    if (file) {
      setCoverImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  // --- drag & drop handlers ---
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file instanceof File) {
      handleImageChange(file);
    }
  }, []);

  // --- quill toolbar config ---
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-md p-6 md:p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-1">
              Cover Image
            </label>
            <div
              className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-md cursor-pointer transition ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="fileUpload"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
              <label
                htmlFor="fileUpload"
                className="flex flex-col items-center justify-center"
              >
                <svg
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </label>
            </div>

            {/* Preview */}
            {preview && (
              <img
                src={preview}
                alt="Cover Preview"
                className="mt-4 w-full h-64 object-cover rounded-md border"
              />
            )}
          </div>

          {/* Body with React Quill */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">Body</label>
            <ReactQuill
              theme="snow"
              value={bodyHtml}
              onChange={handleBodyChange}
              modules={modules}
              formats={formats}
              placeholder="Start writing your story..."
              className="bg-white"
            />
          </div>

          {/* Tags */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="technology, webdev, react"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Status */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 cursor-pointer bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              {status === "published" ? "Update & Publish" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
