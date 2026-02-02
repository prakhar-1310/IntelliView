import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
  Bot,
  MessageSquareCode,
  ChartNoAxesCombined,
  Menu,
  ArrowDown,
  ArrowUpRight,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

function HomePage() {
  const tracks = [
    { id: "01", name: "AI Mock Interviews", desc: "Our AI interviewer adapts questions based on your role, skill level, and performance—simulating real high-stakes environments.", active: false },
    { id: "02", name: "HD Video Collaboration", desc: "Crystal clear video and audio with sub-50ms latency for seamless pair programming and communication.", active: false },
    { id: "03", name: "Instant AI Feedback", desc: "Receive detailed breakdowns of your logic, communication skills, and architectural approach within seconds of completion.", active: true },
    { id: "04", name: "Performance Analytics", desc: "Track your technical evolution with interview scores, strengths, and targeted improvement insights powered by our proprietary model.", active: false },
  ];

  const statsItems = [
    { 
      title: "1K+ Active Engineers", 
      desc: "A growing community of elite developers mastering their craft through our collaborative workspace.", 
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&ixlib=rb-4.0.3" 
    },
    { 
      title: "5K+ Sessions Ran", 
      desc: "Thousands of technical simulations and pair programming sessions delivered with 99.9% uptime.", 
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&ixlib=rb-4.0.3" 
    },
    { 
      title: "AI-Powered Analysis", 
      desc: "Proprietary models that evaluate communication, code quality, and problem-solving patterns.", 
      img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&ixlib=rb-4.0.3" 
    },
    { 
      title: "Global Hiring Success", 
      desc: "Our candidates have successfully transitioned into roles at OpenAI, Google, and Stripe.", 
      img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop&ixlib=rb-4.0.3" 
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfcfb]">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#fdfcfb]/80 backdrop-blur-md px-6 py-6 border-b border-black/5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="size-10 bg-[#451a21] rounded-full flex items-center justify-center border border-white/20 overflow-hidden">
              <img src="/logo.png" alt="IntelliView Logo" className="size-6 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-[#451a21] font-serif tracking-tighter uppercase leading-none">INTELLIVIEW</span>
              <div className="w-full h-[1px] bg-[#451a21] mt-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </div>
          </Link>

          <div className="flex items-center gap-12">
            <SignInButton mode="modal">
              <a href="#" className="text-[10px] font-bold tracking-[0.2em] uppercase border-b border-black/40 pb-1">Get Started</a>
            </SignInButton>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-[48%] bg-[#451a21] p-8 lg:p-20 flex flex-col justify-between relative text-[#fdfcfb] pt-32 lg:pt-40">
          <div className="space-y-12">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="h-[1px] w-12 bg-white/40"></div>
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">
                  Where Interviews meet Execution
                </div>
              </div>
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-80 text-right leading-relaxed">
                Staff Engineers<br />& AI-Powered<br />Simulations
              </div>
            </div>
            
            <h1 className="text-7xl md:text-[9rem] font-serif font-light leading-[0.85] tracking-tighter">
              Code live.<br />
              Think aloud.<br />
              with <span className="relative">
                Confidence.
                <div className="absolute -right-16 top-1/2 -translate-y-1/2 size-12 rounded-full border border-white/30 flex items-center justify-center">
                  <div className="size-6 border-2 border-white/60 rounded-sm rotate-45 flex items-center justify-center">
                    <div className="size-2 bg-[#d4af37] rounded-full"></div>
                  </div>
                </div>
              </span>
            </h1>

            <div className="max-w-sm space-y-4">
              <p className="text-sm opacity-70 font-light leading-relaxed">
                The ultimate platform for collaborative coding interviews and pair programming. 
                Connect face-to-face, code in real-time, and ace your technical assessments with professional rigor.
              </p>
            </div>
          </div>

          <div className="pt-12 flex items-center gap-8">
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="size-16 rounded-full border border-white/20 flex items-center justify-center group cursor-pointer hover:bg-white/10 transition-all"
            >
              <ArrowDown className="size-5 group-hover:translate-y-1 transition-transform" />
            </button>
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40">
              Scroll to Explore
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[52%] relative overflow-hidden bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop" 
            alt="Lead Architectural Coach" 
            className="w-full h-full object-cover grayscale brightness-75 contrast-125 hover:scale-105 transition-transform duration-[3s] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-16 right-16 text-right space-y-1">
            <div className="text-[#fdfcfb] font-serif text-5xl tracking-tighter">Elena Vance</div>
            <div className="text-[#fdfcfb]/60 text-[10px] font-bold tracking-[0.3em] uppercase">
              Principal AI Interviewer<br />Specializing in Distributed Systems
            </div>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-24 px-6 border-b border-black/5 bg-[#fdfcfb]">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-24">
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#451a21] border-b border-[#451a21]/20 inline-block pb-2">Our Mission</h4>
            <p className="text-2xl font-serif text-black/70 leading-relaxed font-light">
              To provide elite, tailored interview preparation solutions with surgical technical precision and unwavering professional integrity.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#451a21] border-b border-[#451a21]/20 inline-block pb-2">Our Promise</h4>
            <p className="text-2xl font-serif text-black/70 leading-relaxed font-light">
              To protect your professional standards and champion your technical evolution at every turn of your engineering journey.
            </p>
          </div>
        </div>
      </section>

      {/* ARCHITECTURAL WORKSPACE */}
      <section className="w-full h-[70vh] relative overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop" 
          alt="Architectural Workspace" 
          className="w-full h-full object-cover grayscale brightness-40 group-hover:scale-110 transition-transform duration-[5s]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-2">
            <div className="text-[10px] font-bold tracking-[0.6em] uppercase text-white/50">Technical Mastery</div>
            <h3 className="text-white text-6xl md:text-[8rem] font-serif font-light tracking-tighter leading-none">
              Elite Simulations,<br />
              Proven <span className="italic">Execution.</span>
            </h3>
          </div>
          <div className="w-[1px] h-24 bg-white/30"></div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 px-6 bg-[#fdfcfb]">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-16 border-t border-black/10 pt-16">
          <div className="lg:col-span-5 space-y-8">
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/40">The Platform</div>
            <h2 className="text-6xl font-serif text-[#451a21] leading-[0.9] tracking-tight">
              Everything You <br /> Need to Ace <br /> the Assessment.
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-end">
            <p className="text-xl text-black/60 font-light max-w-xl leading-relaxed">
              IntelliView is an all-in-one platform for real-time coding interviews, pair programming, and mock interview practice. Connect live, code together, and sharpen your skills to crack technical interviews with absolute confidence.
            </p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto mt-24">
          {tracks.map((track) => (
            <SignInButton key={track.id} mode="modal">
              <div
                className={`group relative border-t border-black/10 py-16 px-6 transition-all duration-700 cursor-pointer block ${track.active ? 'bg-[#d4af37] text-white border-transparent shadow-2xl' : 'hover:bg-[#451a21] hover:text-white hover:border-transparent'}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
                  <div className="space-y-4">
                    <h3 className="text-5xl md:text-7xl font-serif font-medium tracking-tighter">
                      {track.name}
                    </h3>
                    <p className={`text-sm tracking-[0.1em] font-light max-w-lg transition-opacity duration-500 ${track.active ? 'text-white/80' : 'text-black/40 group-hover:text-white/70'}`}>
                      {track.desc}
                    </p>
                  </div>
                  
                  <div className={`size-20 rounded-full border flex items-center justify-center transition-all duration-500 ${track.active ? 'bg-white border-transparent text-[#d4af37] rotate-45' : 'border-black/20 group-hover:border-white/40 text-black group-hover:text-white group-hover:rotate-45'}`}>
                    <ArrowUpRight className="size-10" strokeWidth={1} />
                  </div>
                </div>
              </div>
            </SignInButton>
          ))}
          <div className="border-t border-black/10"></div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-40 px-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto text-center mb-32 space-y-8">
          <h2 className="text-7xl md:text-[10rem] font-serif text-[#451a21] leading-[0.8] tracking-tighter">
            Insight, <br />
            Precision, <br />
            <span className="italic">Success.</span>
          </h2>
          <div className="w-16 h-[1px] bg-[#d4af37] mx-auto mt-8"></div>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {statsItems.map((item, i) => (
            <div 
              key={i}
              className="group cursor-default"
            >
              <div className="aspect-[4/5] grayscale overflow-hidden mb-8 shadow-2xl bg-black/5">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" 
                  loading="lazy"
                />
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#451a21] border-b border-black/5 pb-4 transition-colors group-hover:text-[#d4af37] group-hover:border-[#d4af37]/30">{item.title}</h4>
                <p className="text-sm text-black/50 font-light leading-relaxed group-hover:text-black/80 transition-colors">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 bg-[#451a21] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 size-96 border border-white/5 rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 size-96 border border-white/5 rounded-full"></div>

        <div className="max-w-5xl mx-auto text-center space-y-16 relative z-10 px-6">
          <div className="space-y-4">
            <h2 className="text-6xl md:text-[9rem] font-serif text-white leading-[0.85] tracking-tighter">
              Elevate Your <br />
              Standard of <br />
              <span className="italic opacity-80">Execution.</span>
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-12">
            <SignInButton mode="modal">
              <button className="px-16 py-6 bg-[#d4af37] text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:text-[#451a21] transition-all duration-500 shadow-2xl">
                Start Preparation
              </button>
            </SignInButton>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-10 py-4 border-b border-white/20 text-white/60 font-bold uppercase tracking-[0.3em] text-[10px] hover:text-white hover:border-white transition-all"
            >
              Review Success Stories
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-6 bg-[#451a21] text-[#fdfcfb]">
        <div className="max-w-7xl mx-auto">
          {/* TOP SECTION */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12 mb-16">
            {/* LEFT: CREATOR PROFILE */}
            <div className="flex items-center gap-4">
              <img
                src="/profile.jpg"
                alt="Prakhar Shahi"
                className="size-16 rounded-full object-cover border-2 border-[#d4af37]/30"
              />
              <div className="flex flex-col">
                <h3 className="text-xl font-serif font-semibold text-white">
                  Prakhar Shahi
                </h3>
                <span className="text-sm text-white/60 font-light">
                  Creator of IntelliView
                </span>
              </div>
            </div>

            {/* RIGHT: SOCIAL LINKS */}
            <div className="flex gap-6">
              <a
                href="https://www.linkedin.com/in/prakhar-shahi1310/"
                target="_blank"
                rel="noopener noreferrer"
                className="size-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#d4af37] hover:border-[#d4af37] transition-all group"
              >
                <Linkedin className="size-5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://github.com/prakhar-1310"
                target="_blank"
                rel="noopener noreferrer"
                className="size-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#d4af37] hover:border-[#d4af37] transition-all group"
              >
                <Github className="size-5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="mailto:prakharshahi9935@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="size-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#d4af37] hover:border-[#d4af37] transition-all group"
              >
                <Twitter className="size-5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="h-[1px] w-full bg-white/10 mb-16"></div>

          {/* MIDDLE SECTION - LOGO & LINKS */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="space-y-6 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-white/10 rounded-full flex items-center justify-center overflow-hidden border border-[#d4af37]/30">
                  <img src="/logo.png" alt="IntelliView Logo" className="size-6 object-contain" />
                </div>
                <span className="text-2xl font-serif tracking-tighter uppercase">INTELLIVIEW</span>
              </div>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                Revolutionizing technical assessment through architectural precision and AI-powered collaboration.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold tracking-widest uppercase opacity-40">Resources</h5>
                <ul className="text-sm font-light space-y-2">
                  <li className="hover:text-[#d4af37] transition-colors cursor-pointer text-white/80">Assessments</li>
                  <li className="hover:text-[#d4af37] transition-colors cursor-pointer text-white/80">Documentation</li>
                  <li className="hover:text-[#d4af37] transition-colors cursor-pointer text-white/80">API Status</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold tracking-widest uppercase opacity-40">Company</h5>
                <ul className="text-sm font-light space-y-2">
                  <li className="hover:text-[#d4af37] transition-colors cursor-pointer text-white/80">Our Vision</li>
                  <li className="hover:text-[#d4af37] transition-colors cursor-pointer text-white/80">Careers</li>
                  <li className="hover:text-[#d4af37] transition-colors cursor-pointer text-white/80">Journal</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold tracking-widest uppercase opacity-40">Legal</h5>
                <ul className="text-sm font-light space-y-2">
                  <li className="hover:text-[#d4af37] transition-colors cursor-pointer text-white/80">Privacy Policy</li>
                  <li className="hover:text-[#d4af37] transition-colors cursor-pointer text-white/80">Terms of Service</li>
                  <li className="hover:text-[#d4af37] transition-colors cursor-pointer text-white/80">Cookie Policy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] tracking-wider uppercase opacity-40">
            <span>&copy; {new Date().getFullYear()} IntelliView. All rights reserved.</span>
            <span className="font-light">
              Made with <span className="text-[#d4af37]">❤️</span> by Prakhar Shahi
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default HomePage;
