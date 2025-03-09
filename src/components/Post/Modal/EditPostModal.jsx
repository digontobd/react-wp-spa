import { useState, useEffect } from "react";
import useCategories from "../Helper/Categories";
import Loader from "../Helper/Loader";
const EditPostModal = (props) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [status, setStatus] = useState("");
  const [defaultFeaturedImageURL, setDefaultFeaturedImageURL] = useState(
    "https://placehold.co/50x50"
  );

  const [displayLoader, setDisplayLoader] = useState(true);

  const postId = props.postId;
  const categories = useCategories();

  // to get post detils using postId
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const apiResponse = await fetch(
          `http://localhost/adarbepari/wp-json/wp/v2/posts/${postId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Basic " + btoa("bepari:@mbitiontough359730"),
            },
          }
        );

        if (!apiResponse.ok) {
          throw new Error("Failed to fetch post details");
        }

        const apiData = await apiResponse.json();
        setTitle(apiData.title.rendered);
        setContent(apiData.content.rendered);
        setCategory(apiData.categories[0]);
        setFeaturedImage(apiData.featured_media);
        setStatus(apiData.status);

        console.log(apiData);

        // media
        const featuredMediaId = apiData.featured_media;
        if (featuredMediaId > 0) {
          const mediaResponse = await fetch(
            `http://localhost/adarbepari/wp-json/wp/v2/media/${featuredMediaId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + btoa("bepari:@mbitiontough359730"),
              },
            }
          );

          if (!mediaResponse.ok) {
            throw new Error("Failed to fetch media details");
          }
          const mediaData = await mediaResponse.json();
          setDefaultFeaturedImageURL(mediaData.source_url);
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setDisplayLoader(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  // Handle form submission
  const handleFormSubmitData = async (e) => {
    e.preventDefault();

    setDisplayLoader(true);
    const postData = {
      title,
      content,
      categories: [category],
      status,
    };

    // Upload Featured Image - If we upload
    let featuredMediaId = null;
    if (featuredImage) {
      featuredMediaId = await uploadNewFeaturedMediaImage(featuredImage);
      postData.featured_media = featuredMediaId;
    }
    console.log(postData);

    try {
      const apiResponse = await fetch(
        `http://localhost/adarbepari/wp-json/wp/v2/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("bepari:@mbitiontough359730"),
          },
          body: JSON.stringify(postData),
        }
      );

      if (!apiResponse.ok) {
        // Check if the request was successful
        throw new Error("Failed to update post details");
      }

      const apiData = await apiResponse.json();
      console.log(apiData);
      props.handleCloseEvent();
      props.refreshPostList();
    } catch (error) {
      console.error("Error updating post details:", error);
    } finally {
      setDisplayLoader(false);
    }
  };

  // Upload Featured MEdia
  const uploadNewFeaturedMediaImage = async (featuredImage) => {
    try {
      const formdata = new FormData();
      formdata.append("file", featuredImage);
      formdata.append("alt_text", "New Featured Image");

      const apiResponse = await fetch(
        "http://localhost/adarbepari/wp-json/wp/v2/media",
        {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa("bepari:@mbitiontough359730"),
          },
          body: formdata,
        }
      );

      const apiData = await apiResponse.json();

      return apiData.id;
    } catch (error) {
      console.log("Error uploading featured image: ", error);
    }
  };

  return (
    <>
      <div className="modal" id="editPostModal">
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 relative">
            {displayLoader && <Loader />}
            <h2 className="text-2xl mb-4">Edit Post</h2>
            <form onSubmit={handleFormSubmitData}>
              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
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
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="border border-gray-300 rounded w-full p-2"
                  rows="6"
                  required
                >
                  Sample post content goes here
                </textarea>
              </div>

              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    Featured Image
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFeaturedImage(e.target.files[0])}
                  />
                  <br />
                  <br />
                  <img
                    src={defaultFeaturedImageURL}
                    alt="Featured Image"
                    style={{ width: "100px" }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-gray-300 rounded w-full p-2"
                    required
                  >
                    <option value="publish">Publish</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 hover:cursor-pointer text-white px-4 py-2 rounded mr-2"
                  onClick={props.handleCloseEvent}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPostModal;
