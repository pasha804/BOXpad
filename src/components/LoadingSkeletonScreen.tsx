import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, Users, User, Network, Target } from "lucide-react";
import loadingBackground from "@/assets/1.png";
import portalGif from "@/assets/2.gif";
import { useIsMobile } from "@/hooks/use-mobile";

const hexagons = [
  { Icon: Sparkles, top: "8%", left: "18%", delay: 0 },
  { Icon: ImageIcon, top: "27%", left: "9%", delay: 0.8 },
  { Icon: Users, top: "38%", left: "23%", delay: 1.2 },
  { Icon: User, top: "8%", right: "9%", delay: 0.4 },
  { Icon: Network, top: "22%", right: "24%", delay: 1.6 },
  { Icon: Target, top: "40%", right: "11%", delay: 2 },
];

export function LoadingSkeletonScreen({ preview }: { preview: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#03081a] select-none font-sans">
      {/* Background image - full screen */}
      <div className="fixed inset-0 z-0">
        <img
          src={loadingBackground}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: "top center" }}
          aria-hidden="true"
        />
      </div>

      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_24%,rgba(29,78,216,0.14)_0%,rgba(5,10,30,0)_30%),linear-gradient(90deg,rgba(7,15,40,0.34)_0%,rgba(2,5,16,0.14)_46%,rgba(18,114,255,0.18)_74%,rgba(63,207,255,0.1)_100%)]" />

      {/* Hexagons - scaled and conditionally hidden on mobile */}
      {hexagons.map(({ Icon, delay, ...pos }, index) => {
        // Hide some hexagons on mobile to avoid cluttering the small screen
        if (isMobile && (index === 1 || index === 4)) return null;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5, y: 40 }}
            animate={{
              opacity: 1,
              scale: isMobile ? 0.7 : 1,
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
            className="absolute z-10 flex items-center justify-center"
            style={{
              ...pos,
              width: isMobile ? "60px" : "80px",
              height: isMobile ? "60px" : "80px",
              opacity: 1,
              borderRadius: "12.41px",
              background: "#00000033",
              border: "1.33px solid rgba(255,255,255,0.08)",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              // Slightly adjust positions for mobile to keep them within view
              left: isMobile && pos.left ? `calc(${pos.left} - 5%)` : pos.left,
              right: isMobile && pos.right ? `calc(${pos.right} - 5%)` : pos.right,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                borderRadius: "12.41px",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 20px rgba(0,0,0,0.12)",
              }}
            />
            <Icon
              className="relative z-10 text-blue-50/85"
              style={{ width: "36%", height: "36%" }}
              strokeWidth={1.2}
            />
          </motion.div>
        );
      })}

      {/* GIF and Text - responsive padding and scaling */}
      <div className="absolute inset-0 z-20 flex flex-col items-center pt-[40px] sm:pt-[70px] pointer-events-none px-4">
        {/* GIF - scaled on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-[200px] h-[190px] sm:w-[288px] sm:h-[273px]"
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <img
                src={portalGif}
                alt="Extraction portal"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* Text title - responsive font size */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.5 }}
          className="text-center mt-4 sm:mt-8"
        >
          <h1
            className="text-[24px] sm:text-[32px] md:text-[38px]"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 700,
              lineHeight: "120%",
              color: "white",
            }}
          >
            Extracting Information...
          </h1>
        </motion.div>

        {/* Text subtitle - responsive width and font size */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.7 }}
          className="text-center mt-2 w-full max-w-[530px]"
        >
          <p
            className="text-[14px] sm:text-[16px] md:text-[18px]"
            style={{
              fontFamily: "Ronzino, sans-serif",
              fontWeight: 400,
              lineHeight: "150%",
              color: "white",
            }}
          >
            We are extracting information from the above honey combs
            <br className="hidden sm:block" />
            {" "}to your system
          </p>
        </motion.div>
      </div>

      {/* White dashboard box - responsive height */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex h-[35%] sm:h-[32%] items-end justify-center overflow-hidden pt-3 sm:pt-4">
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.45, ease: "easeOut" }}
          className="h-full w-full max-w-7xl mx-2 overflow-hidden bg-[#FAFBFE] shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:mx-4 md:mx-8 lg:mx-16 xl:mx-24"
        >
          <div className="h-full w-full overflow-auto">{preview}</div>
        </motion.div>
      </div>
    </div>
  );
}
