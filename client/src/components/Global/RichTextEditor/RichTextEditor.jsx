import React, { useRef, useState } from "react";
import "./richTextEditor.css";

function RichTextEditor({ value, onChange, placeholder = "Body text (optional)" }) {
    const editorRef = useRef(null);
    const imageInputRef = useRef(null);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkText, setLinkText] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    const handleFormatting = (command, customValue = null) => {
        document.execCommand(command, false, customValue);
        editorRef.current?.focus();
    };

    const handleBold = (e) => {
        e.preventDefault();
        handleFormatting("bold");
    };

    const handleItalic = (e) => {
        e.preventDefault();
        handleFormatting("italic");
    };

    const handleStrikethrough = (e) => {
        e.preventDefault();
        handleFormatting("strikethrough");
    };

    const handleSuperscript = (e) => {
        e.preventDefault();
        handleFormatting("superscript");
    };

    const handleLink = (e) => {
        e.preventDefault();
        setShowLinkModal(true);
    };

    const handleSaveLink = () => {
        if (linkUrl.trim()) {
            const text = linkText.trim() || linkUrl;
            document.execCommand("createLink", false, linkUrl);
            setLinkText("");
            setLinkUrl("");
            setShowLinkModal(false);
            editorRef.current?.focus();
        }
    };

    const handleCancelLink = () => {
        setLinkText("");
        setLinkUrl("");
        setShowLinkModal(false);
    };

    const handleImage = (e) => {
        e.preventDefault();
        imageInputRef.current?.click();
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result;
                if (imageUrl) {
                    const imageHTML = `<img src="${imageUrl}" alt="Uploaded image" class="rte-inline-image" /><br /><input type="text" class="rte-image-caption" placeholder="Add a caption" /><br />`;
                    document.execCommand("insertHTML", false, imageHTML);
                    editorRef.current?.focus();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUnorderedList = (e) => {
        e.preventDefault();
        handleFormatting("insertUnorderedList");
    };

    const handleOrderedList = (e) => {
        e.preventDefault();
        handleFormatting("insertOrderedList");
    };

    const handleCode = (e) => {
        e.preventDefault();
        handleFormatting("insertHTML", "<code>");
    };

    const handleQuote = (e) => {
        e.preventDefault();
        handleFormatting("formatBlock", "<blockquote>");
    };

    const handleTable = (e) => {
        e.preventDefault();
        handleFormatting("insertHTML", "<table><tr><td>Cell</td></tr></table>");
    };

    return (
        <div className="rich-text-editor-wrapper">
            <div className="rte-toolbar">
                <button 
                    className="rte-btn rte-bold"
                    title="Bold"
                    onMouseDown={handleBold}
                >
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.744 10.998c.524.654.79 1.47.797 2.446 0 .889-.224 1.68-.673 2.37-.449.69-1.076 1.228-1.882 1.611-.806.383-1.734.575-2.782.575H7.003a2.004 2.004 0 01-2.004-2.004V4.004C4.999 2.897 5.896 2 7.003 2H9.88c1.114 0 2.083.175 2.907.526.824.351 1.455.833 1.893 1.448.438.615.66 1.313.667 2.094a4.325 4.325 0 01-.494 1.958A4.405 4.405 0 0113.6 9.55c.904.311 1.618.794 2.142 1.448h.002zM8.102 4.701V8.66h2.061c.427 0 .805-.085 1.134-.255.329-.17.584-.407.765-.711.181-.304.271-.654.271-1.052 0-.607-.208-1.083-.624-1.426-.416-.343-1.003-.515-1.763-.515H8.102zm3.038 10.598c.477 0 .891-.089 1.242-.266.351-.177.618-.425.803-.743.185-.318.277-.683.277-1.096 0-.665-.235-1.179-.705-1.54s-1.081-.542-1.833-.542h-2.82v4.187h3.036z"></path>
                    </svg>
                </button>
                <button 
                    className="rte-btn rte-italic"
                    title="Italic"
                    onMouseDown={handleItalic}
                >
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.35 4c0 .75-.6 1.35-1.35 1.35-.75 0-1.35-.6-1.35-1.35 0-.75.6-1.35 1.35-1.35.75 0 1.35.6 1.35 1.35zM9.9 16.01c-.15-.1-.22-.26-.22-.49 0-.09 0-.16.02-.21l1.43-7.13a.976.976 0 00-.96-1.17c-.47 0-.87.33-.96.78l-1.45 7.12c-.07.32-.1.64-.1.95 0 .62.18 1.12.54 1.5.22.23.54.42.94.56.1.03.19.05.29.05.4 0 .78-.26.92-.67.27-.71-.18-1.16-.45-1.29z"></path>
                    </svg>
                </button>
                <button 
                    className="rte-btn rte-strikethrough"
                    title="Strikethrough"
                    onMouseDown={handleStrikethrough}
                >
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.83 7.435a4.11 4.11 0 01-.26-1.473 3.906 3.906 0 01.547-2.077A3.65 3.65 0 017.647 2.5a5.027 5.027 0 012.267-.489 4.888 4.888 0 012.837.8c.46.312.866.698 1.2 1.143a.79.79 0 01-.366 1.188 1.391 1.391 0 01-1.43-.457 3.435 3.435 0 00-.968-.674A3 3 0 008.7 4c-.37.171-.686.442-.912.782A2.132 2.132 0 007.441 6a2.299 2.299 0 00.454 1.441L5.83 7.435zM18 8.998H2a.9.9 0 100 1.799h8.4c.3.116.565.227.791.332.469.23.89.545 1.243.928a2.199 2.199 0 01.611 1.583c.005.478-.134.947-.4 1.345a2.74 2.74 0 01-1.068.938 3.243 3.243 0 01-2.9-.005 3.447 3.447 0 01-1.126-.928 4.062 4.062 0 01-.34-.5.951.951 0 10-1.632.975 5.666 5.666 0 002.344 2.043c.701.334 1.47.505 2.246.5a5.052 5.052 0 002.353-.562 4.48 4.48 0 001.743-1.578 4.136 4.136 0 00.653-2.288 3.628 3.628 0 00-.781-2.39 6.709 6.709 0 00-.351-.39h4.213a.902.902 0 000-1.802z"></path>
                    </svg>
                </button>
                <button 
                    className="rte-btn rte-superscript"
                    title="Superscript"
                    onMouseDown={handleSuperscript}
                >
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.215 9.992v.086l4.314 6.384a.958.958 0 01-1.247 1.377.955.955 0 01-.345-.318L6.992 11.5h-.086l-3.944 6.021a.955.955 0 01-1.755-.574.957.957 0 01.162-.485l4.314-6.384v-.086L1.388 3.549a.908.908 0 111.517-.997l4 6.174h.086l4-6.174a.909.909 0 111.517.997L8.215 9.992zm10.12-2.807h-1.109l-.54.022.68-.843c.27-.331.471-.593.62-.8.153-.218.28-.453.38-.7a2.11 2.11 0 00.155-.8 1.9 1.9 0 00-.29-1.042 1.965 1.965 0 00-.8-.7 2.4 2.4 0 00-1.14-.25 2.575 2.575 0 00-1.218.282c-.348.183-.637.46-.835.8a2.472 2.472 0 00-.238.712.693.693 0 00.15.578.8.8 0 00.616.281 1.08 1.08 0 00.943-.8.616.616 0 01.235-.253.687.687 0 01.342-.09.611.611 0 01.424.161.532.532 0 01.158.403.988.988 0 01-.1.43c-.079.169-.174.33-.284.48-.117.16-.274.365-.467.6-.119.148-.208.259-.265.334l-1.368 1.701A.622.622 0 0014.87 8.7h3.466a.758.758 0 000-1.515z"></path>
                    </svg>
                </button>
                <div className="rte-divider"></div>
                <button 
                    className="rte-btn rte-link"
                    title="Link"
                    onMouseDown={handleLink}
                >
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.088 11.843a.9.9 0 01-.637-1.536l1.97-1.971a2.66 2.66 0 000-3.757c-1.003-1.003-2.754-1.005-3.756 0L9.694 6.55A.9.9 0 118.42 5.278l1.97-1.971a4.427 4.427 0 013.152-1.306c1.19 0 2.31.463 3.152 1.305a4.463 4.463 0 010 6.303l-1.971 1.971a.897.897 0 01-.637.264v-.001zm-4.48 4.851l1.97-1.97a.9.9 0 10-1.273-1.272l-1.97 1.97c-1.003 1.004-2.755 1.002-3.757 0a2.66 2.66 0 010-3.757l1.97-1.971a.898.898 0 000-1.272.901.901 0 00-1.272 0l-1.971 1.971a4.463 4.463 0 000 6.303 4.43 4.43 0 003.152 1.305c1.19 0 2.31-.465 3.151-1.307zm-.747-4.282l3.55-3.55a.9.9 0 10-1.272-1.273l-3.551 3.55a.9.9 0 00.637 1.537.9.9 0 00.637-.263l-.001-.001z"></path>
                    </svg>
                </button>
                <button 
                    className="rte-btn rte-image"
                    title="Image"
                    onMouseDown={handleImage}
                >
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.6 2H5.4A3.4 3.4 0 002 5.4v9.2A3.4 3.4 0 005.4 18h9.2a3.4 3.4 0 003.4-3.4V5.4A3.4 3.4 0 0014.6 2zM5.4 3.8h9.2c.882 0 1.6.718 1.6 1.6v9.2c0 .484-.22.913-.561 1.207l-5.675-5.675a3.39 3.39 0 00-2.404-.996c-.87 0-1.74.332-2.404.996L3.8 11.488V5.4c0-.882.718-1.6 1.6-1.6zM3.8 14.6v-.567l2.629-2.628a1.59 1.59 0 011.131-.469c.427 0 .829.166 1.131.469l4.795 4.795H5.4c-.882 0-1.6-.718-1.6-1.6zm6.95-7.1a1.75 1.75 0 113.5 0 1.75 1.75 0 01-3.5 0z"></path>
                    </svg>
                </button>
                <div className="rte-divider"></div>
                <button 
                    className="rte-btn rte-bulleted-list"
                    title="Bullet List"
                    onMouseDown={handleUnorderedList}
                >
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 2.45c-.86 0-1.55.69-1.55 1.55 0 .86.69 1.55 1.55 1.55.86 0 1.55-.69 1.55-1.55 0-.86-.69-1.55-1.55-1.55zM4 8.45c-.86 0-1.55.69-1.55 1.55 0 .86.69 1.55 1.55 1.55.86 0 1.55-.69 1.55-1.55 0-.86-.69-1.55-1.55-1.55zM4 14.45c-.86 0-1.55.69-1.55 1.55 0 .86.69 1.55 1.55 1.55.86 0 1.55-.69 1.55-1.55 0-.86-.69-1.55-1.55-1.55zM9 4.9h8c.5 0 .9-.4.9-.9s-.4-.9-.9-.9H9c-.5 0-.9.4-.9.9s.4.9.9.9zM17 15.1H9c-.5 0-.9.4-.9.9s.4.9.9.9h8c.5 0 .9-.4.9-.9s-.4-.9-.9-.9zM17 9.1H9c-.5 0-.9.4-.9.9s.4.9.9.9h8c.5 0 .9-.4.9-.9s-.4-.9-.9-.9z"></path>
                    </svg>
                </button>
                <button 
                    className="rte-btn rte-numbered-list"
                    title="Number List"
                    onMouseDown={handleOrderedList}
                >
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.1 4a.9.9 0 01.9-.9h7.999a.9.9 0 010 1.8h-8a.9.9 0 01-.9-.9zM17 15.1H9a.9.9 0 000 1.8h8a.9.9 0 000-1.8zm0-6H9a.9.9 0 000 1.8h8a.9.9 0 000-1.8zM3.18 4.12l.025-.012v3.026a.817.817 0 001.632 0v-4.58a.504.504 0 00-.712-.459l-1.537.702a.726.726 0 00-.094 1.266.723.723 0 00.688.055l-.001.001zm2.09 12.361l-.32.002a4.928 4.928 0 00-.937.091l-.024-.055a4.454 4.454 0 001.47-1.267l.039-.051a2.95 2.95 0 00.337-.622c.093-.232.14-.477.14-.726 0-.352-.09-.669-.267-.943a1.77 1.77 0 00-.723-.641 2.225 2.225 0 00-1.002-.221c-.432.013-.805.089-1.127.27-.32.181-.57.428-.736.727l-.03.056a.794.794 0 00.13.916c.247.259.615.319.963.156a.652.652 0 00.328-.365l.02-.048a.423.423 0 01.167-.179c.168-.101.436-.085.572.048a.383.383 0 01.114.296.644.644 0 01-.08.329c-.416.74-.962 1.252-1.445 1.705a8.287 8.287 0 00-.662.668.786.786 0 00-.107.843.815.815 0 00.744.481h2.434a.733.733 0 000-1.468l.002-.002z"></path>
                    </svg>
                </button>
                <button 
                    className="rte-btn rte-code"
                    title="Code"
                    onMouseDown={handleCode}
                >
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.704 17a.9.9 0 01-.88-1.087l2.594-12.201a.9.9 0 111.759.374L9.583 16.287a.9.9 0 01-.879.713zm-2.567-1.764a.898.898 0 000-1.272L2.173 10l3.964-3.964a.9.9 0 10-1.273-1.272l-4.6 4.599a.898.898 0 000 1.272l4.6 4.6a.897.897 0 001.274 0l-.001.001zm9 0l4.6-4.6a.898.898 0 000-1.272l-4.6-4.6a.9.9 0 10-1.273 1.272L17.828 10l-3.964 3.964a.898.898 0 00.637 1.536c.231 0 .46-.088.636-.264z"></path>
                    </svg>
                </button>
                <button 
                    className="rte-btn rte-quote"
                    title="Quote"
                    onMouseDown={handleQuote}
                >
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.045 16.93a2.888 2.888 0 002.885-2.884v-2.091a2.888 2.888 0 00-2.885-2.884h-2.09c-.109 0-.213.019-.318.032a1.68 1.68 0 00-.81.376l-.076-.068.394-1.079c.722-2.288 2.69-3.354 2.792-3.407a.9.9 0 00-.82-1.602c-.165.084-4.044 2.114-4.044 6.731v3.993a2.888 2.888 0 002.884 2.884l2.088-.001zm-3.175-4.975c0-.598.486-1.084 1.084-1.084h2.09c.598 0 1.085.486 1.085 1.084v2.091c0 .598-.487 1.084-1.085 1.084h-2.09a1.085 1.085 0 01-1.084-1.084v-2.091zM6.045 16.93a2.888 2.888 0 002.885-2.884v-2.091a2.888 2.888 0 00-2.885-2.884h-2.09c-.109 0-.213.019-.318.032a1.68 1.68 0 00-.81.376l-.076-.068.394-1.079c.722-2.288 2.69-3.354 2.792-3.407a.9.9 0 00-.82-1.602c-.165.084-4.044 2.114-4.044 6.731v3.993a2.888 2.888 0 002.884 2.884l2.088-.001zM2.87 11.955c0-.598.486-1.084 1.084-1.084h2.09c.598 0 1.085.486 1.085 1.084v2.091c0 .598-.487 1.084-1.085 1.084h-2.09a1.085 1.085 0 01-1.084-1.084v-2.091z"></path>
                    </svg>
                </button>
                <button 
                    className="rte-btn rte-table"
                    title="Table"
                    onMouseDown={handleTable}
                >
                    <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 5.3C18 3.48 16.52 2 14.7 2H5.3C3.48 2 2 3.48 2 5.3v9.4C2 16.52 3.48 18 5.3 18h9.4c1.82 0 3.3-1.48 3.3-3.3V5.3zm-3.3-1.5c.83 0 1.5.67 1.5 1.5v9.2c0 .484-.22.913-.561 1.207l-5.675-5.675a3.39 3.39 0 00-2.404-.996c-.87 0-1.74.332-2.404.996L3.8 11.488V5.3c0-.882.718-1.6 1.6-1.6zM3.8 14.7V9h3.4v7.2H5.3c-.83 0-1.5-.67-1.5-1.5zm12.4 0c0 .83-.67 1.5-1.5 1.5H9V9h7.2v5.7z"></path>
                    </svg>
                </button>
            </div>

            <div
                ref={editorRef}
                className="rte-content"
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => onChange(e.currentTarget.innerHTML)}
                data-placeholder={placeholder}
            />

            {/* Hidden file input for image upload */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: "none" }}
            />

            {/* Add Link Modal */}
            {showLinkModal && (
                <div className="rte-modal-overlay" onClick={handleCancelLink}>
                    <div className="rte-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="rte-modal-header">
                            <h2>Add Link</h2>
                            <button
                                className="rte-modal-close"
                                onClick={handleCancelLink}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="rte-modal-body">
                            <div className="rte-form-group">
                                <label htmlFor="link-text">Text</label>
                                <input
                                    id="link-text"
                                    type="text"
                                    placeholder="Text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") handleSaveLink();
                                    }}
                                    autoFocus
                                />
                            </div>

                            <div className="rte-form-group">
                                <label htmlFor="link-url">
                                    Link <span className="rte-required">*</span>
                                </label>
                                <input
                                    id="link-url"
                                    type="url"
                                    placeholder="https://example.com"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") handleSaveLink();
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="rte-modal-footer">
                            <button
                                className="rte-modal-btn rte-modal-cancel"
                                onClick={handleCancelLink}
                            >
                                Cancel
                            </button>
                            <button
                                className="rte-modal-btn rte-modal-save"
                                onClick={handleSaveLink}
                                disabled={!linkUrl.trim()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RichTextEditor;
