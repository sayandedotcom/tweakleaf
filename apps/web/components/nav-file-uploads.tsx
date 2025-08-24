"use client";

import { ChevronRight, File, Trash2, Download } from "lucide-react";
import { useState, useRef, useCallback } from "react";

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
import useLocalStorage from "use-local-storage";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  data: string; // Base64 encoded file data
}

export function NavFileUploads() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFiles, setUploadedFiles] = useLocalStorage<UploadedFile[]>(
    "uploadedFiles",
    [] as UploadedFile[],
  );

  // Ensure uploadedFiles is always an array
  const files = uploadedFiles || [];

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (!selectedFiles) return;

      const newFiles: UploadedFile[] = [];

      for (const file of Array.from(selectedFiles)) {
        try {
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const uploadedFile: UploadedFile = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            data: base64Data,
          };

          newFiles.push(uploadedFile);
        } catch (error) {
          console.error("Error reading file:", error);
        }
      }

      if (newFiles.length > 0) {
        setUploadedFiles((prev) => [...(prev || []), ...newFiles]);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [setUploadedFiles],
  );

  const handleDeleteFile = useCallback(
    (fileId: string) => {
      setUploadedFiles((prev) =>
        (prev || []).filter((file) => file.id !== fileId),
      );
    },
    [setUploadedFiles],
  );

  const handleDownloadFile = useCallback((file: UploadedFile) => {
    const link = document.createElement("a");
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Helper function to check if a file is a signature image
  const isSignatureFile = (file: UploadedFile): boolean => {
    return (
      file.name.toLowerCase().includes("signature") &&
      file.type.startsWith("image/")
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>File Uploads</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="File Management">
                <File className="h-4 w-4" />
                <span>File Management</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {/* Uploaded Files List */}
                {files.length > 0 && (
                  <SidebarMenuSubItem>
                    <div className="w-full">
                      <div className="text-xs font-medium text-muted-foreground mb-2">
                        Uploaded Files ({files.length})
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-0.5 rounded-md border bg-muted/50 hover:bg-muted/80 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <File className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs font-medium truncate">
                                  {file.name}
                                </span>
                                {isSignatureFile(file) && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Signature
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {/* <Badge variant="secondary" className="text-xs">
                                  {formatFileSize(file.size)}
                                </Badge> */}
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(file.lastModified)}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-muted"
                                onClick={() => handleDownloadFile(file)}
                                title="Download file"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => handleDeleteFile(file.id)}
                                title="Delete file"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SidebarMenuSubItem>
                )}

                {/* File Upload Section */}
                <SidebarMenuSubItem>
                  <div className="w-full p-0.5">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor="file-upload"
                          className="text-xs font-medium"
                        >
                          Upload New Files
                        </Label>
                        <Input
                          id="file-upload"
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="text-xs"
                          accept="*/*"
                        />
                        <p className="text-xs text-muted-foreground">
                          💡 Upload files with "signature" in the name to use
                          them in LaTeX compilation
                        </p>
                      </div>
                    </div>
                  </div>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
