import Dashboard from "@/features/dashboard";
import LoginPage from "@/features/login-page";
import AppLayout from "@/layouts/app-layout";
import AuthLayout from "@/layouts/auth-layout";
import { Route, Routes } from "react-router";
import ProtectedRoute from "./protected-route";
import EditorPage from "@/features/editor-page";
import EditorLayout from "@/layouts/editor-layout";
import NotFoundPage from "@/features/not-found-page";

export default function Router() {
  return (
      <Routes>
          <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage/>}/>
          </Route>
          <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        <Route element={<EditorLayout />}>
          <Route path="/editor/" element={<EditorPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
