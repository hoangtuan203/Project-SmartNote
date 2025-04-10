import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import {
  getTasksByDay,
  getCompletionRatio,
  getTasksByPriority,
  getOverdueTasks,
  TaskByDateResponse,
  TaskByPriorityResponse,
  OverdueTaskResponse,
} from "@/service/StatisticalService";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#00C49F", "#FF8042"];

export default function Dashboard() {
  const [taskDataByDay, setTaskDataByDay] = useState<TaskByDateResponse[]>([]);
  const [completionRatio, setCompletionRatio] = useState<
    { name: string; value: number }[]
  >([]);
  const [taskByPriority, setTaskByPriority] = useState<
    TaskByPriorityResponse[]
  >([]);
  const [overdueTasks, setOverdueTasks] = useState<OverdueTaskResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const [byDay, ratio, byPriority, overdue] = await Promise.all([
          getTasksByDay(Number(userId)),
          getCompletionRatio(Number(userId)),
          getTasksByPriority(Number(userId)),
          getOverdueTasks(Number(userId)),
        ]);

        setTaskDataByDay(byDay);
        setTaskByPriority(byPriority);
        setOverdueTasks(overdue);

        // Calculate completion ratio
        const totalTasks = byDay.reduce((sum, item) => sum + item.completed, 0);
        const completedTasks = ratio
          .filter((item) => item.status === "Đã hoàn thành")
          .reduce((sum, item) => sum + item.count, 0);
        const inProgressTasks = ratio
          .filter((item) => item.status === "Đang thực hiện")
          .reduce((sum, item) => sum + item.count, 0);
        setCompletionRatio([
          { name: "Đã Hoàn Thành", value: completedTasks },
          { name: "Đang Thực Hiện", value: inProgressTasks },
        ]);

        // Log for debugging
        console.log("task by day:", byDay);
        console.log("completion:", ratio);
        console.log("task by priority:", byPriority);
        console.log("overdueTasks:", overdue);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Công việc hoàn thành theo ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={350} height={250} data={taskDataByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" /> {/* Changed from "date" */}
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Đã hoàn thành"
              />
            </LineChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ hoàn thành công việc</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PieChart width={250} height={250}>
              <Pie
                data={completionRatio}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
                dataKey="value"
              >
                {completionRatio.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Số lượng công việc theo độ ưu tiên</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={400} height={250} data={taskByPriority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" name="Số lượng">
                {taskByPriority.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#82ca9d", "#8884d8", "#ff7300"][index % 3]} // Three distinct colors
                  />
                ))}
              </Bar>
            </BarChart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Số lượng công việc quá hạn</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={400} height={250} data={overdueTasks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#f87171" name="Tasks quá hạn" />
            </BarChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
