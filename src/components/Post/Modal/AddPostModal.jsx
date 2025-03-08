import { useState } from "react";
import useCategories from "../Helper/Categories";
import Loader from "../Helper/Loader";
const AppPostModal = ({ handleCloseEvent, refreshPostList }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [status, setStatus] = useState("");

  const [displayLoader, setDisplayLoader] = useState(false);

  const categories = useCategories(); // call custom hook

  // Handle form submission
  const handleFormSubmitData = async (e) => {
    e.preventDefault();

    setDisplayLoader(true);

    let featuredImageID = null;
    // Upload the featured image if provided and get the media ID
    if (featuredImage) {
      featuredImageID = await handleFeaturedImageUpload(featuredImage);
    }

    const postData = {
      title,
      content,
      categories: [category],
      featured_media: featuredImageID,
      status,
    };
    console.log(postData);

    try {
      const apiResponse = await fetch(
        "http://localhost/adarbepari/wp-json/wp/v2/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("bepari:@mbitiontough359730"),
          },
          body: JSON.stringify(postData),
        }
      );

      if (!apiResponse.ok) {
        throw new Error("Failed to add post");
      }

      const apiData = await apiResponse.json();
      console.log(apiData);
      handleCloseEvent();
      refreshPostList();
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setDisplayLoader(false);
    }
  };

  const handleFeaturedImageUpload = async (featuredImageFile) => {
    try {
      const formData = new FormData();
      formData.append("file", featuredImageFile);
      formData.append("alt_text", featuredImageFile.name);

      const apiResponse = await fetch(
        "http://localhost/adarbepari/wp-json/wp/v2/media",
        {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa("bepari:@mbitiontough359730"),
          },
          body: formData,
        }
      );
      const apiData = await apiResponse.json();
      console.log(apiData);
      return apiData.id;
    } catch (error) {
      console.error("Error uploading featured image:", error);
    }
  };

  return (
    <>
      <div className="modal" id="addPostModal">
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/[.60]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 relative">
            {displayLoader && <Loader />}
            <h2 className="text-2xl mb-4">Add New Post</h2>
            <form onSubmit={handleFormSubmitData}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded w-full p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4 col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2"
                    rows="6"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Featured Image
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFeaturedImage(e.target.files[0])}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2"
                    required
                  >
                    <option value="">- Select -</option>
                    <option value="publish">Publish</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 hover:cursor-pointer text-white px-4 py-2 rounded mr-2"
                  onClick={handleCloseEvent}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppPostModal;
