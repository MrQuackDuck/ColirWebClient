import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import IndexPage from '@/pages/index/ui/IndexPage';
import { ThemeProvider } from '@/shared/lib/theme-provider';
import Header from '@/widgets/header/ui/Header';
import { Toaster } from '@/shared/ui/toaster';

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage/>,
  },
  {
    path: "/chat",
    element: <h1 className='text-center'>Welcome on the chat page!</h1>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header/>
      <RouterProvider router={router} />
      <Toaster/>
    </ThemeProvider>
  </StrictMode>,
)
