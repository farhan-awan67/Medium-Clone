import { useState, useCallback } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { addNewPost, fetchPosts, saveDraftPost } from "../features/postSlice";
import toast from "react-hot-toast";

const NewPost = () => {
  const dispath = useDispatch();
  const [excerpt, setExcerpt] = useState("");
  const [title, setTitle] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [status, setStatus] = useState("published");
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const isFormValid = () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return false;
    }

    if (!bodyHtml) {
      toast.error("Please enter the body content");
      return false;
    }

    if (!tags.trim()) {
      toast.error("Please enter at least one tag");
      return false;
    }

    if (!coverImage) {
      toast.error("Please upload a cover image");
      return false;
    }

    return true;
  };

  // submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    let formData = new FormData();
    formData.append("title", title);
    formData.append("bodyHtml", bodyHtml);
    formData.append("tags", tags);
    formData.append("coverImage", coverImage);
    formData.append("status", status);

    if (status === "published") {
      dispath(addNewPost({ formData }))
        .unwrap()
        .then((data) => {
          toast.success(data);
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      dispath(saveDraftPost({ formData }))
        .unwrap()
        .then((data) => {
          toast.success(data);
        })
        .catch((err) => {
          toast.error(err);
        });
    }
    setTitle("");
    setBodyHtml("");
    setTags("");
    setStatus("");
    setCoverImage(null);
    setPreview(null);
  };

  // body change
  const handleBodyChange = (content, delta, source, editor) => {
    const text = editor.getText().trim(); // get plain text
    setBodyHtml(text === "" ? "" : content); // store empty string if no content
  };

  // --- Image Upload Handler ---
  const handleImageChange = (file) => {
    if (file) {
      setCoverImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  // --- Drag and Drop Handlers ---
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

  // --- Quill Toolbar Configuration ---
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
          <h1 className="text-2xl font-bold text-gray-900">
            Create a New Post
          </h1>
        </div>

        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-5">
            {/* Title */}
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
          <div className="mb-8 ">
            <label className="block text-gray-700 font-medium mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button className="px-5 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 transition cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 cursor-pointer bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              {status === "published" ? "Publish Post" : "Save as Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
