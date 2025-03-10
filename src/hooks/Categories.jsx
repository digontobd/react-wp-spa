import { useEffect, useState } from "react";

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchWordpressCategories = async () => {
      try {
        const apiResponse = await fetch(
          "http://localhost/adarbepari/wp-json/wp/v2/categories?per_page=100",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Basic " + btoa("bepari:@mbitiontough359730"),
            },
          }
        );

        if (!apiResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const apiData = await apiResponse.json();
        setCategories(apiData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchWordpressCategories();
  }, []);

  return categories;
};

export default useCategories;
