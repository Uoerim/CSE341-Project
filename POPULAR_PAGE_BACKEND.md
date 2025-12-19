# Popular Page Backend Implementation

## Overview
The Popular page backend provides Reddit-style post sorting algorithms to surface trending and high-quality content.

## API Endpoint

### GET /api/posts/popular

Returns sorted posts based on various engagement algorithms.

**Query Parameters:**
- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 10) - Number of posts per page
- `sort` (string, default: "best") - Sorting algorithm
  - `best` - Balanced score for high-quality recent posts
  - `hot` - Trending posts based on recent engagement
  - `new` - Newest posts first
  - `top` - Highest upvoted posts
  - `rising` - Fast-growing posts from last 24 hours
- `time` (string, optional) - Time filter for "top" and "hot" sorts
  - `now` - Last hour
  - `today` - Last 24 hours
  - `week` - Last 7 days
  - `month` - Last 30 days
  - `year` - Last 365 days
  - `all` - All time
- `exclude` (string, optional) - Comma-separated post IDs to exclude

**Response:**
```json
{
  "posts": [
    {
      "_id": "post_id",
      "title": "Post title",
      "content": "Post content",
      "author": {
        "_id": "user_id",
        "username": "username",
        "avatar": "avatar_url"
      },
      "community": {
        "_id": "community_id",
        "name": "community_name"
      },
      "upvotes": ["user_id1", "user_id2", ...],
      "downvotes": ["user_id3", ...],
      "comments": ["comment_id1", ...],
      "status": "published",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 60,
    "pages": 6,
    "hasMore": true
  }
}
```

## Sorting Algorithms

### Best (Default)
**Formula:** `(upvotes × 0.7) + (comments × 0.3) - age_penalty`
- **Time Window:** Last 7 days
- **Purpose:** Surfaces high-quality recent posts with good discussion
- **Age Penalty:** 0.5 points per day
- **Use Case:** Default homepage feed

### Hot
**Formula:** `(upvotes - downvotes) / (age_hours + 2)^1.5`
- **Purpose:** Trending posts based on recent engagement velocity
- **Decay:** Exponential decay with age (1.5 power)
- **Use Case:** Real-time trending content

### New
**Sort:** `createdAt DESC`
- **Purpose:** Newest posts first
- **Use Case:** Discovering fresh content

### Top
**Sort:** `upvotes.length DESC, createdAt DESC`
- **Time Filter:** Supports time filtering (now/today/week/month/year/all)
- **Purpose:** Most upvoted posts in time window
- **Use Case:** Historical best content

### Rising
**Formula:** `upvotes / (age_hours + 1)`
- **Time Window:** Last 24 hours only
- **Purpose:** Fast-growing posts with high velocity
- **Use Case:** Early discovery of viral content

## Data Model

Posts use the following schema for engagement:
```javascript
{
  upvotes: [{ type: ObjectId, ref: "User" }],     // Array of user IDs
  downvotes: [{ type: ObjectId, ref: "User" }],   // Array of user IDs
  comments: [{ type: ObjectId, ref: "Comment" }]  // Array of comment IDs
}
```

Vote counts are calculated as `upvotes.length` and `downvotes.length`.

## Seeding Test Data

To populate the database with test posts:

```bash
cd server
node src/utils/seedPopularPosts.js
```

This will:
- Create 60 diverse posts with varied engagement levels
- Distribute posts across different time periods (1 hour to 30 days old)
- Generate realistic engagement patterns:
  - 20% hot posts (recent + high engagement)
  - 20% rising posts (very recent + growing engagement)
  - 20% top posts (high total upvotes)
  - 20% moderate engagement
  - 20% low engagement
- Clear existing posts (optional - comment out the delete line to keep existing data)

## Implementation Files

### Backend
- `server/src/routes/post.routes.js` - Route definition
- `server/src/controllers/post.controller.js` - Sorting logic (getPopularPosts function)
- `server/src/utils/seedPopularPosts.js` - Test data seeding script

### Frontend
- `client/src/pages/Popular/Popular.jsx` - UI component
- `client/src/pages/Popular/popular.css` - Reddit-style styling

## Example Requests

```bash
# Get best posts (default)
curl http://localhost:5000/api/posts/popular

# Get hot posts from today
curl http://localhost:5000/api/posts/popular?sort=hot&time=today

# Get top posts this week
curl http://localhost:5000/api/posts/popular?sort=top&time=week

# Get rising posts
curl http://localhost:5000/api/posts/popular?sort=rising

# Get new posts with pagination
curl http://localhost:5000/api/posts/popular?sort=new&page=2&limit=20

# Exclude already-loaded posts
curl http://localhost:5000/api/posts/popular?exclude=post_id1,post_id2
```

## Notes

- The `exclude` parameter is used for infinite scroll to prevent duplicate posts
- Posts must have `status: "published"` to appear in results
- Time filters only apply to "top" and "hot" sorting modes
- All algorithms use in-memory sorting after database fetch for flexibility
- Vote counts are calculated from array lengths, not stored as separate fields
