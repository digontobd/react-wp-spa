import { useEffect, useState } from "react";

const PostCategories = ({ categories }) => {
  const [categoryDetails, setCategoryDetails] = useState([]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchCategoryDetails(categories);
    }
  }, [categories]);

  const fetchCategoryDetails = async (categoryIds) => {
    try {
      const categoryPromises = categoryIds.map((id) =>
        fetch(`http://localhost/adarbepari/wp-json/wp/v2/categories/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("bepari:@mbitiontough359730"),
          },
        }).then((res) => res.json())
      );

      const getCategoryDetails = await Promise.all(categoryPromises);
      setCategoryDetails(getCategoryDetails);
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };

  return (
    <div className="block w-full">
      <div className="flex flex-wrap">
        {categoryDetails.map((category) => (
          <div className="p-2" key={category.id}>
            <div className="bg-gray-200 rounded-lg p-4">{category.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCategories;
