import Header from "./Header";
import Sidebar from "./SideBar";
import { ThemeProvider } from "@/context/ThemeContext";
const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header/>
          <div className="flex-1 p-6 overflow-y-auto">{children}</div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DefaultLayout;
