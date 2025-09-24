"use client";

import { ChevronRight, File, Trash2, Download, Upload } from "lucide-react";
import { useRef, useCallback, useEffect, useMemo } from "react";

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
  const files = useMemo(() => uploadedFiles || [], [uploadedFiles]);

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
        setUploadedFiles((prev) => {
          const updatedFiles = [...(prev || []), ...newFiles];

          // Mark that user has customized their signature if they uploaded a signature file
          const hasSignatureUpload = newFiles.some((file) =>
            isSignatureFile(file),
          );
          if (hasSignatureUpload) {
            localStorage.setItem("hasUserCustomizedSignature", "true");
          }

          return updatedFiles;
        });
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
      setUploadedFiles((prev) => {
        const newFiles = (prev || []).filter((file) => file.id !== fileId);

        // Mark that user has customized their signature if they deleted a signature file
        const deletedFile = (prev || []).find((file) => file.id === fileId);
        if (deletedFile && isSignatureFile(deletedFile)) {
          localStorage.setItem("hasUserCustomizedSignature", "true");
        }

        return newFiles;
      });
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

  // Helper function to check if a file is the default signature
  const isDefaultSignature = (file: UploadedFile): boolean => {
    return file.id.startsWith("default-signature-");
  };

  // Function to load default signature.png file
  const loadDefaultSignature = useCallback(async () => {
    try {
      // Check if user has already customized their signature files
      const hasUserCustomized = localStorage.getItem(
        "hasUserCustomizedSignature",
      );

      // If user has customized, don't load default
      if (hasUserCustomized === "true") {
        return;
      }

      // Check if signature.png is already uploaded by checking localStorage directly
      const storedFiles = localStorage.getItem("uploadedFiles");
      const currentFiles = storedFiles ? JSON.parse(storedFiles) : [];
      const hasSignature = currentFiles.some((file: UploadedFile) =>
        file.name.toLowerCase().includes("signature.png"),
      );

      if (!hasSignature) {
        // Fetch the signature.png file from public directory
        const response = await fetch("/signature.png");
        if (response.ok) {
          const blob = await response.blob();
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          const signatureFile: UploadedFile = {
            id: `default-signature-${Date.now()}`,
            name: "signature.png",
            size: blob.size,
            type: blob.type,
            lastModified: Date.now(),
            data: base64Data,
          };

          setUploadedFiles((prev) => [signatureFile, ...(prev || [])]);
        }
      }
    } catch (error) {
      console.error("Error loading default signature file:", error);
    }
  }, [setUploadedFiles]);

  // Load default signature on component mount only
  useEffect(() => {
    loadDefaultSignature();
  }, [loadDefaultSignature]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>File Uploads</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="File Uploads">
                <Upload className="h-4 w-4" />
                <span>File Uploads</span>
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
                                    variant={
                                      isDefaultSignature(file)
                                        ? "outline"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {isDefaultSignature(file)
                                      ? "Default (Replaceable)"
                                      : "Signature"}
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
                          💡 Upload files with &quot;signature&quot; in the name
                          to use them in LaTeX compilation. You can replace the
                          default signature.
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
