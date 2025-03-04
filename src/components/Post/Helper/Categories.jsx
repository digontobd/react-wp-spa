import { useEffect } from "react";
const Categories = () => {
  useEffect(() => {
    fectWordpressCategories();
  }, []);

  const fectWordpressCategories = async () => {
    try {
      const apiResponse = await fetch(
        "http://localhost/adarbepari/wp-json/wp/v2/categories",
        // "https://adarbepari.com/wp-json/wp/v2/categories",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("bepari:@mbitiontough359730"),
          },
        }
      );
      const listCategories = await apiResponse.json();
      console.log(listCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }

    return (
      <span className="text-sm font-semibold text-gray-900 dark:text-white"></span>
    );
  };
};

export default Categories;
