# Loopify Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Communities](#communities)
- [Posts](#posts)
- [Comments](#comments)
- [Search](#search)
- [Upload](#upload)

---

<!-- ## Authentication

### 1. Register User
**Endpoint:** `POST {{base_url}}/auth/register`  
**Authentication:** None  
**Description:** Register a new user account

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "gender": "male"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation Rules:**
- Username: minimum 4 characters
- All fields required except gender (defaults to "prefer not to say")

**Screenshots:** 
![Register User Request](screenshots/auth_register_request.png)
![Register User Response](screenshots/auth_register_response.png)

--- -->
<!-- 
### 2. Login User
**Endpoint:** `POST {{base_url}}/auth/login`  
**Authentication:** None  
**Description:** Login with email/username and password

**Request Body:**
```json
{
  "emailOrUsername": "johndoe",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Screenshots:** 
![Login User Request](screenshots/auth_login_request.png)
![Login User Response](screenshots/auth_login_response.png)

--- -->

<!-- ### 3. Check Username Availability
**Endpoint:** `POST {{base_url}}/auth/check-username`  
**Authentication:** None  
**Description:** Check if username is available

**Request Body:**
```json
{
  "username": "johndoe"
}
```

**Response (200 OK):**
```json
{
  "available": false,
  "message": "Username already taken"
}
```

**Screenshots:** 
![Check Username Request](screenshots/auth_check_username.png)

--- -->

<!-- ### 4. Check Email Availability
**Endpoint:** `POST {{base_url}}/auth/check-email`  
**Authentication:** None  
**Description:** Check if email is available

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "available": false,
  "message": "Email already in use"
}
```

**Screenshots:** 
![Check Email Request](screenshots/auth_check_email.png)

--- -->

<!-- ### 5. Verify Token
**Endpoint:** `GET {{base_url}}/auth/verify`  
**Authentication:** Required (Bearer Token)  
**Description:** Verify if JWT token is valid

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "valid": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Screenshots:** 
![Verify Token Request](screenshots/auth_verify_token.png)

--- -->

<!-- ### 6. Google Authentication
**Endpoint:** `POST {{base_url}}/auth/google-auth`  
**Authentication:** None  
**Description:** Authenticate or register using Google OAuth

**Request Body:**
```json
{
  "idToken": "google_id_token_here"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Screenshots:** 
![Google Auth Request](screenshots/auth_google.png)

--- -->
<!-- 
### 7. Complete Google Registration
**Endpoint:** `POST {{base_url}}/auth/google-register`  
**Authentication:** None  
**Description:** Complete registration for Google users (set username)

**Request Body:**
```json
{
  "idToken": "google_id_token_here",
  "username": "johndoe",
  "gender": "male"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Screenshots:** 
![Google Register Request](screenshots/auth_google_register.png) -->

<!-- ---

## Users

### 1. Get My Profile
**Endpoint:** `GET {{base_url}}/users/me`  
**Authentication:** Required  
**Description:** Get current logged-in user's profile

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "bio": "Software developer",
  "gender": "male",
  "karma": 150,
  "cakeDay": "2024-01-15T00:00:00.000Z",
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

**Screenshots:** 
![Get My Profile](screenshots/user_me.png)

--- -->
<!-- 
### 2. Update My Profile
**Endpoint:** `PUT {{base_url}}/users/me`  
**Authentication:** Required  
**Description:** Update current user's profile

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "bio": "Full-stack developer passionate about web technologies",
  "gender": "male"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "bio": "Full-stack developer passionate about web technologies",
  "gender": "male",
  "karma": 150
}
```

**Screenshots:** 
![Update Profile Request](screenshots/user_update_profile.png)

--- -->
<!-- 
### 3. Get User Profile by Username
**Endpoint:** `GET {{base_url}}/users/u/:username/profile`  
**Authentication:** Required  
**Description:** Get public profile information of a user

**Example:** `GET /api/users/u/johndoe/profile`

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "bio": "Software developer",
  "karma": 150,
  "cakeDay": "2024-01-15T00:00:00.000Z",
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

**Screenshots:** 
![User Profile by Username](screenshots/user_profile_username.png)

--- -->

<!-- ### 4. Get User Posts by Username
**Endpoint:** `GET {{base_url}}/users/u/:username/posts`  
**Authentication:** Required  
**Description:** Get all posts created by a user

**Example:** `GET /api/users/u/johndoe/posts`

**Response (200 OK):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "My First Post",
      "content": "This is the content of my post",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe"
      },
      "community": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "JavaScript"
      },
      "upvotes": 10,
      "downvotes": 2,
      "createdAt": "2024-12-19T00:00:00.000Z"
    }
  ]
}
```

**Screenshots:** 
![User Posts](screenshots/user_posts.png)

--- -->

<!-- ### 5. Get User Comments by Username
**Endpoint:** `GET {{base_url}}/users/u/:username/comments`  
**Authentication:** Required  
**Description:** Get all comments made by a user

**Example:** `GET /api/users/u/johndoe/comments`

**Response (200 OK):**
```json
{
  "comments": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "content": "Great post!",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe"
      },
      "post": "507f1f77bcf86cd799439012",
      "upvotes": 5,
      "createdAt": "2024-12-19T00:00:00.000Z"
    }
  ]
}
```

**Screenshots:** 
![User Comments](screenshots/user_comments.png)

--- -->

<!-- ### 6. Get User Overview by Username
**Endpoint:** `GET {{base_url}}/users/u/:username/overview`  
**Authentication:** Required  
**Description:** Get combined posts and comments of a user

**Example:** `GET /api/users/u/johndoe/overview`

**Response (200 OK):**
```json
{
  "activities": [
    {
      "type": "post",
      "_id": "507f1f77bcf86cd799439012",
      "title": "My First Post",
      "content": "This is the content",
      "createdAt": "2024-12-19T00:00:00.000Z"
    },
    {
      "type": "comment",
      "_id": "507f1f77bcf86cd799439014",
      "content": "Great post!",
      "createdAt": "2024-12-19T00:00:00.000Z"
    }
  ]
}
```

**Screenshots:** 
![User Overview](screenshots/user_overview.png) -->

<!-- ---

### 7. Get User Upvoted Posts
**Endpoint:** `GET {{base_url}}/users/u/:username/upvoted`  
**Authentication:** Required (Must be own profile)  
**Description:** Get posts that the user has upvoted

**Example:** `GET /api/users/u/johndoe/upvoted`

**Response (200 OK):**
```json
{
  "upvotedPosts": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "title": "Interesting Article",
      "author": {
        "username": "janedoe"
      },
      "upvotes": 50
    }
  ]
}
```

**Screenshots:** 
![User Upvoted](screenshots/user_upvoted.png)

--- -->
<!-- 
### 8. Get User Downvoted Posts
**Endpoint:** `GET {{base_url}}/users/u/:username/downvoted`  
**Authentication:** Required (Must be own profile)  
**Description:** Get posts that the user has downvoted

**Screenshots:** 
![User Downvoted](screenshots/user_downvoted.png)

--- -->

<!-- ### 9. Get User Saved Posts
**Endpoint:** `GET {{base_url}}/users/u/:username/saved`  
**Authentication:** Required (Must be own profile)  
**Description:** Get posts that the user has saved

**Screenshots:** 
![User Saved](screenshots/user_saved.png)

--- -->

### 10. Get User History
**Endpoint:** `GET {{base_url}}/users/u/:username/history`  
**Authentication:** Required (Must be own profile)  
**Description:** Get user's browsing history

**Screenshots:** 
![User History](screenshots/user_history.png)

---

### 11. Get User Hidden Posts
**Endpoint:** `GET {{base_url}}/users/u/:username/hidden`  
**Authentication:** Required (Must be own profile)  
**Description:** Get posts that the user has hidden

**Screenshots:** 
![User Hidden](screenshots/user_hidden.png)

---

### 12. Search Users and Communities
**Endpoint:** `GET {{base_url}}/users/search?q=search_term`  
**Authentication:** Required  
**Description:** Search for users and communities

**Query Parameters:**
- `q`: Search query string

**Example:** `GET /api/users/search?q=john`

**Response (200 OK):**
```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "karma": 150
    }
  ],
  "communities": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "JavaScript",
      "members": 1500
    }
  ]
}
```

**Screenshots:** 
![Search Users](screenshots/user_search.png)

---

## Communities

### 1. Create Community
**Endpoint:** `POST {{base_url}}/communities`  
**Authentication:** Required  
**Description:** Create a new community

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "name": "JavaScript",
  "description": "A community for JavaScript developers",
  "category": "Programming"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "JavaScript",
  "description": "A community for JavaScript developers",
  "category": "Programming",
  "creator": "507f1f77bcf86cd799439011",
  "members": ["507f1f77bcf86cd799439011"],
  "posts": [],
  "createdAt": "2024-12-19T00:00:00.000Z"
}
```

**Screenshots:** 
![Create Community Request](screenshots/community_create_request.png)
![Create Community Response](screenshots/community_create_response.png)

---

### 2. Get All Communities
**Endpoint:** `GET {{base_url}}/communities`  
**Authentication:** Required  
**Description:** Get list of all communities

**Response (200 OK):**
```json
{
  "communities": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "JavaScript",
      "description": "A community for JavaScript developers",
      "members": 150,
      "posts": 234,
      "createdAt": "2024-12-19T00:00:00.000Z"
    }
  ]
}
```

**Screenshots:** 
![Get Communities](screenshots/community_list.png)

---

### 3. Get Community by Name
**Endpoint:** `GET {{base_url}}/communities/r/:name`  
**Authentication:** Required  
**Description:** Get community details by name

**Example:** `GET /api/communities/r/JavaScript`

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "JavaScript",
  "description": "A community for JavaScript developers",
  "category": "Programming",
  "creator": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe"
  },
  "members": 150,
  "posts": 234,
  "createdAt": "2024-12-19T00:00:00.000Z"
}
```

**Screenshots:** 
![Get Community by Name](screenshots/community_by_name.png)

---

### 4. Get Community Posts by Name
**Endpoint:** `GET {{base_url}}/communities/r/:name/posts`  
**Authentication:** Required  
**Description:** Get all posts in a community

**Example:** `GET /api/communities/r/JavaScript/posts`

**Response (200 OK):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "My First Post",
      "content": "This is the content",
      "author": {
        "username": "johndoe"
      },
      "upvotes": 10,
      "downvotes": 2,
      "createdAt": "2024-12-19T00:00:00.000Z"
    }
  ]
}
```

**Screenshots:** 
![Community Posts](screenshots/community_posts.png)

---

### 5. Get Community by ID
**Endpoint:** `GET {{base_url}}/communities/:id`  
**Authentication:** Required  
**Description:** Get community details by ID

**Example:** `GET /api/communities/507f1f77bcf86cd799439013`

**Screenshots:** 
![Get Community by ID](screenshots/community_by_id.png)

---

### 6. Update Community
**Endpoint:** `PUT {{base_url}}/communities/:id`  
**Authentication:** Required (Must be creator)  
**Description:** Update community details

**Request Body:**
```json
{
  "description": "Updated description for JavaScript community",
  "category": "Web Development"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "JavaScript",
  "description": "Updated description for JavaScript community",
  "category": "Web Development"
}
```

**Screenshots:** 
![Update Community](screenshots/community_update.png)

---

### 7. Delete Community
**Endpoint:** `DELETE {{base_url}}/communities/:id`  
**Authentication:** Required (Must be creator)  
**Description:** Delete a community

**Response (200 OK):**
```json
{
  "message": "Community deleted successfully"
}
```

**Screenshots:** 
![Delete Community](screenshots/community_delete.png)

---

### 8. Join Community
**Endpoint:** `GET {{base_url}}/communities/:id/join`  
**Authentication:** Required  
**Description:** Join a community

**Response (200 OK):**
```json
{
  "message": "Successfully joined community",
  "community": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "JavaScript",
    "members": 151
  }
}
```

**Screenshots:** 
![Join Community](screenshots/community_join.png)

---

### 9. Leave Community
**Endpoint:** `GET {{base_url}}/communities/:id/leave`  
**Authentication:** Required  
**Description:** Leave a community

**Response (200 OK):**
```json
{
  "message": "Successfully left community",
  "community": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "JavaScript",
    "members": 150
  }
}
```

**Screenshots:** 
![Leave Community](screenshots/community_leave.png)

---

## Posts

<!-- ### 1. Create Post
**Endpoint:** `POST {{base_url}}/posts`  
**Authentication:** Required  
**Description:** Create a new post

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "title": "My First Post",
  "content": "This is the content of my post. It can include rich text formatting.",
  "status": "published"
}
```

**Parameters:**
- `title`: (required) Post title
- `content`: (required) Post content
- `community`: (optional) Community ID - you can add this to post in a specific community
- `status`: (optional) "draft" or "published" (default: "published")

**Note:** The `community` field is optional. If omitted, the post will not be associated with any community.

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "My First Post",
  "content": "This is the content of my post",
  "author": "507f1f77bcf86cd799439011",
  "community": "507f1f77bcf86cd799439013",
  "status": "published",
  "upvotes": 0,
  "downvotes": 0,
  "upvotedBy": [],
  "downvotedBy": [],
  "createdAt": "2024-12-19T00:00:00.000Z"
}
```

**Screenshots:** 
![Create Post Request](screenshots/post_create_request.png)
![Create Post Response](screenshots/post_create_response.png)

--- -->

<!-- ### 2. Get All Posts
**Endpoint:** `GET {{base_url}}/posts`  
**Authentication:** None  
**Description:** Get all published posts

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "My First Post",
    "content": "This is the content",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "community": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "JavaScript"
    },
    "upvotes": 10,
    "downvotes": 2,
    "createdAt": "2024-12-19T00:00:00.000Z"
  }
]
```

**Screenshots:** 
![Get All Posts](screenshots/post_list.png)

--- -->
<!-- 
### 3. Get Post by ID
**Endpoint:** `GET {{base_url}}/posts/:id`  
**Authentication:** None  
**Description:** Get a specific post by ID

**Example:** `GET /api/posts/507f1f77bcf86cd799439012`

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "My First Post",
  "content": "This is the content of my post",
  "author": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe"
  },
  "community": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "JavaScript"
  },
  "upvotes": 10,
  "downvotes": 2,
  "comments": 5,
  "createdAt": "2024-12-19T00:00:00.000Z"
}
```

**Screenshots:** 
![Get Post by ID](screenshots/post_detail.png)

--- -->
<!-- 
### 4. Update Post
**Endpoint:** `PUT {{base_url}}/posts/:id`  
**Authentication:** Required (Must be author)  
**Description:** Update a post

**Request Body:**
```json
{
  "title": "Updated Post Title",
  "content": "Updated content",
  "status": "published"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Updated Post Title",
  "content": "Updated content",
  "status": "published",
  "updatedAt": "2024-12-19T01:00:00.000Z"
}
```

**Screenshots:** 
![Update Post](screenshots/post_update.png)

--- -->

<!-- ### 5. Delete Post
**Endpoint:** `DELETE {{base_url}}/posts/:id`  
**Authentication:** Required (Must be author)  
**Description:** Delete a post

**Response (200 OK):**
```json
{
  "message": "Post deleted successfully"
}
```

**Screenshots:** 
![Delete Post](screenshots/post_delete.png)

--- -->

<!-- ### 6. Upvote Post
**Endpoint:** `PUT {{base_url}}/posts/:id/upvote`  
**Authentication:** Required  
**Description:** Upvote a post (toggle)

**Response (200 OK):**
```json
{
  "message": "Post upvoted successfully",
  "upvotes": 11,
  "downvotes": 2,
  "userVote": "upvote"
}
```

**Note:** If user has already upvoted, it removes the upvote. If user has downvoted, it changes to upvote.

**Screenshots:** 
![Upvote Post](screenshots/post_upvote.png)

--- -->

<!-- ### 7. Downvote Post
**Endpoint:** `PUT {{base_url}}/posts/:id/downvote`  
**Authentication:** Required  
**Description:** Downvote a post (toggle)

**Response (200 OK):**
```json
{
  "message": "Post downvoted successfully",
  "upvotes": 10,
  "downvotes": 3,
  "userVote": "downvote"
}
```

**Note:** If user has already downvoted, it removes the downvote. If user has upvoted, it changes to downvote.

**Screenshots:** 
![Downvote Post](screenshots/post_downvote.png)

--- -->
<!-- 
### 8. Get Feed Posts
**Endpoint:** `GET {{base_url}}/posts/feed`  
**Authentication:** None  
**Description:** Get paginated feed posts from last 30 days

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 10)
- `exclude`: Comma-separated list of post IDs to exclude

**Example:** `GET /api/posts/feed?page=1&limit=10&exclude=507f1f77bcf86cd799439012`

**Response (200 OK):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "title": "Latest Post",
      "content": "Content here",
      "author": {
        "username": "janedoe"
      },
      "upvotes": 20,
      "createdAt": "2024-12-18T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalPosts": 50,
    "hasMore": true
  }
}
```

**Screenshots:** 
![Feed Posts](screenshots/post_feed.png)

--- -->

<!-- ### 9. Get Recent Posts
**Endpoint:** `GET {{base_url}}/posts/recent`  
**Authentication:** None  
**Description:** Get recently created posts

**Response (200 OK):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "title": "Latest Post",
      "author": {
        "username": "janedoe"
      },
      "createdAt": "2024-12-19T00:00:00.000Z"
    }
  ]
}
```

**Screenshots:** 
![Recent Posts](screenshots/post_recent.png)

---

### 10. Get Popular Posts
**Endpoint:** `GET {{base_url}}/posts/popular`  
**Authentication:** None  
**Description:** Get posts sorted by popularity (upvotes - downvotes)

**Response (200 OK):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "title": "Most Popular Post",
      "upvotes": 150,
      "downvotes": 10,
      "score": 140,
      "createdAt": "2024-12-15T00:00:00.000Z"
    }
  ]
}
```

**Screenshots:** 
![Popular Posts](screenshots/post_popular.png)

--- -->

<!-- ### 11. Get Trending Posts
**Endpoint:** `GET {{base_url}}/posts/trending`  
**Authentication:** None  
**Description:** Get trending posts based on recent engagement

**Response (200 OK):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "title": "Trending Post",
      "upvotes": 50,
      "comments": 25,
      "trendingScore": 75,
      "createdAt": "2024-12-19T00:00:00.000Z"
    }
  ]
}
```

**Screenshots:** 
![Trending Posts](screenshots/post_trending.png)

--- -->

<!-- ### 12. Get User Drafts
**Endpoint:** `GET {{base_url}}/posts/user/drafts`  
**Authentication:** Required  
**Description:** Get current user's draft posts

**Response (200 OK):**
```json
{
  "drafts": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "title": "Draft Post",
      "content": "Draft content",
      "status": "draft",
      "createdAt": "2024-12-19T00:00:00.000Z"
    }
  ]
}
```

**Screenshots:** 
![User Drafts](screenshots/post_drafts.png)

--- -->

<!-- ### 13. Summarize Post (AI)
**Endpoint:** `POST {{base_url}}/posts/:id/summarize`  
**Authentication:** None  
**Description:** Generate AI summary of post content using OpenAI

**Example:** `POST /api/posts/507f1f77bcf86cd799439012/summarize`

**Response (200 OK):**
```json
{
  "summary": "This post discusses the basics of JavaScript programming, covering variables, functions, and control structures. The author provides practical examples for beginners.",
  "postId": "507f1f77bcf86cd799439012"
}
```

**Error Response (if OpenAI not configured):**
```json
{
  "error": "OpenAI API key not configured"
}
```

**Screenshots:** 
![AI Summarize Post Request](screenshots/post_summarize_request.png)
![AI Summarize Post Response](screenshots/post_summarize_response.png)

--- -->

<!-- ## Comments

### 1. Create Comment
**Endpoint:** `POST {{base_url}}/comments`  
**Authentication:** Required  
**Description:** Create a comment on a post or reply to another comment

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "content": "Great post! Very informative.",
  "post": "507f1f77bcf86cd799439012",
  "parentComment": null
}
```

**Parameters:**
- `content`: (required) Comment text
- `post`: (required) Post ID
- `parentComment`: (optional) Parent comment ID for replies

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "content": "Great post! Very informative.",
  "author": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe"
  },
  "post": "507f1f77bcf86cd799439012",
  "parentComment": null,
  "upvotes": 0,
  "downvotes": 0,
  "createdAt": "2024-12-19T00:00:00.000Z"
}
```

**Screenshots:** 
![Create Comment Request](screenshots/comment_create_request.png)
![Create Comment Response](screenshots/comment_create_response.png)

--- -->

<!-- ### 2. Get Comments by Post
**Endpoint:** `GET {{base_url}}/comments/post/:postId`  
**Authentication:** None  
**Description:** Get all top-level comments for a post

**Example:** `GET /api/comments/post/507f1f77bcf86cd799439012`

**Response (200 OK):**
```json
{
  "comments": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "content": "Great post!",
      "author": {
        "username": "johndoe"
      },
      "upvotes": 5,
      "downvotes": 0,
      "replies": 2,
      "createdAt": "2024-12-19T00:00:00.000Z"
    }
  ]
}
```

**Screenshots:** 
![Get Comments by Post](screenshots/comment_by_post.png)

--- -->
<!-- 
### 3. Get Replies by Comment
**Endpoint:** `GET {{base_url}}/comments/:commentId/replies`  
**Authentication:** None  
**Description:** Get all replies to a specific comment

**Example:** `GET /api/comments/507f1f77bcf86cd799439014/replies`

**Response (200 OK):**
```json
{
  "replies": [
    {
      "_id": "507f1f77bcf86cd799439019",
      "content": "I agree!",
      "author": {
        "username": "janedoe"
      },
      "parentComment": "507f1f77bcf86cd799439014",
      "upvotes": 2,
      "createdAt": "2024-12-19T00:30:00.000Z"
    }
  ]
}
```

**Screenshots:** 
![Get Comment Replies](screenshots/comment_replies.png)

--- -->
<!-- 
### 4. Update Comment
**Endpoint:** `PUT {{base_url}}/comments/:id`  
**Authentication:** Required (Must be author)  
**Description:** Update a comment

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "content": "Updated comment content",
  "updatedAt": "2024-12-19T01:00:00.000Z"
}
```

**Screenshots:** 
![Update Comment](screenshots/comment_update.png)

--- -->

<!-- ### 5. Delete Comment
**Endpoint:** `DELETE {{base_url}}/comments/:id`  
**Authentication:** Required (Must be author)  
**Description:** Delete a comment

**Response (200 OK):**
```json
{
  "message": "Comment deleted successfully"
}
```

**Screenshots:** 
![Delete Comment](screenshots/comment_delete.png)

--- -->

<!-- ### 6. Upvote Comment
**Endpoint:** `PUT {{base_url}}/comments/:id/upvote`  
**Authentication:** Required  
**Description:** Upvote a comment (toggle)

**Response (200 OK):**
```json
{
  "message": "Comment upvoted successfully",
  "upvotes": 6,
  "downvotes": 0,
  "userVote": "upvote"
}
```

**Screenshots:** 
![Upvote Comment](screenshots/comment_upvote.png)

--- -->

<!-- ### 7. Downvote Comment
**Endpoint:** `PUT {{base_url}}/comments/:id/downvote`  
**Authentication:** Required  
**Description:** Downvote a comment (toggle)

**Response (200 OK):**
```json
{
  "message": "Comment downvoted successfully",
  "upvotes": 5,
  "downvotes": 1,
  "userVote": "downvote"
}
```

**Screenshots:** 
![Downvote Comment](screenshots/comment_downvote.png)

--- -->

<!-- ### 8. Get All Comments
**Endpoint:** `GET {{base_url}}/comments`  
**Authentication:** None  
**Description:** Get all comments (admin/testing)

**Response (200 OK):**
```json
{
  "comments": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "content": "Great post!",
      "author": {
        "username": "johndoe"
      },
      "post": "507f1f77bcf86cd799439012",
      "createdAt": "2024-12-19T00:00:00.000Z"
    }
  ]
}
```

**Screenshots:** 
![Get All Comments](screenshots/comment_list.png)

--- -->

## Search

### 1. Global Search
**Endpoint:** `GET {{base_url}}/search?q=search_term`  
**Authentication:** None  
**Description:** Search across posts, communities, and users

**Query Parameters:**
- `q`: Search query string

**Example:** `GET /api/search?q=javascript`

**Response (200 OK):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "JavaScript Best Practices",
      "author": {
        "username": "johndoe"
      }
    }
  ],
  "communities": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "JavaScript",
      "members": 150
    }
  ],
  "users": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "username": "javascriptfan",
      "karma": 200
    }
  ]
}
```

**Screenshots:** 
![Global Search Request](screenshots/search_global_request.png)
![Global Search Response](screenshots/search_global_response.png)

---

## Upload

### 1. Upload Image
**Endpoint:** `POST {{base_url}}/uploads/image`  
**Authentication:** Required  
**Description:** Upload an image file using GridFS

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
image: [file]
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "filename": "profile-picture.jpg",
  "contentType": "image/jpeg",
  "length": 45678,
  "uploadDate": "2024-12-19T00:00:00.000Z",
  "url": "/api/uploads/image/507f1f77bcf86cd799439021"
}
```

**Screenshots:** 
![Upload Image Request](screenshots/upload_image_request.png)
![Upload Image Response](screenshots/upload_image_response.png)

---

### 2. Get Image
**Endpoint:** `GET {{base_url}}/uploads/image/:id`  
**Authentication:** None  
**Description:** Retrieve an uploaded image

**Example:** `GET /api/uploads/image/507f1f77bcf86cd799439021`

**Response (200 OK):**
- Returns the image file with appropriate Content-Type header

**Screenshots:** 
![Get Image](screenshots/upload_get_image.png)

---

### 3. Delete Image
**Endpoint:** `DELETE {{base_url}}/uploads/image/:id`  
**Authentication:** Required  
**Description:** Delete an uploaded image

**Example:** `DELETE /api/uploads/image/507f1f77bcf86cd799439021`

**Response (200 OK):**
```json
{
  "message": "Image deleted successfully"
}
```

**Screenshots:** 
![Delete Image](screenshots/upload_delete_image.png)

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found",
  "statusCode": 404
}
```

### 409 Conflict
```json
{
  "error": "Conflict",
  "message": "Resource already exists",
  "statusCode": 409
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong",
  "statusCode": 500
}
```

---

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The token is obtained from the `/api/auth/login` or `/api/auth/register` endpoints.

---


