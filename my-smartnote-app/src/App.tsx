import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./components/layout/DefaultLayout";
import publicRoutes from "./routes/route"; // Kiểm tra đúng đường dẫn
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.title = "Smart Note - Quản lý công việc và ghi chú !";
  }, []);
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            const Layout =
              route.layout !== undefined ? route.layout : DefaultLayout;

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  Layout === null ? (
                    <Page />
                  ) : (
                    <Layout>
                      <Page />
                    </Layout>
                  )
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
