import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, Menu, HelpCircle, Settings, User } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

/**
 * Navbar
 *
 * Props:
 *  - onToggleSidebar?: () => void   // optional, call to toggle a sidebar (no-op if not provided)
 */
const Navbar = ({ onToggleSidebar = () => {} }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  // Time & Date state
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );

  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center px-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left section: menu toggle + logo (logo only shown when isChatPage like before) */}
        <div className="flex items-center gap-4">
          {/* Menu toggle (optional) */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="btn btn-ghost btn-square p-2 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-base-content opacity-80" />
          </button>

          {isChatPage && (
            <Link to="/" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-9 text-primary" />
              <span className="text-2xl md:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                BEAM
              </span>
            </Link>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Time & Date (hidden on small screens) */}
          <div className="hidden md:flex flex-col items-end text-sm text-base-content/80 mr-4">
            <span className="font-medium">{currentTime}</span>
            <span className="text-xs">{currentDate}</span>
          </div>

          {/* Help / Settings icons (match your Beam example) */}
          <Link to={"/about"}>
          <button className="btn btn-ghost btn-circle" aria-label="Help">
            <HelpCircle className="h-5 w-5 text-base-content opacity-80" />
          </button>
          </Link>


          {/* Notifications */}
          <Link to={"/notifications"}>
            <button className="btn btn-ghost btn-circle" aria-label="Notifications">
              <BellIcon className="h-5 w-5 text-base-content opacity-80" />
            </button>
          </Link>

          {/* Theme selector */}
          <ThemeSelector />

          {/* Avatar */}
          <div className="avatar">
            <div className="w-9 rounded-full overflow-hidden border border-base-300">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>

          {/* Logout */}
          <button
            className="btn btn-ghost btn-circle"
            onClick={logoutMutation}
            aria-label="Logout"
          >
            <LogOutIcon className="h-5 w-5 text-base-content opacity-80" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
