"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MailContent } from "@/components/right-panel/mail/mail-content";
import { TooltipComponent } from "@/components/tooltip-component";
import { Copy, Download, Send } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";

export default function MailTab() {
  const mail = {
    name: "John Doe",
    email: "john.doe@example.com",
    message: "Hello, how are you?",
  };

  return (
    <Tabs defaultValue="mail">
      <TabsList className="w-full flex gap-2 justify-between px-2 py-0.5 border-b">
        <TabsTrigger value="mail">Cold Mail</TabsTrigger>
        <TooltipComponent content="Copy">
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(mail));
              toast.success("Copied to clipboard");
            }}
          >
            <Copy />
          </Button>
        </TooltipComponent>
        <TooltipComponent content="Download">
          <Button
            size="icon"
            variant="outline"
            // onClick={handleDownload}
            // disabled={!currentPdfBlob}
          >
            <Download />
          </Button>
        </TooltipComponent>
        <TooltipComponent content="Send Mail">
          <a
            href="mailto:john.doe@example.com"
            className={buttonVariants({ variant: "outline", size: "icon" })}
            onClick={() => {
              toast.success("Mail has been sent !");
            }}
          >
            <Send />
          </a>
        </TooltipComponent>
      </TabsList>
      <TabsContent value="mail">
        <MailContent />
      </TabsContent>
    </Tabs>
  );
}
