export const latexEditorTheme = {
  "&": {
    fontSize: "14px",
    fontFamily:
      "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
    height: "100%",
    width: "100%",
    backgroundColor: "#ffffff",
    color: "#333333",
    borderRadius: "2px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },

  ".cm-content": {
    padding: "16px",
    caretColor: "#0366d6",
    whiteSpace: "pre-wrap",
    lineHeight: "1.5",
    minHeight: "100%",
    fontFamily: "inherit",
  },

  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "inherit",
  },

  ".cm-gutters": {
    backgroundColor: "#f8f8f8",
    borderRight: "1px solid #ddd",
    color: "#999",
  },

  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    fontSize: "12px",
    color: "#999",
  },

  ".cm-activeLine": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },

  ".cm-activeLineGutter": {
    backgroundColor: "#e3f2fd",
    color: "#0366d6",
    fontWeight: "bold",
  },

  ".cm-selectionBackground": {
    backgroundColor: "#d7d4f0",
  },

  "&.cm-focused": {
    outline: "2px solid #4CAF50",
    outlineOffset: "-2px",
  },

  ".cm-matchingBracket": {
    backgroundColor: "rgba(0, 255, 0, 0.2)",
    outline: "1px solid #0f0",
  },

  ".cm-nonmatchingBracket": {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    outline: "1px solid #f00",
  },

  // LaTeX-specific syntax highlighting from the example
  ".cm-ctrlSeq": {
    color: "#0000cc",
    fontWeight: "bold",
  },

  ".cm-ctrlSym": {
    color: "#0000cc",
    fontWeight: "bold",
  },

  ".cm-beginEnv, .cm-endEnv": {
    color: "#008800",
    fontWeight: "bold",
  },

  ".cm-envName": {
    color: "#990000",
    fontWeight: "bold",
  },

  ".cm-documentEnvName, .cm-tabularEnvName, .cm-equationEnvName, .cm-equationArrayEnvName, .cm-verbatimEnvName, .cm-tikzPictureEnvName, .cm-figureEnvName, .cm-listEnvName, .cm-tableEnvName":
    {
      color: "#990000",
      fontWeight: "bold",
    },

  ".cm-comment": {
    color: "#999988",
    fontStyle: "italic",
  },

  ".cm-mathChar, .cm-mathSpecialChar, .cm-number": {
    color: "#0086b3",
  },

  ".cm-math": {
    color: "#0086b3",
  },

  ".cm-dollar": {
    color: "#0086b3",
    fontWeight: "bold",
  },

  ".cm-textArgument, .cm-shortTextArgument, .cm-longArg, .cm-shortArg, .cm-labelArgument, .cm-refArgument, .cm-bibKeyArgument, .cm-packageArgument":
    {
      color: "#dd1144",
    },

  // Tooltip styles
  ".cm-latex-tooltip": {
    backgroundColor: "#f8f8f8",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    color: "#333",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: "13px",
    lineHeight: "1.4",
    maxWidth: "300px",
    padding: "8px 12px",
  },

  ".cm-latex-tooltip-description": {
    marginBottom: "6px",
  },

  ".cm-latex-tooltip-syntax, .cm-latex-tooltip-example, .cm-latex-tooltip-package":
    {
      fontFamily: "monospace",
      marginTop: "4px",
      fontSize: "12px",
      backgroundColor: "#fff",
      padding: "2px 4px",
      borderRadius: "2px",
    },

  // Diagnostic styles (for linting)
  ".cm-diagnostic": {
    padding: "2px 4px",
    borderRadius: "2px",
  },

  ".cm-diagnostic-error": {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderLeft: "2px solid #f00",
  },

  ".cm-diagnostic-warning": {
    backgroundColor: "rgba(255, 255, 0, 0.1)",
    borderLeft: "2px solid #ff0",
  },

  ".cm-diagnostic-info": {
    backgroundColor: "rgba(0, 0, 255, 0.1)",
    borderLeft: "2px solid #00f",
  },

  // Code folding
  ".cm-foldPlaceholder": {
    backgroundColor: "#eee",
    border: "1px solid #ddd",
    borderRadius: "4px",
    color: "#888",
    fontSize: "10px",
    margin: "0 1px",
    padding: "0 1px",
  },
};
