import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TooltipComponent } from "./tooltip-component";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SaveFileButtonProps {
  latexContent: string;
  documentType: "resume" | "cover-letter";
}

export function SaveFileButton({
  latexContent,
  documentType,
}: SaveFileButtonProps) {
  const [fileName, setFileName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fileName.trim()) {
      toast.error("Please enter a file name");
      return;
    }

    if (!latexContent.trim()) {
      toast.error("No content to save");
      return;
    }

    try {
      // Create a unique key for localStorage
      const timestamp = new Date().toISOString();
      const key = `saved_${documentType}_${fileName}_${timestamp}`;

      // Save to localStorage
      localStorage.setItem(key, latexContent);

      toast.success(`File "${fileName}" saved successfully!`);
      setIsOpen(false);
      setFileName("");
    } catch (error) {
      console.error("Error saving file:", error);
      toast.error("Failed to save file");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipComponent content="Save File">
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <Save />
          </Button>
        </DialogTrigger>
      </TooltipComponent>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Save LaTeX File</DialogTitle>
            <DialogDescription>
              Save your current {documentType.replace("-", " ")} LaTeX content
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              name="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={`Enter ${documentType.replace("-", " ")} filename...`}
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save File</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
