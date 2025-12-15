# RichTextEditor Component

A reusable, professional rich text editor component for Loopify. Features a toolbar with formatting options and a contentEditable area for text input.

## Features

- **Formatting Options**: Bold, Italic, Strikethrough, Superscript, Link, Image, Lists, Code, Quote, Table
- **Dark Theme**: Matches Loopify's design system
- **Professional SVG Icons**: Clean, consistent icons from Reddit's design
- **Keyboard Support**: `onMouseDown` handlers prevent focus loss during formatting
- **Placeholder Support**: Custom placeholder text via `data-placeholder` attribute
- **Responsive**: Works on desktop and mobile devices

## Usage

```jsx
import RichTextEditor from "@/components/Global/RichTextEditor";

function MyComponent() {
    const [content, setContent] = useState("");

    return (
        <RichTextEditor 
            value={content}
            onChange={setContent}
            placeholder="Enter your text here..."
        />
    );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | - | The current HTML content of the editor |
| `onChange` | function | - | Callback function that receives the updated HTML content |
| `placeholder` | string | "Body text (optional)" | Placeholder text shown when editor is empty |

## Formatting Commands

The component supports all standard `document.execCommand()` commands:

- `bold` - Bold text
- `italic` - Italic text
- `strikethrough` - Strikethrough text
- `superscript` - Superscript text
- `createLink` - Create hyperlink
- `insertImage` - Insert image
- `insertUnorderedList` - Bulleted list
- `insertOrderedList` - Numbered list
- `insertHTML` - Insert HTML (code, tables, etc.)
- `formatBlock` - Block formatting (quotes, headings, etc.)

## Styling

All styles are contained in `richTextEditor.css`. Customize colors and sizes by modifying the CSS variables:

- `.rich-text-editor-wrapper` - Container
- `.rte-toolbar` - Formatting toolbar
- `.rte-btn` - Toolbar buttons
- `.rte-content` - Editor content area

## Integration with Create Post Page

The RichTextEditor is used in `Create.jsx` to provide a professional post creation interface:

```jsx
<RichTextEditor 
    value={bodyText}
    onChange={setBodyText}
    placeholder="Body text (optional)"
/>
```

## Browser Compatibility

Works in all modern browsers that support:
- `contentEditable`
- `document.execCommand()`
- ES6+ JavaScript

## Example

See [Create.jsx](../../pages/Create/Create.jsx) for a complete implementation example.
