"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MailContent } from "@/components/right-panel/mail/mail-content";
import { TooltipComponent } from "@/components/tooltip-component";
import { RotateCcw, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { LOCAL_STORAGE_KEYS } from "@/configs/local-storage-keys";
import { compile } from "html-to-text";
import mailtoLink from "mailto-link";
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
  const [recipientEmail, setRecipientEmail] = useState("");
  const emailContentRef = useRef(emailContent);
  const subjectRef = useRef(subject);
  const recipientEmailRef = useRef(recipientEmail);

  // Keep refs in sync with state
  useEffect(() => {
    emailContentRef.current = emailContent;
  }, [emailContent]);

  useEffect(() => {
    subjectRef.current = subject;
  }, [subject]);

  useEffect(() => {
    recipientEmailRef.current = recipientEmail;
  }, [recipientEmail]);

  // Handlers for changes from MailContent component
  const handleRecipientChange = useCallback((recipient: string) => {
    setRecipientEmail(recipient);
  }, []);

  const handleSubjectChange = useCallback((newSubject: string) => {
    setSubject(newSubject);
  }, []);

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

  const handleSendClick = useCallback(() => {
    if (!recipientEmail.trim()) {
      toast.error("Please enter a recipient email address");
      return;
    }

    if (!emailContent.trim()) {
      toast.error("Please add some content to your email");
      return;
    }

    try {
      // Convert HTML content to plain text
      const plainTextBody = getPlainTextContent(emailContent);

      // Create mailto URL using mailto-link package
      const mailtoUrl = mailtoLink({
        to: recipientEmail.trim(),
        subject: subject.trim() || "Message via TweakLeaf",
        body: plainTextBody,
      });

      // Open the user's default email client in a new tab
      window.open(mailtoUrl, "_blank");

      toast.success("Opening email client...");
    } catch (error) {
      console.error("Error creating mailto link:", error);
      toast.error("Failed to open email client");
    }
  }, [recipientEmail, emailContent, subject, getPlainTextContent]);

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

  // Memoize button disabled states
  const isContentEmpty = useMemo(() => !emailContent, [emailContent]);
  const isRecipientEmpty = useMemo(
    () => !recipientEmail.trim(),
    [recipientEmail],
  );

  const isSendDisabled = useMemo(
    () => isContentEmpty || isRecipientEmpty,
    [isContentEmpty, isRecipientEmpty],
  );

  return (
    <Tabs defaultValue="mail">
      <header className="flex items-center gap-2 px-2 py-0.5 border-b">
        <TabsList className="grid w-[140px] grid-cols-1">
          <TabsTrigger value="mail">Cold Email</TabsTrigger>
        </TabsList>
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
        <CommingSoon />
        <div className="flex gap-2 justify-end ml-auto">
          <TooltipComponent content="Send Mail">
            <Button disabled={isSendDisabled} onClick={handleSendClick}>
              Send Email <Send />
            </Button>
          </TooltipComponent>
          {/* <TooltipComponent content="Download">
            <Button
              size="icon"
              variant="outline"
              onClick={handleDownload}
              disabled={isContentEmpty}
            >
              <Download />
            </Button>
          </TooltipComponent> */}
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
      </header>
      <TabsContent value="mail">
        <MailContent
          subject={subject}
          emailContent={emailContent}
          recipientEmail={recipientEmail}
          onRecipientChange={handleRecipientChange}
          onSubjectChange={handleSubjectChange}
        />
      </TabsContent>
    </Tabs>
  );
}
