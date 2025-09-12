"use client";

import {
  Editor,
  EditorContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useEffect, useState, useRef } from "react";
import {
  Bold,
  Italic,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Trash2,
} from "lucide-react";
import { LOCAL_STORAGE_KEYS } from "@/configs/local-storage-keys";

import "./editor.css";

const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: "Start writing your email...",
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "editor-link",
    },
  }),
];

function MenuBar({
  editor,
  onClear,
}: {
  editor: Editor;
  onClear?: () => void;
}) {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor?.isActive("bold") ?? false,
        canBold: ctx.editor?.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor?.isActive("italic") ?? false,
        canItalic: ctx.editor?.can().chain().toggleItalic().run() ?? false,
        canClearMarks: ctx.editor?.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor?.isActive("paragraph") ?? false,
        isHeading1: ctx.editor?.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor?.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor?.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor?.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor?.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor?.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor?.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor?.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor?.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor?.isActive("blockquote") ?? false,
        canUndo: ctx.editor?.can().chain().undo().run() ?? false,
        canRedo: ctx.editor?.can().chain().redo().run() ?? false,
        isLink: ctx.editor?.isActive("link") ?? false,
        canSetLink:
          ctx.editor?.can().chain().setLink({ href: "" }).run() ?? false,
      };
    },
  });

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="control-group">
      <div className="button-group">
        {/* Text formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? "is-active" : ""}
          title="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? "is-active" : ""}
          title="Italic"
        >
          <Italic size={14} />
        </button>
        <button
          onClick={setLink}
          disabled={!editorState.canSetLink}
          className={editorState.isLink ? "is-active" : ""}
          title="Add link"
        >
          <LinkIcon size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editorState.isLink}
          title="Remove link"
        >
          <Unlink size={14} />
        </button>

        {/* Divider */}
        <div className="toolbar-divider" />

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editorState.isParagraph ? "is-active" : ""}
          title="Normal text"
        >
          <Type size={14} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={editorState.isHeading1 ? "is-active" : ""}
          title="Heading 1"
        >
          <Heading1 size={14} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={editorState.isHeading2 ? "is-active" : ""}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={editorState.isHeading3 ? "is-active" : ""}
          title="Heading 3"
        >
          <Heading3 size={14} />
        </button>

        {/* Divider */}
        <div className="toolbar-divider" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? "is-active" : ""}
          title="Bullet list"
        >
          <List size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? "is-active" : ""}
          title="Numbered list"
        >
          <ListOrdered size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? "is-active" : ""}
          title="Quote"
        >
          <Quote size={14} />
        </button>

        {/* Divider */}
        <div className="toolbar-divider" />

        {/* Actions */}
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal line"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          title="Undo"
        >
          <Undo size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          title="Redo"
        >
          <Redo size={14} />
        </button>

        {/* Divider */}
        <div className="toolbar-divider" />

        {/* Clear content */}
        {onClear && (
          <button
            onClick={onClear}
            title="Clear all content"
            className="clear-button"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export function MailContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: "",
    onUpdate: ({ editor }) => {
      // Save content to localStorage on every update
      const content = editor.getHTML();
      localStorage.setItem(LOCAL_STORAGE_KEYS.MAIL_EDITOR_STORAGE_KEY, content);

      // Dispatch custom event to notify other components
      window.dispatchEvent(
        new CustomEvent("mail-editor-updated", {
          detail: { content },
        }),
      );
    },
  });

  // Load content from localStorage on component mount
  useEffect(() => {
    if (editor && !isLoaded) {
      const savedContent = localStorage.getItem(
        LOCAL_STORAGE_KEYS.MAIL_EDITOR_STORAGE_KEY,
      );
      if (savedContent) {
        editor.commands.setContent(savedContent);
      }
      setIsLoaded(true);
    }
  }, [editor, isLoaded]);

  // Save scroll position on scroll
  useEffect(() => {
    const editorElement = editorRef.current?.querySelector(".tiptap");
    if (editorElement) {
      const handleScroll = () => {
        const scrollTop = editorElement.scrollTop;
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.MAIL_EDITOR_SCROLL_KEY,
          scrollTop.toString(),
        );
      };

      editorElement.addEventListener("scroll", handleScroll);

      return () => {
        editorElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isLoaded]);

  // Restore scroll position after content is loaded
  useEffect(() => {
    if (isLoaded) {
      const editorElement = editorRef.current?.querySelector(".tiptap");
      if (editorElement) {
        const savedScrollPosition = localStorage.getItem(
          LOCAL_STORAGE_KEYS.MAIL_EDITOR_SCROLL_KEY,
        );
        if (savedScrollPosition) {
          const scrollTop = parseInt(savedScrollPosition, 10);
          // Use setTimeout to ensure the content is fully rendered
          setTimeout(() => {
            editorElement.scrollTop = scrollTop;
          }, 100);
        }
      }
    }
  }, [isLoaded]);

  // Clear content function (useful for resetting the editor)
  const clearContent = () => {
    if (editor) {
      editor.commands.clearContent();
      localStorage.removeItem(LOCAL_STORAGE_KEYS.MAIL_EDITOR_STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.MAIL_EDITOR_SCROLL_KEY);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="mail-editor" ref={editorRef}>
      <MenuBar editor={editor} onClear={clearContent} />
      <EditorContent editor={editor} />
    </div>
  );
}
