import './index.css'
import { Button, ChakraProvider, Container, Text } from '@chakra-ui/react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Home } from './Home'
import { ErrorBoundary } from "react-error-boundary";
import { Login } from './Login'
import { LineLoginCallback } from './LineLoginCallback'

const queryClient = new QueryClient()

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/line-login-callback",
      element: <LineLoginCallback />,
    },
  ]);


  return <ChakraProvider resetCSS>
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => {
          return <Container display="flex" justifyContent="center" gap={4}><Text fontSize="lg">🙄問題が発生しました🤯</Text><Button onClick={() => {
            resetErrorBoundary()
          }}>リロード</Button></Container>
        }}
      >
        <QueryClientProvider client={queryClient}>

          <RouterProvider router={router} />
        </QueryClientProvider>
      </ErrorBoundary>
    </ChakraProvider>
}

export default App
