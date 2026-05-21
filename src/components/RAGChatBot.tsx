"use client";

import {
  CheckIcon,
  GlobeIcon,
  Trash2Icon,
  BrainCog,
  Maximize2,
  Minimize2,
  X,
  SearchIcon,
  MailIcon,
  AlertCircle,
  CalendarCheck,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { memo, useCallback, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageLabel,
  MessageLabelText,
  MessageResponse,
} from "@/components/ai-elements/message";
import type { ChatMessage } from "@/app/api/chat/route";
// import type { ChatMessage } from "@/app/api/chat/tools";

const models = [
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "openai/gpt-4.1-mini",
    name: "GPT-4.1 Mini",
    providers: ["openai"],
  },
  {
    chef: "DeepSeek",
    chefSlug: "deepseek",
    id: "deepseek/deepseek-v4",
    name: "DeepSeek V4 Pro",
    providers: ["deepseek"],
  },
  {
    chef: "Google",
    chefSlug: "google",
    id: "google/gemini-3-flash",
    name: "Gemini 3.0 Flash",
    providers: ["google"],
  },
  {
    chef: "xAI",
    chefSlug: "xai",
    id: "xai/grok-4.3",
    name: "Grok 4.3",
    providers: ["xai"],
  },
];

const chefs = Array.from(new Set(models.map((m) => m.chef)));

const ModelItem = memo(
  ({
    m,
    selectedModel,
    onSelect,
  }: {
    m: (typeof models)[0];
    selectedModel: string;
    onSelect: (id: string) => void;
  }) => {
    const handleSelect = useCallback(() => onSelect(m.id), [onSelect, m.id]);
    return (
      <ModelSelectorItem key={m.id} onSelect={handleSelect} value={m.id}>
        <ModelSelectorLogo provider={m.chefSlug} />
        <ModelSelectorName>{m.name}</ModelSelectorName>
        <ModelSelectorLogoGroup>
          {m.providers.map((provider) => (
            <ModelSelectorLogo key={provider} provider={provider} />
          ))}
        </ModelSelectorLogoGroup>
        {selectedModel === m.id ? (
          <CheckIcon className="ml-auto size-4" />
        ) : (
          <div className="ml-auto size-4" />
        )}
      </ModelSelectorItem>
    );
  },
);
ModelItem.displayName = "ModelItem";

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;
  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

const RAGChatBot = ({
  isExpanded,
  onToggleExpand,
  onClose,
}: {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClose?: () => void;
}) => {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  // Web search state commented out
  // const [useWebSearch, setUseWebSearch] = useState<boolean>(false);

  const { messages, status, sendMessage, setMessages } = useChat<ChatMessage>();
  const t = useTranslations("voiceAgent");
  const locale = useLocale();

  const selectedModelData = models.find((m) => m.id === model);
  const handleModelSelect = useCallback((id: string) => {
    setModel(id);
    setModelSelectorOpen(false);
  }, []);

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text) return;
    // webSearch body parameter removed/set to false
    sendMessage(
      { text: message.text },
      { body: { model, webSearch: false, locale } },
    );
    setText("");
  };

  return (
    <div className="relative size-full rounded-2xl border bg-card/80 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden text-foreground">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 xl:p-3 2xl:p-4 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
            <BrainCog
              className={cn(
                "size-5 xl:size-8",
                status === "streaming" && "animate-pulse",
              )}
            />
          </div>
          <div>
            <h2 className="text-sm xl:text-xl font-bold tracking-tight uppercase">
              {t("title")}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5 xl:mt-1">
              <span
                className={cn(
                  "size-1.5 xl:size-2.5 2xl:size-3 rounded-full",
                  status === "streaming"
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-green-500 animate-pulse",
                )}
              />
              <span className="text-[10px] xl:text-sm text-muted-foreground font-medium uppercase tracking-widest">
                {status === "streaming" ? "Processing..." : "Ready"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full xl:size-12 2xl:size-16"
            onClick={onToggleExpand}
          >
            {isExpanded ? (
              <Minimize2 className="size-4 xl:size-6 2xl:size-8" />
            ) : (
              <Maximize2 className="size-4 xl:size-6 2xl:size-8" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full xl:size-12 2xl:size-16"
            onClick={() => setMessages([])}
          >
            <Trash2Icon className="size-4 xl:size-6 2xl:size-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full xl:size-12 2xl:size-16"
            onClick={onClose}
          >
            <X className="size-4 xl:size-6 2xl:size-8" />
          </Button>
        </div>
      </div>

      {/* CONVERSATION SECTION */}
      <Conversation className="flex-1 overflow-y-auto p-4" data-lenis-prevent>
        <ConversationContent className="gap-6">
          {messages.map((message) => (
            <Message from={message.role} key={message.id}>
              <MessageLabel>
                <MessageLabelText className="opacity-70 xl:text-sm 2xl:text-base">
                  {message.role === "user"
                    ? t("labelUser")
                    : t("labelAssistant")}
                </MessageLabelText>
              </MessageLabel>
              <MessageContent
                className={cn(
                  "shadow-sm border",
                  message.role === "user"
                    ? "border-primary/20 bg-primary/5"
                    : "border-muted bg-muted/20",
                )}
              >
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <MessageResponse
                          key={`${message.id}-${index}`}
                          className="text-sm md:text-xl 2xl:text-2xl [&_p]:text-sm [&_p]:md:text-xl [&_p]:2xl:text-2xl"
                        >
                          {part.text}
                        </MessageResponse>
                      );

                    case "tool-searchKnowledgeBase":
                      return (
                        <div
                          key={`${message.id}-search-${index}`}
                          className="my-2 xl:my-4 p-3 xl:p-5 rounded-lg border bg-zinc-500/5 border-zinc-500/20"
                        >
                          <div className="flex items-center gap-2 text-xs xl:text-base 2xl:text-lg font-bold uppercase tracking-tight text-muted-foreground mb-1 xl:mb-2">
                            <SearchIcon
                              className={cn(
                                "size-3.5 xl:size-5 2xl:size-6",
                                part.state !== "output-available" &&
                                  "animate-pulse",
                              )}
                            />
                            {part.state === "output-available"
                              ? "Search Complete"
                              : "Searching Knowledge Base..."}
                          </div>
                          {part.state === "input-available" && (
                            <div className="text-[11px] xl:text-sm 2xl:text-base text-zinc-400 italic">
                              Query: {part.input.query}
                            </div>
                          )}
                          {part.state === "output-available" && (
                            <div className="text-[11px] xl:text-sm 2xl:text-base text-zinc-500 line-clamp-1 border-t pt-1 xl:pt-2 mt-1 xl:mt-2 border-zinc-500/10">
                              Matches found.
                            </div>
                          )}
                          {part.state === "output-error" && (
                            <div className="flex items-center gap-1.5 text-[11px] xl:text-sm 2xl:text-base text-red-400 border-t pt-1 xl:pt-2 mt-1 xl:mt-2 border-zinc-500/10">
                              <AlertCircle className="size-3.5 xl:size-4 shrink-0" />
                              {part.errorText}
                            </div>
                          )}
                        </div>
                      );

                    case "tool-sendCvEmail":
                      return (
                        <div
                          key={`${message.id}-email-${index}`}
                          className="my-2 xl:my-4 p-3 xl:p-5 rounded-lg border bg-primary/5 border-primary/20"
                        >
                          <div className="flex items-center gap-2 text-xs xl:text-base 2xl:text-lg font-bold uppercase tracking-tight text-primary mb-1 xl:mb-2">
                            {part.state === "output-available" ? (
                              <CheckIcon className="size-3.5 xl:size-5 2xl:size-6" />
                            ) : (
                              <MailIcon className="size-3.5 xl:size-5 2xl:size-6 animate-bounce" />
                            )}
                            {part.state === "output-available"
                              ? "CV Email Sent ✅"
                              : "Sending CV Email..."}
                          </div>
                          {part.input?.email && (
                            <div className="text-[11px] xl:text-sm 2xl:text-base font-medium">
                              📩 To: {part.input.email}
                            </div>
                          )}
                          {part.state === "output-available" && (
                            <div className="text-[11px] xl:text-sm 2xl:text-base text-emerald-600 dark:text-emerald-400 font-medium">
                              {part.output}
                            </div>
                          )}
                          {part.state === "output-error" && (
                            <div className="flex items-center gap-1.5 text-[11px] xl:text-sm 2xl:text-base text-red-400 font-medium">
                              <AlertCircle className="size-3.5 xl:size-4 shrink-0" />
                              {part.errorText}
                            </div>
                          )}
                        </div>
                      );

                    case "tool-bookIntroCall":
                      return (
                        <div
                          key={`${message.id}-booking-${index}`}
                          className="my-2 xl:my-4 p-3 xl:p-5 rounded-lg border bg-emerald-500/5 border-emerald-500/20"
                        >
                          <div className="flex items-center gap-2 text-xs xl:text-base 2xl:text-lg font-bold uppercase tracking-tight text-emerald-600 dark:text-emerald-400 mb-1 xl:mb-2">
                            {part.state === "output-available" &&
                            typeof part.output === "string" &&
                            part.output.startsWith("BOOKING_SUCCESS") ? (
                              <CheckIcon className="size-3.5 xl:size-5 2xl:size-6" />
                            ) : part.state === "output-error" ||
                              (part.state === "output-available" &&
                                typeof part.output === "string" &&
                                part.output.startsWith("BOOKING_ERROR")) ? (
                              <AlertCircle className="size-3.5 xl:size-5 2xl:size-6 text-red-400" />
                            ) : (
                              <CalendarCheck className="size-3.5 xl:size-5 2xl:size-6 animate-pulse" />
                            )}
                            {part.state === "output-available" &&
                            typeof part.output === "string" &&
                            part.output.startsWith("BOOKING_SUCCESS")
                              ? "Call Booked ✅"
                              : part.state === "output-error" ||
                                  (part.state === "output-available" &&
                                    typeof part.output === "string" &&
                                    part.output.startsWith("BOOKING_ERROR"))
                                ? "Booking Failed"
                                : "Booking Intro Call..."}
                          </div>
                          {part.input?.name && part.input?.dateTime && (
                            <div className="text-[11px] xl:text-sm 2xl:text-base font-medium space-y-0.5">
                              <div>👤 {part.input.name}</div>
                              {part.input?.email && (
                                <div>📩 {part.input.email}</div>
                              )}
                              {part.input?.title && (
                                <div>💼 {part.input.title}</div>
                              )}
                              <div>
                                📅{" "}
                                {new Date(
                                  part.input.dateTime,
                                ).toLocaleString()}
                              </div>
                              {part.input?.timeZone && (
                                <div>🌍 {part.input.timeZone}</div>
                              )}
                            </div>
                          )}
                          {part.state === "output-available" &&
                            typeof part.output === "string" &&
                            part.output.startsWith("BOOKING_SUCCESS") && (
                              <div className="text-[11px] xl:text-sm 2xl:text-base text-emerald-600 dark:text-emerald-400 font-medium border-t pt-1 xl:pt-2 mt-1 xl:mt-2 border-emerald-500/10">
                                Google Meet calendar invite sent!
                              </div>
                            )}
                          {part.state === "output-available" &&
                            typeof part.output === "string" &&
                            part.output.startsWith("BOOKING_ERROR") && (
                              <div className="flex items-center gap-1.5 text-[11px] xl:text-sm 2xl:text-base text-red-400 font-medium border-t pt-1 xl:pt-2 mt-1 xl:mt-2 border-red-500/10">
                                <AlertCircle className="size-3.5 xl:size-4 shrink-0" />
                                {part.output.replace("BOOKING_ERROR: ", "")}
                              </div>
                            )}
                          {part.state === "output-error" && (
                            <div className="flex items-center gap-1.5 text-[11px] xl:text-sm 2xl:text-base text-red-400 font-medium border-t pt-1 xl:pt-2 mt-1 xl:mt-2 border-red-500/10">
                              <AlertCircle className="size-3.5 xl:size-4 shrink-0" />
                              {part.errorText}
                            </div>
                          )}
                        </div>
                      );

                    default:
                      return null;
                  }
                })}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* INPUT SECTION */}
      <div className="p-4 xl:p-6 2xl:p-8 border-t bg-card/30 backdrop-blur-sm">
        <PromptInput onSubmit={handleSubmit} globalDrop multiple>
          <PromptInputHeader>
            <PromptInputAttachmentsDisplay />
          </PromptInputHeader>

          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              placeholder="Ask me anything..."
              className="text-sm xl:text-xl 2xl:text-2xl xl:min-h-[60px] 2xl:min-h-[80px] bg-transparent border-none focus-visible:ring-0"
            />
          </PromptInputBody>

          <PromptInputFooter className="flex items-center justify-between pt-2">
            <PromptInputTools className="flex gap-2 xl:gap-4">
              {/* Web Search Button commented out below */}
              {/* <PromptInputButton
                onClick={() => setUseWebSearch(!useWebSearch)}
                variant={useWebSearch ? "default" : "outline"}
                className={cn("h-8 xl:h-12 2xl:h-14 rounded-full text-[11px] xl:text-base 2xl:text-lg font-bold uppercase tracking-wider transition-all xl:px-6", useWebSearch ? "shadow-sm" : "hover:bg-primary/5 text-muted-foreground")}
              >
                <GlobeIcon className="size-3.5 xl:size-5 2xl:size-6 mr-1.5 xl:mr-2" />
                <span>Search</span>
              </PromptInputButton> 
              */}

              <ModelSelector
                onOpenChange={setModelSelectorOpen}
                open={modelSelectorOpen}
              >
                <ModelSelectorTrigger asChild>
                  <PromptInputButton
                    variant="outline"
                    className="h-8 xl:h-12 2xl:h-14 rounded-full text-[11px] xl:text-base 2xl:text-lg font-bold uppercase tracking-wider xl:px-6"
                  >
                    {selectedModelData?.chefSlug && (
                      <ModelSelectorLogo
                        provider={selectedModelData.chefSlug}
                        className="mr-1.5 xl:mr-2 size-3.5 xl:size-5 2xl:size-6"
                      />
                    )}
                    <ModelSelectorName>
                      {selectedModelData?.name || "Model"}
                    </ModelSelectorName>
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent className="z-[100] max-w-[320px]">
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    {chefs.map((chef) => (
                      <ModelSelectorGroup heading={chef} key={chef}>
                        {models
                          .filter((m) => m.chef === chef)
                          .map((m) => (
                            <ModelItem
                              key={m.id}
                              m={m}
                              onSelect={handleModelSelect}
                              selectedModel={model}
                            />
                          ))}
                      </ModelSelectorGroup>
                    ))}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>

            <PromptInputSubmit
              disabled={!text && status !== "ready"}
              status={status}
              className="rounded-full size-9 xl:size-14 2xl:size-16 shrink-0 shadow-lg shadow-primary/20"
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

export default RAGChatBot;
