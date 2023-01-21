import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const Home = React.lazy(() => import('./pages/Home/Home'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <React.Suspense><Home /></React.Suspense>
  },
  {
    path: '/home',
    element: <React.Suspense><Home /></React.Suspense>
  }
])

export default function App() {
  return <RouterProvider router={router} />
}