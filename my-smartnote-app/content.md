import { useState } from "react";
import { FaHome, FaProjectDiagram, FaCalendarAlt, FaCog, FaTrash, FaRobot } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { name: "Home", icon: <FaHome /> },
  { name: "Projects", icon: <FaProjectDiagram /> },
  { name: "AI Assistant", icon: <FaRobot /> },
  { name: "Calendar", icon: <FaCalendarAlt /> },
  { name: "Settings", icon: <FaCog /> },
  { name: "Trash", icon: <FaTrash /> },
];

const projects = [
  { id: 1, title: "Video Editing Project", progress: 70 },
  { id: 2, title: "Photography Portfolio", progress: 40 },
  { id: 3, title: "Personal Blog", progress: 90 },
];

const learnItems = [
  { title: "The ultimate guide to Notion templates", time: "5 min read" },
  { title: "Customize & style your content", time: "9 min read" },
];

type Project = {
  id: number;
  title: string;
  progress: number;
};

type LearnItem = {
  title: string;
  time: string;
};

export default function SmartProject() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">SmartProject</h1>
        <nav className="space-y-4">
          {sidebarItems.map((item) => (
            <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition">
              {item.icon} <span>{item.name}</span>
            </div>
          ))}
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-gray-800">Good afternoon, User</h2>
          <Button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">+ Create New Project</Button>
        </div>

        {/* Recently Visited */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700">Recently visited</h3>
          <div className="grid grid-cols-3 gap-6 mt-4">
            {projects.map((project: Project) => (
              <div key={project.id} className="p-5 bg-white shadow-md rounded-lg hover:shadow-lg transition">
                <h4 className="font-medium text-gray-900">{project.title}</h4>
                <div className="h-1 bg-gray-300 mt-3 rounded-full">
                  <div className="h-1 bg-blue-500" style={{ width: `${project.progress}%` }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{project.progress}% completed</p>
              </div>
            ))}
          </div>
        </section>

        {/* Learn */}
        <section className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700">Learn</h3>
          <div className="grid grid-cols-2 gap-6 mt-4">
            {learnItems.map((item: LearnItem) => (
              <div key={item.title} className="p-5 bg-white shadow-md rounded-lg hover:shadow-lg transition">
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{item.time}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
