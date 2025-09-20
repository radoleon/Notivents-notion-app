import { createContext, useState, type ReactNode } from 'react'

type LoaderContextType = {
  isLoading: boolean
  setIsLoading: (value: boolean) => void
}

export const LoaderContext = createContext<LoaderContextType | undefined>(undefined)

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>{children}</LoaderContext.Provider>
  )
}
