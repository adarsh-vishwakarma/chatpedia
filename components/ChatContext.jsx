import { useMutation } from '@tanstack/react-query'
import {
    ReactNode,
    createContext,
    useRef,
    useState,
  } from 'react'

  export const ChatContext = createContext({
    addMessage: () => {},
    message: '',
    handleInputChange: () => {},
    isLoading: false,
  })

  export const ChatContextProvider = ({
    fileId,
    children,
  }) => {
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const sendMessageMutation = useMutation({
        mutationFn: async ({ fileId, message }) => {
          const response = await fetch('/api/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileId, message }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to send message');
          }
      
          return response.json(); // Return parsed JSON instead of `response.body`
        },
      });

      const handleInputChange = (
        e
      ) => {
        setMessage(e.target.value)
      }

      const addMessage = () => sendMessage({ message })
      return (
        <ChatContext.Provider
          value={{
            addMessage,
            message,
            handleInputChange,
            isLoading,
          }}>
          {children}
        </ChatContext.Provider>
      )
    }