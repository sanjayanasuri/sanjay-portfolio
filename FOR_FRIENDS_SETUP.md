# For Friends Section Setup

## Notion Database Setup

Create a new database in Notion called "For Friends" with the following properties:

### Required Properties:

1. **Title** (Title type)
   - The name/title of the item (e.g., "Song of the Week", "DJ Set I Loved")

2. **Type** (Select type)
   - Options: Song, Video, Idea, Person, Book, Article, Playlist, Other
   - This determines the icon and category

3. **URL** (URL type) or **Link** (Text type)
   - Spotify links: `https://open.spotify.com/playlist/...` or `https://open.spotify.com/track/...`
   - YouTube links: `https://www.youtube.com/watch?v=...` or `https://youtu.be/...`
   - Any other links you want to share

4. **Description** (Text type) or **Why** (Text type)
   - Write about why you like it, what stood out, etc.
   - Example: "I really liked the speech at the beginning of this DJ set"

5. **Date** (Date type) - Optional
   - When you discovered/liked this
   - Used for sorting (newest first)

### Optional Properties:

6. **Image** (Files & media type)
   - Add a cover image if you want
   - Works great for visual items

7. **Tags** (Multi-select type)
   - Add tags like "weekly", "favorite", "recommendation", etc.

## Environment Variable

Add to your `.env.local`:
```
NOTION_FOR_FRIENDS_DB_ID=your-database-id-here
```

To get the database ID:
1. Open your "For Friends" database in Notion
2. Click the "..." menu in the top right
3. Click "Copy link"
4. The ID is the long string between `/` and `?` in the URL

## Example Entries

### Song of the Week
- **Title**: "Song of the Week: [Song Name]"
- **Type**: Song
- **URL**: `https://open.spotify.com/track/...`
- **Description**: "This track has been on repeat all week because..."

### Video Recommendation
- **Title**: "DJ Set with Amazing Speech"
- **Type**: Video
- **URL**: `https://www.youtube.com/watch?v=...`
- **Description**: "I really liked the speech at the beginning of this DJ set. It talks about..."

### Idea
- **Title**: "Idea: [Your Idea]"
- **Type**: Idea
- **URL**: (optional link to article/blog post)
- **Description**: "I've been thinking about..."

## Features

- **Spotify Integration**: Playlists, albums, and tracks embed automatically
- **YouTube Integration**: Videos embed directly in cards
- **Type Filtering**: Filter by Song, Video, Idea, Person, etc.
- **Date Sorting**: Newest items appear first
- **Rich Descriptions**: Write about why you like each thing
- **Images**: Add cover images to make cards more visual

## Tips

- Use the **Type** field to create categories like "Song of the Week", "Video of the Week"
- Add **Tags** to group related items
- Use **Date** to track when you discovered things
- Write personal **Descriptions** to share your thoughts and personality!

