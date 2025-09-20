import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './context/AuthContext.tsx'
import { LoaderProvider } from './context/LoaderContext.tsx'
import { ColorModeProvider } from './generated/color-mode.tsx'
import { router } from './router.ts'

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <LoaderProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </LoaderProvider>
      </ColorModeProvider>
    </ChakraProvider>
  </StrictMode>
)
