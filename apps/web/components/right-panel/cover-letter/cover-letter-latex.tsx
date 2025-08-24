"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { completionKeymap } from "@codemirror/autocomplete";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
import { latex } from "codemirror-lang-latex";
import { DEFAULT_COVER_LETTER_LATEX } from "@/configs/default-cover-letter-latex";
import useLocalStorage from "use-local-storage";
import { latexEditorTheme } from "@/configs/latex-editor-theme";

interface CoverLetterLatexProps {
  onUserEditing?: (isEditing: boolean) => void;
}

// LaTeX extension options
const latexOptions = {
  autoCloseTags: true,
  enableLinting: true,
  enableTooltips: true,
  autoCloseBrackets: false, // Disable as it interferes with autoCloseTags
};

export function CoverLetterLatex({
  onUserEditing,
}: CoverLetterLatexProps = {}) {
  const [currentCoverLetterLatexContent, setCurrentCoverLetterLatexContent] =
    useLocalStorage("coverLetterLatexContent", DEFAULT_COVER_LETTER_LATEX);

  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const editingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>("");

  // Initialize CodeMirror editor
  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const extensions = [
        // Basic editor features
        lineNumbers(),
        highlightActiveLine(),
        history(),
        highlightSelectionMatches(),
        syntaxHighlighting(defaultHighlightStyle),

        // Keymaps
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
          ...completionKeymap,
        ]),

        // Line wrapping is helpful for LaTeX
        EditorView.lineWrapping,

        // Content change listener
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            setCurrentCoverLetterLatexContent(newContent);

            // Notify parent that user is editing
            if (onUserEditing) {
              onUserEditing(true);

              // Clear any existing timeout
              if (editingTimeoutRef.current) {
                clearTimeout(editingTimeoutRef.current);
              }

              // Set a timeout to mark editing as stopped after 2 seconds of inactivity
              editingTimeoutRef.current = setTimeout(() => {
                if (onUserEditing) {
                  onUserEditing(false);
                }
              }, 2000);
            }
          }
        }),

        // Enhanced LaTeX theme
        EditorView.theme(latexEditorTheme),
      ];

      // Add the LaTeX language support with options
      try {
        const latexExtension = latex(latexOptions);
        extensions.push(latexExtension);
      } catch (error) {
        console.error("Failed to load LaTeX extension:", error);
        // Continue with basic editor if LaTeX extension fails
      }

      // Use the content from localStorage or default
      const initialContent =
        currentCoverLetterLatexContent || DEFAULT_COVER_LETTER_LATEX;

      const startState = EditorState.create({
        doc: initialContent,
        extensions,
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current,
      });

      viewRef.current = view;
      lastContentRef.current = initialContent;
    }

    // Cleanup function
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
      if (editingTimeoutRef.current) {
        clearTimeout(editingTimeoutRef.current);
      }
    };
  }, []); // Remove dependency on currentCoverLetterLatexContent to prevent reinitialization

  // Sync editor content with localStorage when it changes externally
  useEffect(() => {
    if (viewRef.current && currentCoverLetterLatexContent) {
      const currentDoc = viewRef.current.state.doc.toString();
      const newContent = currentCoverLetterLatexContent;

      // Only update if content actually changed and is different from what we last processed
      if (currentDoc !== newContent && lastContentRef.current !== newContent) {
        const transaction = viewRef.current.state.update({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: newContent,
          },
          selection: { anchor: 0, head: 0 },
        });
        viewRef.current.dispatch(transaction);
        lastContentRef.current = newContent;
      }
    }
  }, [currentCoverLetterLatexContent]);

  // Cleanup editing timeout when component unmounts or onUserEditing changes
  useEffect(() => {
    return () => {
      if (editingTimeoutRef.current) {
        clearTimeout(editingTimeoutRef.current);
      }
    };
  }, [onUserEditing]);

  // Function to reset the editor content
  const resetEditor = () => {
    if (viewRef.current) {
      const transaction = viewRef.current.state.update({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: DEFAULT_COVER_LETTER_LATEX,
        },
        selection: { anchor: 0, head: 0 },
      });
      viewRef.current.dispatch(transaction);
      setCurrentCoverLetterLatexContent(DEFAULT_COVER_LETTER_LATEX);
      lastContentRef.current = DEFAULT_COVER_LETTER_LATEX;
    }
  };

  return (
    <div
      id="latex-editor"
      ref={editorRef}
      className="w-full border border-gray-200 overflow-hidden"
      style={{ height: "calc(100vh - 110px)" }}
    />
  );
}
