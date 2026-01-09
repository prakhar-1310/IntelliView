import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, TrophyIcon, LibraryIcon } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { isAdmin } from "../lib/admin";

function Navbar() {
  const location = useLocation();
  const { user } = useUser();

  console.log(location);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <div className="size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg ">
            <SparklesIcon className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              IntelliView
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">Where Interviews meet Execution</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/problems")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* CONTESTS PAGE LINK */}
          <Link
            to={"/contests"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/contests")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <TrophyIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Contests</span>
            </div>
          </Link>

          {/* RESOURCES PAGE LINK */}
          <Link
            to={"/resources"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/resources")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <LibraryIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Resources</span>
            </div>
          </Link>

          {/* DASHBORD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/dashboard")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Dashbord</span>
            </div>
          </Link>

          <div className="ml-4 mt-2 flex items-center gap-2">
            {isAdmin(user) && (
              <span className="badge badge-warning badge-sm">Admin</span>
            )}
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;