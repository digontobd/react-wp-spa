import { useEffect, useState } from "react";
const FeaturedImage = ({ featuredMedia }) => {
  const [imageDetails, setimageDetails] = useState([]);
  const defaultImageUrl = "https://placehold.co/50x50"; // Default placeholder image

  useEffect(() => {
    if (featuredMedia !== 0) {
      fetchImageDetails(featuredMedia);
    }
  }, [featuredMedia]);

  const fetchImageDetails = async (mediaId) => {
    try {
      const imageApiResponse = await fetch(
        "http://localhost/adarbepari/wp-json/wp/v2/media/" + mediaId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("bepari:@mbitiontough359730"), // Avoid hardcoding credentials in frontend
          },
        }
      );

      if (!imageApiResponse.ok) {
        throw new Error("Failed to fetch featured image details");
      }

      const imageApiData = await imageApiResponse.json();
      setimageDetails(imageApiData);
      console.log(imageApiData);
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };

  return (
    <>
      <img
        className="w-15 rounded-lg"
        src={imageDetails?.source_url || defaultImageUrl} // Use fetched image or default
        alt={imageDetails?.alt_text || "Default Placeholder"}
      />
    </>
  );
};

export default FeaturedImage;
