// Real-time chat and messaging system
export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type: "text" | "image" | "file" | "system"
  timestamp: Date
  edited?: boolean
  editedAt?: Date
  replyTo?: string
  reactions?: Record<string, string[]> // emoji -> user IDs
  attachments?: Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
  }>
}

export interface ChatRoom {
  id: string
  name: string
  type: "direct" | "group" | "chapter" | "event"
  description?: string
  avatar?: string
  participants: string[]
  admins: string[]
  isPrivate: boolean
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

class RealTimeChatManager {
  private static instance: RealTimeChatManager
  private socket: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private messageHandlers: Map<string, (message: ChatMessage) => void> = new Map()
  private roomHandlers: Map<string, (room: ChatRoom) => void> = new Map()

  static getInstance(): RealTimeChatManager {
    if (!RealTimeChatManager.instance) {
      RealTimeChatManager.instance = new RealTimeChatManager()
    }
    return RealTimeChatManager.instance
  }

  // Connect to WebSocket
  connect(userId: string, token: string): void {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"}/chat?userId=${userId}&token=${token}`

    this.socket = new WebSocket(wsUrl)

    this.socket.onopen = () => {
        if (process.env.NODE_ENV === 'development') {
          console.log("Chat connected")
        }
        this.reconnectAttempts = 0
        this.sendOfflineMessages()
      }

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Message parsing error:", error)
        }
      }
    }

    this.socket.onclose = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log("Chat disconnected")
      }
      this.attemptReconnect(userId, token)
    }

    this.socket.onerror = (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error("Chat error:", error)
      }
    }
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  // Send message
  async sendMessage(
    roomId: string,
    content: string,
    type: "text" | "image" | "file" = "text",
    attachments?: any[],
  ): Promise<void> {
    const message = {
      type: "send_message",
      data: {
        roomId,
        content,
        messageType: type,
        attachments,
        timestamp: new Date(),
      },
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    } else {
      // Store message for later sending
      this.storeOfflineMessage(message)
    }
  }

  // Join room
  joinRoom(roomId: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "join_room",
          data: { roomId },
        }),
      )
    }
  }

  // Leave room
  leaveRoom(roomId: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "leave_room",
          data: { roomId },
        }),
      )
    }
  }

  // Mark messages as read
  markAsRead(roomId: string, messageIds: string[]): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "mark_read",
          data: { roomId, messageIds },
        }),
      )
    }
  }

  // Add reaction to message
  addReaction(messageId: string, emoji: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "add_reaction",
          data: { messageId, emoji },
        }),
      )
    }
  }

  // Register message handler
  onMessage(roomId: string, handler: (message: ChatMessage) => void): void {
    this.messageHandlers.set(roomId, handler)
  }

  // Register room update handler
  onRoomUpdate(roomId: string, handler: (room: ChatRoom) => void): void {
    this.roomHandlers.set(roomId, handler)
  }

  // Get chat rooms
  async getChatRooms(): Promise<ChatRoom[]> {
    try {
      const response = await fetch("/api/chat/rooms")
      if (!response.ok) throw new Error("Failed to fetch rooms")
      return await response.json()
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Get rooms error:", error)
        }
        return []
      }
  }

  // Get room messages
  async getRoomMessages(roomId: string, limit = 50, before?: string): Promise<ChatMessage[]> {
    try {
      const params = new URLSearchParams({ limit: limit.toString() })
      if (before) params.append("before", before)

      const response = await fetch(`/api/chat/rooms/${roomId}/messages?${params}`)
      if (!response.ok) throw new Error("Failed to fetch messages")
      return await response.json()
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Get messages error:", error)
        }
        return []
      }
  }

  // Create new room
  async createRoom(name: string, type: ChatRoom["type"], participants: string[]): Promise<ChatRoom> {
    try {
      const response = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, participants }),
      })

      if (!response.ok) throw new Error("Failed to create room")
      return await response.json()
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Create room error:", error)
        }
        throw error
      }
  }

  private handleMessage(data: any): void {
    switch (data.type) {
      case "new_message":
        const handler = this.messageHandlers.get(data.roomId)
        if (handler) {
          handler(data.message)
        }
        break

      case "room_update":
        const roomHandler = this.roomHandlers.get(data.roomId)
        if (roomHandler) {
          roomHandler(data.room)
        }
        break

      case "typing":
        // Handle typing indicators
        break

      default:
        if (process.env.NODE_ENV === 'development') {
          console.log("Unknown message type:", data.type)
        }
    }
  }

  private attemptReconnect(userId: string, token: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.pow(2, this.reconnectAttempts) * 1000 // Exponential backoff

      setTimeout(() => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
          }
          this.connect(userId, token)
        }, delay)
    }
  }

  private storeOfflineMessage(message: any): void {
    try {
      const stored = localStorage.getItem("offline_messages") || "[]"
      const messages = JSON.parse(stored)
      messages.push(message)
      localStorage.setItem("offline_messages", JSON.stringify(messages))
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Store offline message error:", error)
        }
      }
  }

  // Send stored offline messages when reconnected
  async sendOfflineMessages(): Promise<void> {
    try {
      const stored = localStorage.getItem("offline_messages")
      if (!stored) return

      const messages = JSON.parse(stored)
      for (const message of messages) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(message))
        }
      }

      localStorage.removeItem("offline_messages")
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Send offline messages error:", error)
        }
      }
  }
}

export default RealTimeChatManager
