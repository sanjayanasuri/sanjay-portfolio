# For Employers / Projects Section Setup

## Notion Database Setup

Create a new database in Notion called "Projects" (or "For Employers Projects") with the following properties:

### Required Properties:

1. **Name** (Title type) or **Title** (Title type)
   - The name of your project (e.g., "DJ-Assistant", "Drug-Discovery", "AgentLens")
   - This will be displayed as the tooltip when hovering over project icons

2. **Repository** (URL type) or **Repo** (URL type) or **GitHub** (URL type)
   - The GitHub repository URL (e.g., `https://github.com/sanjayanasuri/DJ-Assistant`)
   - **Required** - Projects without a repository URL won't be displayed

### Optional Properties (for future features):

3. **Screenshot** (Files & media type) or **Image** (Files & media type)
   - Add a screenshot/thumbnail image for the project
   - If provided, this will be displayed instead of the default GitHub icon
   - Recommended size: 64x64px or square aspect ratio

4. **Demo** (URL type) or **Live** (URL type) or **DemoURL** (URL type)
   - Link to a live demo of the project
   - Future: This will be used for clickable live demos

5. **Video** (URL type) or **Video** (Files & media type)
   - Link to a video demo or upload a video file
   - Future: This will be used for video previews

6. **Description** (Text type) or **About** (Text type)
   - Brief description of the project
   - Future: This will be shown in expanded project views

7. **Order** (Number type) or **Sort** (Number type)
   - Optional: Number to control the display order (lower numbers first)
   - If not provided, projects will appear in the order they appear in Notion

8. **Tags** (Multi-select type)
   - Optional: Add tags like "featured", "web", "ml", "data-science", etc.
   - Future: Can be used for filtering

## Environment Variable

Add to your `.env.local`:
```
NOTION_PROJECTS_DB_ID=your-database-id-here
```

To get the database ID:
1. Open your "Projects" database in Notion
2. Click the "..." menu in the top right
3. Click "Copy link"
4. The ID is the long string between `/` and `?` in the URL
   - Example: `https://www.notion.so/abc123def456?view=...` → `abc123def456`
   - Remove any hyphens if present

## Share Database with Integration

1. Open your Projects database in Notion
2. Click the "..." menu in the top right
3. Click "Add connections" or "Connections"
4. Select your Notion integration (the same one used for Posts/For Friends)
5. Make sure the integration has access to the database

## Example Entries

### Project 1: DJ-Assistant
- **Name**: "DJ-Assistant"
- **Repository**: `https://github.com/sanjayanasuri/DJ-Assistant`
- **Screenshot**: (optional - upload a project screenshot)
- **Demo**: (optional - `https://dj-assistant-demo.vercel.app`)
- **Description**: "AI-powered DJ assistant for music selection"
- **Order**: 1

### Project 2: Drug-Discovery
- **Name**: "Drug-Discovery"
- **Repository**: `https://github.com/sanjayanasuri/Drug-Discovery`
- **Screenshot**: (optional)
- **Order**: 2

### Project 3: AgentLens
- **Name**: "AgentLens"
- **Repository**: `https://github.com/sanjayanasuri/AgentLens`
- **Screenshot**: (optional)
- **Order**: 3

## Current Features

✅ **Project Icons**: Small clickable icons that link to GitHub repositories  
✅ **Screenshots**: If you add a screenshot image, it will be displayed instead of the default GitHub icon  
✅ **Dynamic Loading**: Projects are fetched from Notion and automatically displayed  
✅ **Error Handling**: Page gracefully handles missing database or connection issues  

## Future Features (Coming Soon)

🔜 **Live Demos**: Clickable project cards that expand to show live demos  
🔜 **Video Previews**: Embedded video demos for projects  
🔜 **Project Details**: Expanded views with descriptions, screenshots, and more  
🔜 **Filtering**: Filter projects by tags or categories  

## Tips

- **Screenshots**: Use square images (64x64px or larger) for best results
- **Order**: Use the Order property to control which projects appear first
- **Repository URL**: Make sure the Repository URL is a valid GitHub link
- **Testing**: After adding projects, wait up to 60 seconds for ISR to refresh, or manually revalidate

## Troubleshooting

### Projects not showing up?
1. Check that `NOTION_PROJECTS_DB_ID` is set in `.env.local`
2. Verify the database ID is correct (no hyphens, correct format)
3. Make sure the integration has access to the database
4. Ensure at least one project has a Repository URL set
5. Check the browser console for errors
6. Restart your dev server after adding the environment variable

### Wrong order?
- Add an "Order" property (Number type) to your database
- Set lower numbers for projects you want to appear first

### Screenshots not showing?
- Make sure the Screenshot/Image property is of type "Files & media"
- Upload an image file (not just a URL)
- Check that the image URL is accessible

