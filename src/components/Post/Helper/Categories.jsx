import { useEffect, useState } from "react";

const AllCategories = () => {
  const [categories, setCategories] = useState([]); // Store categories in state

  useEffect(() => {
    fetchWordpressCategories();
  }, []);

  const fetchWordpressCategories = async () => {
    try {
      const apiResponse = await fetch(
        "http://localhost/adarbepari/wp-json/wp/v2/categories?per_page=100",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("bepari:@mbitiontough359730"), // Avoid hardcoding credentials in frontend
          },
        }
      );

      if (!apiResponse.ok) {
        throw new Error("Failed to fetch categories");
      }

      const apiData = await apiResponse.json();

      // Transform categories into an array instead of an object
      setCategories(apiData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="block w-full">
      <select
        id="categories"
        className="h-12 border border-gray-300 text-gray-600 text-base rounded-lg block w-full py-2.5 px-4 focus:outline-none"
      >
        <option value="" selected>
          Choose a category
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AllCategories;
