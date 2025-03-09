import { useEffect, useState } from "react";
import AppPostModal from "./Modal/AddPostModal";
import EditPostModal from "./Modal/EditPostModal";
import PostStatus from "./Helper/PostStatus";
import PostCategories from "./Helper/PostCategories";
import FeaturedImage from "./Helper/FeaturedImage";
import Loader from "./Helper/Loader";
const PostList = () => {
  const [AddPostModalFlag, setAddPostModalFlag] = useState(false);
  const [EditPostModalFlag, setEditPostModalFlag] = useState(false);
  const [listPosts, setPosts] = useState([]);
  const [displayLoader, setDisplayLoader] = useState(true);
  const [editPostId, setEditPostId] = useState(null);

  // list of posts
  const fectWordpressPosts = async () => {
    try {
      const apiResponse = await fetch(
        "http://localhost/adarbepari/wp-json/wp/v2/posts?status=publish,draft,trash",
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
      // console.log(listPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setDisplayLoader(false);
    }
  };

  useEffect(() => {
    fectWordpressPosts();
  }, []);

  const toggleAddPostModal = () => {
    setAddPostModalFlag(!AddPostModalFlag);
  };

  const toggleEditPostModal = (postId) => {
    setEditPostModalFlag(!EditPostModalFlag);
    setEditPostId(postId);
  };

  const handleDeletePost = async (postId) => {
    setDisplayLoader(true);
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        const apiResponse = await fetch(
          `http://localhost/adarbepari/wp-json/wp/v2/posts/${postId}?force=true`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Basic " + btoa("bepari:@mbitiontough359730"),
            },
          }
        );
        console.log(apiResponse);
        fectWordpressPosts();
      }
    } catch (error) {
      console.error("Error deleting post: ", error);
    } finally {
      setDisplayLoader(false);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        {displayLoader && <Loader />}

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Posts</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 hover:shadow-md hover:cursor-pointer text-white px-4 py-2 rounded"
            onClick={toggleAddPostModal}
          >
            Add Post
          </button>
        </div>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 text-center">ID</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Category</th>
              <th className="px-6 py-3 text-center">Featured Image</th>
              <th className="px-6 py-3 text-center">Actions</th>
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
                      <td className="px-4 py-2 text-left">
                        {post.title.rendered}
                      </td>
                      <td className="px-4 py-2">
                        <PostStatus status={post.status} />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <PostCategories categories={post.categories} />
                      </td>
                      <td className="px-4 py-2">
                        <FeaturedImage featuredMedia={post.featured_media} />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 hover:cursor-pointer font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                          onClick={() => toggleEditPostModal(post.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 hover:cursor-pointer font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                          onClick={() => handleDeletePost(post.id)}
                        >
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
          <AppPostModal
            handleCloseEvent={toggleAddPostModal}
            refreshPostList={fectWordpressPosts}
          />
        )}

        {EditPostModalFlag && (
          <EditPostModal
            handleCloseEvent={toggleEditPostModal}
            refreshPostList={fectWordpressPosts}
            postId={editPostId}
          />
        )}
      </div>
    </>
  );
};

export default PostList;
