import { useLocation } from "react-router"; // keep same import as your app
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, showSidebar = false }) => {
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}

        {/* NOTE: add min-h-0 so the child `main` can scroll correctly inside flex */}
        <div className="flex-1 flex flex-col min-h-0">
          <Navbar />

          {/* main is the scrollable area */}
          <main className="flex-1 overflow-y-auto bg-base-100" >
            {children}
          </main>

          {/* Footer hidden on About page */}
          {!isAboutPage && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
