"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MailContent } from "@/components/right-panel/mail/mail-content";
import { TooltipComponent } from "@/components/tooltip-component";
import { Copy, Download, RotateCcw, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import { LOCAL_STORAGE_KEYS } from "@/configs/local-storage-keys";
import { compile } from "html-to-text";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CommingSoon } from "../comming-soon";
import { coldEmailTemplates } from "@/configs/cold-email-templates";
import { AlertDialogComponent } from "../alert-dialog-component";

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
  const [subject, setSubject] = useState("Cold Email");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const recipientEmail = "john.doe@example.com";
  const emailContentRef = useRef(emailContent);
  const subjectRef = useRef(subject);

  // Keep refs in sync with state
  useEffect(() => {
    emailContentRef.current = emailContent;
  }, [emailContent]);

  useEffect(() => {
    subjectRef.current = subject;
  }, [subject]);

  // Memoize template options to prevent re-computation
  const templateOptions = useMemo(() => {
    return coldEmailTemplates.map((template) => (
      <SelectItem
        key={template.id}
        value={template.value}
        disabled={template.isDisabled}
      >
        {template.name} {template.isDisabled && <CommingSoon />}
      </SelectItem>
    ));
  }, []);

  // Initialize default template on mount
  useEffect(() => {
    const defaultTemplate = coldEmailTemplates.find((t) => t.isDefault);
    if (defaultTemplate && !selectedTemplate) {
      setSelectedTemplate(defaultTemplate.value);
      setSubject(defaultTemplate.subject);
      setEmailContent(defaultTemplate.body);
    }
  }, [selectedTemplate]);

  // Get email content and subject from localStorage
  useEffect(() => {
    const getEmailContent = () => {
      const content = localStorage.getItem(
        LOCAL_STORAGE_KEYS.MAIL_EDITOR_STORAGE_KEY,
      );
      if (content && content !== emailContentRef.current) {
        console.log("Email content updated:", content);
        setEmailContent(content);
      }
    };

    const getEmailSubject = () => {
      const savedSubject = localStorage.getItem(
        LOCAL_STORAGE_KEYS.MAIL_EDITOR_SUBJECT_KEY,
      );
      if (savedSubject && savedSubject !== subjectRef.current) {
        setSubject(savedSubject);
      }
    };

    // Get content and subject on mount
    getEmailContent();
    getEmailSubject();

    // Listen for storage changes (when editor updates from different tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEYS.MAIL_EDITOR_STORAGE_KEY) {
        setEmailContent(e.newValue || "");
      }
      if (e.key === LOCAL_STORAGE_KEYS.MAIL_EDITOR_SUBJECT_KEY) {
        setSubject(e.newValue || "");
      }
    };

    // Listen for custom events (when editor updates in same tab)
    const handleEditorUpdate = () => {
      getEmailContent();
    };

    const handleSubjectUpdate = (e: CustomEvent) => {
      if (e.detail?.subject !== undefined) {
        setSubject(e.detail.subject);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("mail-editor-updated", handleEditorUpdate);
    window.addEventListener(
      "mail-subject-updated",
      handleSubjectUpdate as EventListener,
    );

    // Check more frequently for updates
    const interval = setInterval(() => {
      getEmailContent();
      getEmailSubject();
    }, 200);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("mail-editor-updated", handleEditorUpdate);
      window.removeEventListener(
        "mail-subject-updated",
        handleSubjectUpdate as EventListener,
      );
      clearInterval(interval);
    };
  }, []); // Remove emailContent dependency to prevent infinite loops

  // Handle template selection change
  const handleTemplateChange = useCallback((templateValue: string) => {
    const template = coldEmailTemplates.find((t) => t.value === templateValue);
    if (template) {
      setSelectedTemplate(templateValue);
      setSubject(template.subject);
      setEmailContent(template.body);
      // Store in localStorage for editor sync
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.MAIL_EDITOR_STORAGE_KEY,
        template.body,
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.MAIL_EDITOR_SUBJECT_KEY,
        template.subject,
      );
    }
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(emailContent);
    toast.success("Email content copied to clipboard");
  }, [emailContent]);

  const handleDownload = useCallback(() => {
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
  }, [emailContent]);

  const handleSendClick = useCallback(() => {
    toast.success("Opening email client...");
  }, []);

  const handleReset = useCallback(() => {
    // Find the default template
    const defaultTemplate = coldEmailTemplates.find((t) => t.isDefault);
    if (defaultTemplate) {
      // Reset to default template
      setSelectedTemplate(defaultTemplate.value);
      setSubject(defaultTemplate.subject);
      setEmailContent(defaultTemplate.body);

      // Update localStorage
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.MAIL_EDITOR_STORAGE_KEY,
        defaultTemplate.body,
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.MAIL_EDITOR_SUBJECT_KEY,
        defaultTemplate.subject,
      );

      // Dispatch custom events to notify other components
      window.dispatchEvent(
        new CustomEvent("mail-editor-updated", {
          detail: { content: defaultTemplate.body },
        }),
      );
      window.dispatchEvent(
        new CustomEvent("mail-subject-updated", {
          detail: { subject: defaultTemplate.subject },
        }),
      );

      toast.success("Mail content reset to default template");
    }
  }, []);

  // Convert HTML to readable plain text for mailto body
  const getPlainTextContent = useCallback((html: string) => {
    if (!html) return "";
    try {
      const plainText = htmlToTextConverter(html);
      console.log("Converted HTML to plain text:", plainText);
      return plainText;
    } catch (error) {
      console.error("Error converting HTML to text:", error);
      return html; // Fallback to original HTML if conversion fails
    }
  }, []);

  // Memoize the plain text content for mailto body
  const plainTextContent = useMemo(() => {
    return emailContent
      ? getPlainTextContent(emailContent)
      : "No content available";
  }, [emailContent, getPlainTextContent]);

  // Memoize button disabled states
  const isContentEmpty = useMemo(() => !emailContent, [emailContent]);

  const isCopyDisabled = useMemo(
    () => isContentEmpty || true,
    [isContentEmpty],
  );

  const isSendDisabled = useMemo(
    () => isContentEmpty || true,
    [isContentEmpty],
  );

  return (
    <Tabs defaultValue="mail">
      <div className="flex items-center gap-4">
        <TabsList className="grid w-[140px] grid-cols-1">
          <TabsTrigger value="mail">Cold Email</TabsTrigger>
        </TabsList>
        <CommingSoon />
        <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Templates</SelectLabel>
              {templateOptions}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex gap-2 justify-end ml-auto">
          <TooltipComponent content="Copy">
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopy}
              disabled={isCopyDisabled}
            >
              <Copy />
            </Button>
          </TooltipComponent>
          <TooltipComponent content="Send Mail">
            <MailTo to={recipientEmail} subject={subject}>
              <MailToTrigger>
                <Button
                  size="icon"
                  variant="outline"
                  disabled={isSendDisabled}
                  onClick={handleSendClick}
                >
                  <Send />
                </Button>
              </MailToTrigger>
              <MailToBody>{plainTextContent}</MailToBody>
            </MailTo>
          </TooltipComponent>
          <TooltipComponent content="Download">
            <Button
              size="icon"
              variant="outline"
              onClick={handleDownload}
              disabled={isContentEmpty}
            >
              <Download />
            </Button>
          </TooltipComponent>
          <TooltipComponent content="Save">
            <Button size="icon" variant="outline" disabled={true}>
              <Save />
            </Button>
          </TooltipComponent>
          <AlertDialogComponent
            tooltipContent="Reset"
            title="Reset"
            description="Are you sure you want to reset the current mail content to the default template? All data will be lost."
            onConfirm={handleReset}
          >
            <Button variant="outline" size="icon">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </AlertDialogComponent>
        </div>
      </div>
      <TabsContent value="mail">
        <MailContent subject={subject} emailContent={emailContent} />
      </TabsContent>
    </Tabs>
  );
}
