import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./Layout"
import ProtectedRoute from "./ProtectedRoute"

const Home = lazy(() => import("../pages/home/home"))
const Login = lazy(() => import("../pages/login/Login"))
const User = lazy(() => import("../pages/user/User"))

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Chargement...</div>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<div>Chargement...</div>}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<div>Chargement...</div>}>
              <User />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
])

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App