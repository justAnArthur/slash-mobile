import { authClient } from "@/lib/auth"
import type { ChatListResponse } from "@slash/backend/src/api/chats/chats.api"
import type { MessageResponse } from "@slash/backend/src/api/messages/messages.api"
import type React from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { backend } from "./backend"
import { WS_URL } from "./backend/url"
import { useBackend } from "./backend/use"

type WebSocketContextType = {
  messages: Record<string, MessageResponse[]>
  setMessages: React.Dispatch<
    React.SetStateAction<Record<string, MessageResponse[]>>
  >
  chats: ChatListResponse[]
  setChats: React.Dispatch<React.SetStateAction<ChatListResponse[]>>
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
)

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { data: session } = authClient.useSession()

  const ws = useRef<WebSocket | null>(null)

  const [messages, setMessages] = useState<Record<string, MessageResponse[]>>(
    {}
  )
  const [chats, setChats] = useState<ChatListResponse[]>([])
  const [newChatId, setNewChatId] = useState<string | null>(null)

  const { data: newChatData } = useBackend<ChatListResponse>(
    () =>
      newChatId ? backend.chats.fetch[newChatId].get() : Promise.resolve(null),
    [newChatId],
    {
      transform: (data) => data?.data
    }
  )

  useEffect(() => {
    if (newChatData) {
      setChats((prev) => [newChatData, ...prev].flat())
    }
  }, [newChatData])

  useEffect(() => {
    if (!session?.user.id) return

    const wsUrl = `${WS_URL}/ws?id=${session.user.id}`
    ws.current = new WebSocket(wsUrl)

    ws.current.onopen = () => {
      console.log("WebSocket Connected")
    }

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "new_message") {
          setMessages((prev) => ({
            ...prev,
            [data.chatId]: [...(prev[data.chatId] || []), data.message]
          }))

          const chatIndex = chats.findIndex((chat) => chat.id === data.chatId)
          if (chatIndex !== -1) {
            setChats((prev) => {
              const updatedChat = {
                ...prev[chatIndex],
                lastMessage: data.message
              }
              return [
                ...prev.slice(0, chatIndex),
                updatedChat,
                ...prev.slice(chatIndex + 1)
              ]
            })
          } else {
            setNewChatId(data.chatId)
          }
        }

        if (data.type === "new_chat") {
          setChats((prev) => [...prev, data.chat])
        }
        if (data.type === "delete_chat") {
          setChats((prev) => prev.filter((el) => el.id !== data.chatId))
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket Error:", error)
    }

    ws.current.onclose = () => {
      console.log("WebSocket Disconnected")
    }

    return () => ws.current?.close()
  }, [session?.user.id])

  return (
    <WebSocketContext.Provider
      value={{ messages, setMessages, chats, setChats }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext)

  if (!context)
    throw new Error("useWebSocket must be used within a WebSocketProvider")

  return context
}
