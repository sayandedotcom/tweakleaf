"use client";

import { useEffect, useRef, useCallback } from "react";
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
import { latex } from "codemirror-lang-latex"; // Proper import for the LaTeX extension
import useLocalStorage from "use-local-storage";
import { latexEditorTheme } from "@/configs/latex-editor-theme";
import { resumeTemplates } from "@/configs/resume-templates";
import { screenToLayoutHeight } from "@/configs/screen-to-layout-height";

interface ResumeLatexProps {
  onUserEditing?: (isEditing: boolean) => void;
}

// LaTeX extension options
const latexOptions = {
  autoCloseTags: true,
  enableLinting: true,
  enableTooltips: true,
  autoCloseBrackets: false, // Disable as it interferes with autoCloseTags
};

function ResumeLatex({ onUserEditing }: ResumeLatexProps = {}) {
  // Get the selected template from localStorage
  const [selectedResumeTemplate] = useLocalStorage(
    "selectedResumeTemplate",
    resumeTemplates.find((t) => t.isDefault)?.value ||
      resumeTemplates[0]?.value ||
      "",
  );

  // Get the current template
  const currentTemplate = resumeTemplates.find(
    (t) => t.value === selectedResumeTemplate,
  );

  // Get default content from the selected template
  const getDefaultContent = useCallback(() => {
    return currentTemplate?.latex || "";
  }, [currentTemplate]);

  const [currentResumeLatexContent, setCurrentResumeLatexContent] =
    useLocalStorage("resumeLatexContent", getDefaultContent());
  const [scrollPosition, setScrollPosition] = useLocalStorage(
    "resumeLatexScrollPosition",
    0,
  );
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const editingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
            setCurrentResumeLatexContent(update.state.doc.toString());

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

        // Scroll position tracking
        EditorView.scrollMargins.of(() => ({ top: 0, bottom: 0 })),
        EditorView.updateListener.of((update) => {
          if (viewRef.current && update.view) {
            const scrollTop = update.view.scrollDOM.scrollTop;
            setScrollPosition(scrollTop);
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

      // Use the content from localStorage or default from selected template
      const initialContent = currentResumeLatexContent || getDefaultContent();

      const startState = EditorState.create({
        doc: initialContent,
        extensions,
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current,
      });

      viewRef.current = view;

      // Restore scroll position after editor is created
      setTimeout(() => {
        if (viewRef.current && scrollPosition > 0) {
          viewRef.current.scrollDOM.scrollTop = scrollPosition;
        }
      }, 100);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync editor content with localStorage when it changes externally
  useEffect(() => {
    if (viewRef.current && currentResumeLatexContent) {
      const currentDoc = viewRef.current.state.doc.toString();
      if (currentDoc !== currentResumeLatexContent) {
        const transaction = viewRef.current.state.update({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: currentResumeLatexContent,
          },
          selection: { anchor: 0, head: 0 },
        });
        viewRef.current.dispatch(transaction);
      }
    }
  }, [currentResumeLatexContent]);

  // Cleanup editing timeout when component unmounts or onUserEditing changes
  useEffect(() => {
    return () => {
      if (editingTimeoutRef.current) {
        clearTimeout(editingTimeoutRef.current);
      }
    };
  }, [
    onUserEditing,
    currentResumeLatexContent,
    getDefaultContent,
    setCurrentResumeLatexContent,
  ]);

  return (
    <div
      id="latex-editor"
      ref={editorRef}
      className="w-full border border-gray-200 overflow-hidden"
      style={{ height: screenToLayoutHeight }}
    />
  );
}

export default ResumeLatex;
