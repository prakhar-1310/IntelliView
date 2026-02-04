import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, TrophyIcon, LibraryIcon, TrendingUpIcon } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { isAdmin } from "../lib/admin";

function Navbar() {
  const location = useLocation();
  const { user } = useUser();

  console.log(location);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#fdfcfb]/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-4 hover:scale-105 transition-transform duration-200"
        >
          <div className="size-10 bg-[#451a21] rounded-full flex items-center justify-center border border-white/20 overflow-hidden shadow-lg">
            <img
              src="/logo.png"
              alt="Logo"
              className="size-6 object-contain"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl text-[#451a21] font-serif tracking-tighter uppercase leading-none">
              IntelliView
            </span>
            <span className="text-[10px] text-black/40 font-medium tracking-wider uppercase -mt-1">Where Interviews meet Execution</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 text-[10px] font-bold tracking-wider uppercase
              ${
                isActive("/problems")
                  ? "bg-[#451a21] text-white"
                  : "hover:bg-black/5 text-black/60 hover:text-black"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* CONTESTS PAGE LINK */}
          <Link
            to={"/contests"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 text-[10px] font-bold tracking-wider uppercase
              ${
                isActive("/contests")
                  ? "bg-[#451a21] text-white"
                  : "hover:bg-black/5 text-black/60 hover:text-black"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <TrophyIcon className="size-4" />
              <span className="hidden sm:inline">Contests</span>
            </div>
          </Link>

          {/* RESOURCES PAGE LINK */}
          <Link
            to={"/resources"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 text-[10px] font-bold tracking-wider uppercase
              ${
                isActive("/resources")
                  ? "bg-[#451a21] text-white"
                  : "hover:bg-black/5 text-black/60 hover:text-black"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <LibraryIcon className="size-4" />
              <span className="hidden sm:inline">Resources</span>
            </div>
          </Link>

          {/* CODEFOLIO PAGE LINK */}
          <Link
            to={"/codefolio"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 text-[10px] font-bold tracking-wider uppercase
              ${
                isActive("/codefolio")
                  ? "bg-[#451a21] text-white"
                  : "hover:bg-black/5 text-black/60 hover:text-black"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <TrendingUpIcon className="size-4" />
              <span className="hidden sm:inline">CodeFolio</span>
            </div>
          </Link>

          {/* DASHBORD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 text-[10px] font-bold tracking-wider uppercase
              ${
                isActive("/dashboard")
                  ? "bg-[#451a21] text-white"
                  : "hover:bg-black/5 text-black/60 hover:text-black"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </div>
          </Link>

          <div className="ml-4 mt-2 flex items-center gap-2">
            {isAdmin(user) && (
              <span className="px-2 py-1 bg-[#d4af37] text-white text-[9px] font-bold tracking-wider uppercase rounded">Admin</span>
            )}
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
