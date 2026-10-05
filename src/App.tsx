import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import {
  CheckIcon,
  ChevronDownIcon,
  Cross2Icon,
  FileIcon,
  PaperPlaneIcon,
  PlusIcon,
  ResetIcon,
} from "@radix-ui/react-icons"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import {
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"

type ThemeId = "paper" | "midnight" | "cyan" | "magenta"
type Speaker = "eliza" | "you"

type Attachment = {
  name: string
  size: string
  type: string
}

type Message = {
  id: number
  speaker: Speaker
  text: string
  attachment?: Attachment
}

const themes: { id: ThemeId; label: string }[] = [
  { id: "paper", label: "Paper" },
  { id: "midnight", label: "Midnight" },
  { id: "cyan", label: "Cyan" },
  { id: "magenta", label: "Magenta" },
]

const openingMessage: Message = {
  id: 1,
  speaker: "eliza",
  text: "Good afternoon. I am Eliza. What would you like to discuss?",
}

function elizaReply(input: string, hasAttachment: boolean) {
  const text = input.trim().toLowerCase()

  if (hasAttachment && !text) {
    return "What does sharing this file mean to you?"
  }
  if (/\b(mother|father|family|sister|brother)\b/.test(text)) {
    return "Tell me more about your family."
  }
  if (/\b(sad|unhappy|depressed|upset)\b/.test(text)) {
    return "I am sorry to hear that. What do you think makes you feel this way?"
  }
  if (/\b(happy|glad|better|excited)\b/.test(text)) {
    return "What is it about this that makes you feel that way?"
  }
  if (/\b(always|never)\b/.test(text)) {
    return "Can you think of a specific example?"
  }
  if (/\b(because|cause)\b/.test(text)) {
    return "Is that the real reason?"
  }
  if (/\b(i need|i want|i wish)\b/.test(text)) {
    return "Why is that important to you?"
  }
  if (/\b(i am|i’m|i feel|i've|i have)\b/.test(text)) {
    return "How does saying that make you feel?"
  }
  if (text.endsWith("?")) {
    return "What answer would please you most?"
  }
  if (/\bhello|hi|hey\b/.test(text)) {
    return "Hello. What is on your mind today?"
  }
  if (hasAttachment) {
    return "You chose to share a file. What would you like it to express?"
  }
  return "Please, go on."
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function Button({
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button className={`button ${className}`} {...props}>
      {children}
    </button>
  )
}

function ThemeSwitcher({
  theme,
  onThemeChange,
}: {
  theme: ThemeId
  onThemeChange: (theme: ThemeId) => void
}) {
  const activeTheme = themes.find((item) => item.id === theme) ?? themes[0]

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button className="theme-trigger">
          {activeTheme.label}
          <ChevronDownIcon aria-hidden="true" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="theme-menu"
          sideOffset={8}
          align="end"
        >
          <DropdownMenu.Label className="theme-label">
            Choose a theme
          </DropdownMenu.Label>
          {themes.map((item) => (
            <DropdownMenu.Item
              className="theme-item"
              key={item.id}
              onSelect={() => onThemeChange(item.id)}
            >
              <span>{item.label}</span>
              {theme === item.id ? (
                <CheckIcon className="theme-check" aria-hidden="true" />
              ) : null}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isEliza = message.speaker === "eliza"

  return (
    <article className={`message ${isEliza ? "is-eliza" : "is-you"}`}>
      <span className="speaker">{isEliza ? "Eliza" : "You"}</span>
      <div className="message-bubble">
        <p>{message.text}</p>
        {message.attachment ? (
          <div className="shared-file">
            <FileIcon aria-hidden="true" />
            <span>
              <strong>{message.attachment.name}</strong>
              <small>
                {message.attachment.type || "Document"} ·{" "}
                {message.attachment.size}
              </small>
            </span>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default function App() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem("eliza-theme")
    return themes.some((item) => item.id === saved)
      ? (saved as ThemeId)
      : "paper"
  })
  const [messages, setMessages] = useState<Message[]>([openingMessage])
  const [draft, setDraft] = useState("")
  const [attachment, setAttachment] = useState<Attachment | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const messageEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem("eliza-theme", theme)
  }, [theme])

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isThinking])

  const resetConversation = () => {
    setMessages([openingMessage])
    setDraft("")
    setAttachment(null)
    setIsThinking(false)
  }

  const addFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setAttachment({
      name: file.name,
      size: formatSize(file.size),
      type: file.type.split("/")[1]?.toUpperCase() || "FILE",
    })
    event.target.value = ""
  }

  const sendMessage = (event: FormEvent) => {
    event.preventDefault()
    if ((!draft.trim() && !attachment) || isThinking) return

    const text = draft.trim()
    const includedFile = attachment

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        speaker: "you",
        text: text || "I’d like to share this with you.",
        attachment: includedFile ?? undefined,
      },
    ])
    setDraft("")
    setAttachment(null)
    setIsThinking(true)

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          speaker: "eliza",
          text: elizaReply(text, Boolean(includedFile)),
        },
      ])
      setIsThinking(false)
    }, 650)
  }

  return (
    <main className="app">
      <header className="header">
        <div className="identity">
          <h1>Eliza</h1>
          <p>What is on your mind?</p>
        </div>
        <div className="header-actions">
          <Button
            className="reset-button"
            onClick={resetConversation}
            aria-label="Start a new conversation"
          >
            <ResetIcon aria-hidden="true" />
            <span>Start over</span>
          </Button>
          <ThemeSwitcher theme={theme} onThemeChange={setTheme} />
        </div>
      </header>

      <ScrollArea.Root className="message-scroll">
        <ScrollArea.Viewport className="message-viewport">
          <section className="conversation" aria-label="Conversation with Eliza">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isThinking ? (
              <div className="message is-eliza">
                <span className="speaker">Eliza</span>
                <div
                  className="message-bubble typing"
                  aria-label="Eliza is responding"
                >
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            ) : null}
            <div ref={messageEnd} />
          </section>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="scrollbar" orientation="vertical">
          <ScrollArea.Thumb className="scrollbar-thumb" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      <footer className="composer-region">
        <form className="composer" onSubmit={sendMessage}>
          {attachment ? (
            <div className="attachment">
              <FileIcon aria-hidden="true" />
              <span>
                <strong>{attachment.name}</strong>
                <small>
                  {attachment.type} · {attachment.size}
                </small>
              </span>
              <Button
                className="remove-file"
                type="button"
                onClick={() => setAttachment(null)}
                aria-label="Remove attachment"
              >
                <Cross2Icon aria-hidden="true" />
              </Button>
            </div>
          ) : null}

          <div className="composer-row">
            <input
              ref={fileInput}
              className="file-input"
              type="file"
              onChange={addFile}
              tabIndex={-1}
              aria-hidden="true"
            />
            <Button
              className="attach-button"
              type="button"
              onClick={() => fileInput.current?.click()}
              aria-label="Attach a file"
            >
              <PlusIcon aria-hidden="true" />
            </Button>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder="Write what you are thinking..."
              rows={1}
              aria-label="Message Eliza"
            />
            <Button
              className="send-button"
              type="submit"
              disabled={(!draft.trim() && !attachment) || isThinking}
              aria-label="Send message"
            >
              <PaperPlaneIcon aria-hidden="true" />
              <span>Send</span>
            </Button>
          </div>
        </form>
      </footer>
    </main>
  )
}
