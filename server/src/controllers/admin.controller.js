import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadImage = async (req, res) => {
  try {
    const file = req.file; // Assuming you're using multer to handle file uploads

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "your_folder_name", // Optional: specify a folder in Cloudinary
    });
      
      const url =
        process.env.CLOUDINARY_URL +
        {
          transformation: [
            { fetch_format: "auto" },
            { quality: "auto" },
            { width: 200, height: 200, crop: "thumb", gravity: "face" },
          ],
        };
      console.log("url:", url);

    // Return the URL of the uploaded image
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
