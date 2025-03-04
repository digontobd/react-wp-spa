import { useEffect, useState } from "react";
import AppPostModal from "./Modal/AddPostModal";
import EditPostModal from "./Modal/EditPostModal";
import PostStatus from "./Helper/PostStatus";
import PostCategories from "./Helper/PostCategories";
const PostList = () => {
  const [AddPostModalFlag, setAddPostModalFlag] = useState(false);
  const [EditPostModalFlag, setEditPostModalFlag] = useState(false);

  const [listPosts, setPosts] = useState([]);

  // list of posts
  const fectWordpressPosts = async () => {
    try {
      const apiResponse = await fetch(
        "http://localhost/adarbepari/wp-json/wp/v2/posts?status=publish,draft,trash",
        // "https://adarbepari.com/wp-json/wp/v2/posts",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("bepari:@mbitiontough359730"),
          },
        }
      );
      const listPosts = await apiResponse.json();
      setPosts(listPosts);
      console.log(listPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fectWordpressPosts();
  }, []);

  const toggleAddPostModal = () => {
    setAddPostModalFlag(!AddPostModalFlag);
  };

  const toggleEditPostModal = () => {
    setEditPostModalFlag(!EditPostModalFlag);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="loader"></div>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Posts</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={toggleAddPostModal}
          >
            Add Post
          </button>
        </div>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Featured Image</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              /* Add your table rows here */
              listPosts &&
                listPosts.map((post) => {
                  return (
                    <tr
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 text-center"
                      key={post.id}
                    >
                      <td className="px-4 py-2">{post.id}</td>
                      <td className="px-4 py-2">{post.title.rendered}</td>
                      <td className="px-4 py-2">
                        <PostStatus status={post.status} />
                      </td>
                      <td className="px-4 py-2">
                        <PostCategories categories={post.categories} />
                      </td>
                      <td className="px-4 py-2">
                        <img
                          className="w-50 rounded-lg"
                          src={post.featured_image_thumbnail_url}
                          alt={post.title.rendered}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                          onClick={toggleEditPostModal}
                        >
                          Edit
                        </button>
                        <button className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>

        {AddPostModalFlag && (
          <AppPostModal handleCloseEvent={toggleAddPostModal} />
        )}

        {EditPostModalFlag && (
          <EditPostModal handleCloseEvent={toggleEditPostModal} />
        )}
      </div>
    </>
  );
};

export default PostList;
