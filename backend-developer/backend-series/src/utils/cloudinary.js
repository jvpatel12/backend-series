import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// ✅ Configure Cloudinary
cloudinary.config({ 
  cloud_name: 'my_cloud_name', 
  api_key: 'my_key', 
  api_secret: 'my_secret'
});

// ✅ Upload Function
const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is required");
    }

    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    console.log(`✅ File uploaded successfully: ${response.secure_url}`);
    return response.secure_url;

  } catch (error) {
    console.error("❌ Error uploading file to Cloudinary:", error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // cleanup only if file exists
    }
    return null;
  }
};

// ✅ Example usage
(async () => {
  const uploadedUrl = await uploadOnCloudinary("./uploads/sample.jpg"); // provide correct path
  console.log("Uploaded URL:", uploadedUrl);
})();
