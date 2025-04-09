import Home from "../pages/Home/Home";
import Calendar from "../pages/Calendar/Calendar";
import Note from "../pages/Note/Note";
import Task from "../pages/Task/Task";
import DefaultLayout from "../components/layout/DefaultLayout";
import CreateTask from "@/components/Task/CreateTask";
import LoginPage from "@/pages/Authentication/Login";
import LoginLayout from "@/components/layout/LoginLayout";
import { Trash } from "lucide-react";
import CreateNote from "@/components/note/CreateNote";
import GoogleCallback from "@/pages/Authentication/GoogleCallback";
import FacebookCallback from "@/pages/Authentication/FacebookCallback";
import ChatHome from "@/components/chat";
import InvitePage from "@/components/share/InvitePage";
import RegisterPage from "@/pages/Authentication/Register";

const publicRoutes = [
  { path: "/", component: Home, layout: DefaultLayout },
  { path: "/calendar", component: Calendar, layout: DefaultLayout },
  { path: "/note", component: Note, layout: DefaultLayout },
  { path: "/task", component: Task, layout: DefaultLayout },
  { path: "/task/create", component: CreateTask, layout: DefaultLayout },
  { path: "/login", component: LoginPage, layout: LoginLayout },
  { path: "/trash", component: Trash, layout: DefaultLayout },
  { path: "/note/create", component: CreateNote, layout: DefaultLayout },
  { path: "/oauth2/redirect", component: GoogleCallback, layout: null },
  { path: "/oauth2/redirect/facebook", component: FacebookCallback, layout: null },
  { path: "/note/:id", component: CreateNote, layout: DefaultLayout },
  { path: "/task/:id", component: CreateTask, layout: DefaultLayout },
  { path : "/inbox", component : ChatHome, layout : DefaultLayout},
  { path : "/join", component : InvitePage, layout : null},
  { path : "/register", component : RegisterPage, layout : null}
];

export default publicRoutes;
