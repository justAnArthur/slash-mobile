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

  const [chats, setChats] = useState<ChatListResponse[]>([])
  const [messages, setMessages] = useState<Record<string, MessageResponse[]>>(
    {}
  )
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

    let reconnectAttempts = 0
    let reconnectTimeout: ReturnType<typeof setTimeout>
    let shouldReconnect = true

    const connect = () => {
      const wsUrl = `${WS_URL}/ws?id=${session.user.id}`
      ws.current = new WebSocket(wsUrl)

      ws.current.onopen = () => {
        console.log("WebSocket Connected")
        reconnectAttempts = 0
      }

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === "new_message") {
            setMessages((prev) => ({
              ...prev,
              [data.chatId]: [...(prev[data.chatId] || []), data.message]
            }))

            setChats((prevChats) => {
              const chatIndex = prevChats.findIndex(
                (chat) => chat.id === data.chatId
              )
              if (chatIndex !== -1) {
                const updatedChat = {
                  ...prevChats[chatIndex],
                  lastMessage: data.message
                }
                return [
                  ...prevChats.slice(0, chatIndex),
                  updatedChat,
                  ...prevChats.slice(chatIndex + 1)
                ]
              } else {
                setNewChatId(data.chatId)
                return prevChats // Return unchanged state if chatId not found
              }
            })
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

        if (shouldReconnect) {
          const timeout = Math.min(10000, 1000 * 2 ** reconnectAttempts) // exponential backoff capped at 10s
          reconnectAttempts++
          reconnectTimeout = setTimeout(connect, timeout)
        }
      }
    }

    connect()

    return () => {
      shouldReconnect = false
      clearTimeout(reconnectTimeout)
      ws.current?.close()
    }
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
