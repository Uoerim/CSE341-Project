const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Upload an image file to GridFS
 * @param {File} file - The image file to upload
 * @returns {Promise<{fileId: string, url: string}>} - The uploaded file info
 */
export const uploadImage = async (file) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("Authentication required");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${apiUrl}/uploads/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload image");
  }

  return response.json();
};

/**
 * Get the URL for an uploaded image
 * @param {string} fileId - The GridFS file ID
 * @returns {string} - The image URL
 */
export const getImageUrl = (fileId) => {
  if (!fileId) return null;
  return `${apiUrl}/uploads/image/${fileId}`;
};

/**
 * Delete an image from GridFS
 * @param {string} fileId - The GridFS file ID
 * @returns {Promise<void>}
 */
export const deleteImage = async (fileId) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${apiUrl}/uploads/image/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete image");
  }

  return response.json();
};
