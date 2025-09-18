"use client";

import {
  ChevronRight,
  File,
  Trash2,
  Download,
  Save,
  SquarePen,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TooltipComponent } from "./tooltip-component";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SavedFile {
  key: string;
  content: string;
  fileName: string;
  documentType: string;
  saveDate: string;
  displayName: string;
}

interface NavSavedFilesProps {
  onLoadFile?: (content: string, documentType: string) => void;
}

export function NavSavedFiles({ onLoadFile }: NavSavedFilesProps) {
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Function to parse localStorage key and extract metadata
  const parseSavedFile = (key: string, content: string): SavedFile | null => {
    if (!key.startsWith("saved_") || !content) return null;

    const parts = key.split("_");
    if (parts.length < 4) return null;

    const documentType = parts[1];
    const fileName = parts[2];
    const timestamp = parts.slice(3).join("_");

    if (!documentType || !fileName) return null;

    try {
      const date = new Date(timestamp);
      return {
        key,
        content,
        fileName,
        documentType: documentType.replace("-", " "),
        saveDate: date.toLocaleDateString(),
        displayName: `${fileName} (${documentType.replace("-", " ")})`,
      };
    } catch {
      return null;
    }
  };

  // Function to load saved files from localStorage
  const loadSavedFiles = useCallback(() => {
    const files: SavedFile[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("saved_")) {
        const content = localStorage.getItem(key);
        if (content) {
          const parsedFile = parseSavedFile(key, content);
          if (parsedFile) {
            files.push(parsedFile);
          }
        }
      }
    }

    // Sort by save date (newest first)
    files.sort(
      (a, b) =>
        new Date(b.key.split("_").slice(3).join("_")).getTime() -
        new Date(a.key.split("_").slice(3).join("_")).getTime(),
    );
    setSavedFiles(files);
  }, []);

  // Load files on component mount and when opened
  useEffect(() => {
    if (isOpen) {
      loadSavedFiles();
    }
  }, [isOpen, loadSavedFiles]);

  // Function to delete a saved file
  const handleDeleteFile = (fileKey: string, fileName: string) => {
    console.log("Attempting to delete file:", fileKey, fileName); // Debug log
    try {
      localStorage.removeItem(fileKey);
      loadSavedFiles(); // Refresh the list
      toast.success(`File "${fileName}" deleted successfully!`);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  // Function to load a file back to the editor
  const handleLoadFile = (file: SavedFile) => {
    if (onLoadFile) {
      const documentType =
        file.documentType === "cover letter" ? "cover-letter" : "resume";
      onLoadFile(file.content, documentType);
      toast.success(`File "${file.fileName}" loaded successfully!`);
    } else {
      toast.error("Load functionality not available");
    }
  };

  // Function to download a file
  const handleDownloadFile = (file: SavedFile) => {
    try {
      const blob = new Blob([file.content], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${file.fileName}.tex`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      toast.success(`File "${file.fileName}" downloaded successfully!`);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  // Function to edit/replace current LaTeX content with saved file content
  const handleEditFile = (file: SavedFile) => {
    try {
      // Dispatch a custom event to notify the ResumeCoverLetterTabs component
      // This will trigger the proper state update through the useLatexContent hook
      const documentType =
        file.documentType === "cover letter" ? "cover-letter" : "resume";

      window.dispatchEvent(
        new CustomEvent("loadSavedFile", {
          detail: {
            content: file.content,
            documentType: documentType,
            fileName: file.fileName,
          },
        }),
      );

      toast.success(`File "${file.fileName}" loaded for editing!`);
    } catch (error) {
      console.error("Error editing file:", error);
      toast.error("Failed to load file for editing");
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Saved Files</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          defaultOpen={false}
          className="group/collapsible"
          onOpenChange={setIsOpen}
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="File Management">
                <Save className="h-4 w-4" />
                <span>Saved Files</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {savedFiles.length === 0 ? (
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>
                      <File className="h-4 w-4" />
                      <span>No saved files</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ) : (
                  savedFiles.map((file) => (
                    <SidebarMenuSubItem key={file.key}>
                      <div className="flex items-center justify-between w-full">
                        <TooltipComponent
                          content={`${file.displayName} - ${file.saveDate}`}
                        >
                          <SidebarMenuSubButton
                            onClick={() => handleLoadFile(file)}
                            className="flex-1"
                          >
                            {/* <File className="h-4 w-4" /> */}
                            <div className="flex items-start w-full">
                              <span className="text-sm font-medium">
                                {file.fileName}
                              </span>
                              {/* <span className="text-xs text-muted-foreground">
                                  {file.documentType === "cover letter"
                                    ? "CL"
                                    : "CV"}
                                </span> */}
                            </div>
                          </SidebarMenuSubButton>
                        </TooltipComponent>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadFile(file)}
                          className="h-6 w-6 p-0 cursor-pointer"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 cursor-pointer"
                            >
                              <SquarePen className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Load File for Editing
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to load &quot;
                                {file.fileName}&quot; for editing? This will
                                replace your current content.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleEditFile(file)}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                              >
                                Load for Editing
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete File</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {file.fileName}&quot;? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  console.log(
                                    "Delete button clicked for:",
                                    file.fileName,
                                  );
                                  handleDeleteFile(file.key, file.fileName);
                                }}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </SidebarMenuSubItem>
                  ))
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
