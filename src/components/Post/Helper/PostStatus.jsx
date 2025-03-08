const PostStatus = ({ status }) => {
  const statusStyles = {
    publish: "bg-blue-500 hover:bg-blue-600",
    draft: "bg-cyan-500 hover:bg-cyan-600",
    trash: "bg-pink-500 hover:bg-pink-600",
  };

  return (
    <button
      type="button"
      className={`text-white ${
        statusStyles[status] || "bg-gray-500 hover:bg-gray-600"
      } font-medium rounded-sm text-sm px-5 py-2.5 text-center me-2 mb-2 capitalize`}
    >
      {status}
    </button>
  );
};

export default PostStatus;
