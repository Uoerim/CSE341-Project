# GridFS Implementation Summary

## Backend Changes

### New Dependencies
- `multer` - For handling multipart/form-data file uploads
- `gridfs-stream` - For GridFS integration with MongoDB

### New Files Created

1. **`server/src/config/gridfs.js`**
   - Initializes GridFS bucket with MongoDB
   - Exports functions to get GridFS bucket instance

2. **`server/src/middleware/upload.js`**
   - Configures multer with memory storage
   - File filter to accept only images
   - 10MB file size limit

3. **`server/src/routes/upload.routes.js`**
   - POST `/api/uploads/image` - Upload single image
   - GET `/api/uploads/image/:id` - Get image by ID
   - DELETE `/api/uploads/image/:id` - Delete image

4. **`server/src/controllers/upload.controller.js`**
   - `uploadImage` - Uploads image to GridFS, returns file ID and URL
   - `getImage` - Streams image from GridFS to client
   - `deleteImage` - Deletes image from GridFS

### Modified Files

1. **`server/src/config/db.js`**
   - Added GridFS initialization after MongoDB connection

2. **`server/src/app.js`**
   - Added upload routes to application

3. **`server/src/models/Community.js`**
   - Added `type` field (public, restricted, private, mature)
   - Added `topics` array field
   - Added `banner` field (GridFS file ID)
   - Added `icon` field (GridFS file ID)

4. **`server/src/models/User.js`**
   - Added `banner` field (GridFS file ID)
   - Note: `avatar` still uses character image system

5. **`server/src/controllers/community.controller.js`**
   - Updated `createCommunity` to accept type, topics, banner, and icon fields

## Frontend Changes

### New Files Created

1. **`client/src/services/uploadService.js`**
   - `uploadImage(file)` - Uploads image to GridFS
   - `getImageUrl(fileId)` - Generates URL for GridFS image
   - `deleteImage(fileId)` - Deletes image from GridFS

### Modified Files

1. **`client/src/components/Global/RichTextEditor/RichTextEditor.jsx`**
   - Imported uploadService
   - Modified `handleImageSelect` to upload images to GridFS instead of base64
   - Stores file ID in image data attribute for future reference

2. **`client/src/components/Global/CreateCommunityModal/CreateCommunityModal.jsx`**
   - Imported uploadService
   - Added banner and icon preview state
   - Modified `handleFileChange` to generate preview URLs
   - Modified `handleSubmit` to upload banner and icon to GridFS before creating community
   - Updated preview card to show uploaded images

## How It Works

### Image Upload Flow

1. **User selects an image** in RichTextEditor or CreateCommunityModal
2. **Frontend uploads image** to `/api/uploads/image` using FormData
3. **Backend receives file** via multer middleware (in memory buffer)
4. **GridFS stores file** in MongoDB with metadata (uploader, timestamp)
5. **Backend returns** file ID and URL
6. **Frontend stores** file ID in database and displays image via URL

### Image Retrieval Flow

1. **Client requests image** at `/api/uploads/image/:id`
2. **Backend validates** file ID
3. **GridFS streams file** directly to response
4. **Client displays image** with proper content-type and caching headers

### Benefits of GridFS

- ✅ **No file system storage** - Images stored in MongoDB
- ✅ **Scalable** - Handles files larger than 16MB BSON limit
- ✅ **Centralized** - Database and files in one place
- ✅ **Metadata support** - Store uploader, timestamps, etc.
- ✅ **Streaming** - Efficient for large files
- ✅ **Backup friendly** - Images included in MongoDB backups

## Usage Examples

### Upload Image in RichTextEditor
```javascript
const uploadResult = await uploadImage(file);
const imageUrl = getImageUrl(uploadResult.fileId);
// Use imageUrl in <img src="..." />
```

### Upload Community Banner/Icon
```javascript
if (banner) {
  const bannerResult = await uploadImage(banner);
  bannerFileId = bannerResult.fileId;
}
```

### Display Image
```html
<img src={getImageUrl(fileId)} alt="Image" />
```

## Next Steps (Optional)

1. Add image compression before upload
2. Implement image size validation
3. Add image cropping functionality
4. Implement lazy loading for images
5. Add CDN support for image delivery
6. Implement image deletion when posts/communities are deleted
