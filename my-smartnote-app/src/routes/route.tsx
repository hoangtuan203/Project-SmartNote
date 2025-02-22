import Home from "../pages/Home";
import Calendar from "../pages/Calendar";
import Note from "../pages/Note";
import Task from "../pages/Task";
import DefaultLayout from "../components/layout/DefaultLayout"; // ✅ Đúng đường dẫn
import CreateTask from "@/components/Task/CreateTask";
import LoginPage from "@/pages/Login";
import LoginLayout from "@/components/layout/LoginLayout";
import Private from "@/pages/Private";
import { Trash } from "lucide-react";

const publicRoutes = [
  { path: "/", component: Home, layout: DefaultLayout },
  { path: "/calendar", component: Calendar, layout: DefaultLayout },
  { path: "/note", component: Note, layout: DefaultLayout },
  { path: "/task", component: Task, layout: DefaultLayout },
  { path: "/task/createTask", component: CreateTask, layout: DefaultLayout },
  { path: "/login", component: LoginPage, layout: LoginLayout },
  { path: "/private/documents", component: Private, layout: DefaultLayout },
  { path: "/trash", component: Trash, layout: DefaultLayout },
];

export default publicRoutes;
