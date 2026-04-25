import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, Users, User, Network, Target } from "lucide-react";
import loadingCircleGif from "@/assets/loading-circle.gif";

/** Hexagons adapt positions based on screen size via percentage-based positioning */
const hexagons = [
  { Icon: Sparkles, top: "5%", left: "8%", delay: 0 },
  { Icon: ImageIcon, top: "22%", left: "2%", delay: 0.8 },
  { Icon: Users, top: "38%", left: "12%", delay: 1.2 },
  { Icon: User, top: "6%", right: "5%", delay: 0.4 },
  { Icon: Network, top: "20%", right: "15%", delay: 1.6 },
  { Icon: Target, top: "36%", right: "3%", delay: 2 },
];

export function LoadingSkeletonScreen({ preview }: { preview: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#03081a] select-none font-sans">
      {/* ── Upper Dark Section ── */}
      <div className="relative flex-none h-[62vh] sm:h-[68vh] w-full overflow-hidden">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 bg-[#03081a]" />
        
        {/* Cinematic Background Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[100%] h-[120%] bg-[radial-gradient(circle_at_85%_35%,rgba(59,130,246,0.25)_0%,rgba(59,130,246,0.02)_60%,transparent_100%)]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[100%] bg-[radial-gradient(circle_at_15%_75%,rgba(59,130,246,0.18)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,#03081a_100%)]" />

        {/* Floating Hexagons */}
        {hexagons.map(({ Icon, delay, ...pos }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5, y: 40 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -35, 0],
              rotate: [0, 8, 0, -8, 0],
            }}
            transition={{
              opacity: { duration: 1.5, delay: 0.1 + index * 0.12 },
              scale: { duration: 1.5, delay: 0.1 + index * 0.12 },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay },
              rotate: {
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay * 1.5,
              },
            }}
            className="absolute z-10 flex items-center justify-center border border-blue-500/20 bg-[#0c1433]/80 backdrop-blur-xl shadow-[0_0_50px_rgba(37,99,235,0.25)]"
            style={{
              ...pos,
              width: "clamp(42px, 12vw, 86px)",
              height: "clamp(42px, 12vw, 86px)",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <div className="absolute inset-0 bg-blue-400/5 blur-3xl rounded-full" />
            <Icon
              className="relative z-10 text-blue-50/90"
              style={{ width: "36%", height: "36%" }}
              strokeWidth={1.2}
            />
          </motion.div>
        ))}

        {/* Center Content Block */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pt-4 px-4 -translate-y-8 sm:-translate-y-16 lg:-translate-y-24">
          {/* Energy Ring Portal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="relative mb-6 sm:mb-8 lg:mb-10"
          >
            <div className="relative rounded-full w-[120px] h-[120px] sm:w-[160px] sm:h-[160px]">
              {/* Massive Outer Glow */}
              <div className="absolute -inset-24 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.35)_0%,transparent_70%)] blur-[100px] opacity-70" />
              
              {/* Thin Ring Animation */}
              <div className="absolute inset-0 overflow-hidden rounded-full ring-1 ring-blue-500/30">
                <img
                  src={loadingCircleGif}
                  alt="Extraction portal"
                  className="h-full w-full scale-[1.15] object-cover mix-blend-screen brightness-[2.8] contrast-[1.1]"
                  style={{ 
                    maskImage: 'radial-gradient(circle, black 50%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 80%)'
                  }}
                />
              </div>

              {/* Inner details */}
              <div className="absolute inset-0 rounded-full border border-blue-400/20 shadow-[0_0_40px_rgba(37,99,235,0.4)]" />
            </div>
          </motion.div>

          {/* Extraction Status Text */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.5 }}
            className="text-center"
          >
            <h1 className="text-[38px] font-bold text-white tracking-normal leading-[1.2] font-roboto">
              Extracting Information...
            </h1>
            <p className="mt-4 text-[18px] font-normal text-white tracking-normal leading-[1.2] max-w-[530px] mx-auto opacity-100">
              We are extracting information from the above honey combs to your system
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Dashboard Entry Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-30 flex-1 flex flex-col px-0 sm:px-6 lg:px-24 xl:px-40 min-h-0"
      >
        <div className="relative w-full h-full overflow-hidden rounded-none border-t border-white/10 bg-[#FAFBFE] shadow-[0_-50px_150px_rgba(0,0,0,0.65)]">
          <div className="h-full w-full overflow-hidden">{preview}</div>
        </div>
      </motion.div>
    </div>
  );
}
