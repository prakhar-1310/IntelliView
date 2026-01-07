import { FaLinkedin, FaGithub } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";

const socials = [
  { Icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/prakhar-shahi1310/" },
  { Icon: FaGithub, label: "GitHub", href: "https://github.com/prakhar-1310" },
  { Icon: SiGmail, label: "Gmail", href: "mailto:prakharshahi9935@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* TOP SECTION */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          
          {/* LEFT: PROFILE */}
          <div className="flex items-center gap-4">
            <img
              src="/profile.jpg"
              alt="Prakhar Shahi"
              className="size-14 rounded-full object-cover border border-base-300"
            />

            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-base-content">
                Prakhar Shahi
              </h3>
              <span className="text-sm text-base-content/60">
                Creator of IntelliView
              </span>
            </div>
          </div>

          {/* RIGHT: SOCIAL LINKS */}
          <div className="flex gap-4 text-lg">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-content/60 hover:text-primary transition-colors duration-200"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-6 h-px w-full bg-base-300" />

        {/* BOTTOM SECTION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-base-content/50">
          <p>
            © {new Date().getFullYear()} IntelliView. All rights reserved.
          </p>

          <p>
            Made with ❤️ by <span className="font-medium text-base-content/70">Prakhar Shahi</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
