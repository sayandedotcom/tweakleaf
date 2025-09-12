"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MailContent } from "@/components/right-panel/mail/mail-content";
import { TooltipComponent } from "@/components/tooltip-component";
import { Copy, Download, Send, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";

import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import { LOCAL_STORAGE_KEYS } from "@/configs/local-storage-keys";
import { compile } from "html-to-text";

// Configure html-to-text converter for readable email formatting
const htmlToTextConverter = compile({
  wordwrap: 80,
  selectors: [
    {
      selector: "a",
      format: "anchor",
      options: {
        linkBrackets: ["", ""],
        hideLinkHrefIfSameAsText: false,
        baseUrl: undefined,
      },
    },
    {
      selector: "strong",
      format: "inline",
    },
    {
      selector: "b",
      format: "inline",
    },
    {
      selector: "em",
      format: "inline",
    },
    {
      selector: "i",
      format: "inline",
    },
    {
      selector: "h1",
      format: "heading",
      options: {
        uppercase: false,
        leadingLineBreaks: 2,
        trailingLineBreaks: 1,
      },
    },
    {
      selector: "h2",
      format: "heading",
      options: {
        uppercase: false,
        leadingLineBreaks: 2,
        trailingLineBreaks: 1,
      },
    },
    {
      selector: "h3",
      format: "heading",
      options: {
        uppercase: false,
        leadingLineBreaks: 2,
        trailingLineBreaks: 1,
      },
    },
    {
      selector: "h4",
      format: "heading",
      options: {
        uppercase: false,
        leadingLineBreaks: 2,
        trailingLineBreaks: 1,
      },
    },
    {
      selector: "h5",
      format: "heading",
      options: {
        uppercase: false,
        leadingLineBreaks: 2,
        trailingLineBreaks: 1,
      },
    },
    {
      selector: "h6",
      format: "heading",
      options: {
        uppercase: false,
        leadingLineBreaks: 2,
        trailingLineBreaks: 1,
      },
    },
    {
      selector: "ul",
      format: "unorderedList",
      options: {
        itemPrefix: "• ",
      },
    },
    {
      selector: "ol",
      format: "orderedList",
      options: {
        itemPrefix: "1. ",
      },
    },
    {
      selector: "blockquote",
      format: "blockquote",
      options: {
        leadingLineBreaks: 1,
        trailingLineBreaks: 1,
      },
    },
  ],
});

export default function MailTab() {
  const [emailContent, setEmailContent] = useState("");
  const recipientEmail = "john.doe@example.com";
  const subject = "Cold Email";

  // Get email content from localStorage
  useEffect(() => {
    const getEmailContent = () => {
      const content = localStorage.getItem(
        LOCAL_STORAGE_KEYS.MAIL_EDITOR_STORAGE_KEY,
      );
      if (content && content !== emailContent) {
        console.log("Email content updated:", content);
        setEmailContent(content);
      }
    };

    // Get content on mount
    getEmailContent();

    // Listen for storage changes (when editor updates from different tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEYS.MAIL_EDITOR_STORAGE_KEY) {
        setEmailContent(e.newValue || "");
      }
    };

    // Listen for custom events (when editor updates in same tab)
    const handleEditorUpdate = () => {
      getEmailContent();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("mail-editor-updated", handleEditorUpdate);

    // Check more frequently for updates
    const interval = setInterval(getEmailContent, 200);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("mail-editor-updated", handleEditorUpdate);
      clearInterval(interval);
    };
  }, [emailContent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailContent);
    toast.success("Email content copied to clipboard");
  };

  const handleDownload = () => {
    if (!emailContent) {
      toast.error("No content to download");
      return;
    }

    const blob = new Blob([emailContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-content.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Email content downloaded");
  };

  const handleDebug = () => {
    const content = localStorage.getItem(
      LOCAL_STORAGE_KEYS.MAIL_EDITOR_STORAGE_KEY,
    );
    console.log("Current localStorage content:", content);
    console.log("Current emailContent state:", emailContent);
    toast.success(`Content length: ${content?.length || 0} chars`);
  };

  // Convert HTML to readable plain text for mailto body
  const getPlainTextContent = (html: string) => {
    if (!html) return "";
    try {
      const plainText = htmlToTextConverter(html);
      console.log("Converted HTML to plain text:", plainText);
      return plainText;
    } catch (error) {
      console.error("Error converting HTML to text:", error);
      return html; // Fallback to original HTML if conversion fails
    }
  };

  return (
    <Tabs defaultValue="mail">
      <TabsList className="w-full flex gap-2 justify-between px-2 py-0.5 border-b">
        <TabsTrigger value="mail">Cold Mail</TabsTrigger>
        <TooltipComponent content="Copy">
          <Button
            size="icon"
            variant="outline"
            onClick={handleCopy}
            disabled={!emailContent}
          >
            <Copy />
          </Button>
        </TooltipComponent>
        <TooltipComponent content="Download">
          <Button
            size="icon"
            variant="outline"
            onClick={handleDownload}
            disabled={!emailContent}
          >
            <Download />
          </Button>
        </TooltipComponent>
        <TooltipComponent content="Debug">
          <Button size="icon" variant="outline" onClick={handleDebug}>
            <Bug />
          </Button>
        </TooltipComponent>
        <TooltipComponent content="Send Mail">
          <MailTo to={recipientEmail} subject={subject}>
            <MailToTrigger>
              <Button
                size="icon"
                variant="outline"
                disabled={!emailContent}
                onClick={() => {
                  toast.success("Opening email client...");
                }}
              >
                <Send />
              </Button>
            </MailToTrigger>
            <MailToBody>
              {emailContent
                ? getPlainTextContent(emailContent)
                : "No content available"}
            </MailToBody>
          </MailTo>
        </TooltipComponent>
      </TabsList>
      <TabsContent value="mail">
        <MailContent />
      </TabsContent>
    </Tabs>
  );
}
