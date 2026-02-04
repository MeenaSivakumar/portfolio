import { motion } from 'framer-motion';
import { useMemo } from 'react';

const AnimatedBackground = () => {
  // Fixed animated lines - reduced count for performance
  const lines = useMemo(() => [
    { id: 0, x: 10, y: 20, length: 180, angle: 45, duration: 20, delay: 0 },
    { id: 1, x: 80, y: 15, length: 150, angle: 135, duration: 18, delay: 2 },
    { id: 2, x: 30, y: 60, length: 200, angle: 90, duration: 22, delay: 1 },
    { id: 3, x: 70, y: 70, length: 160, angle: 180, duration: 25, delay: 3 },
    { id: 4, x: 50, y: 40, length: 140, angle: 270, duration: 19, delay: 1.5 },
  ], []);

  // Fixed geometric shapes - reduced count for performance
  const shapes = useMemo(() => [
    { id: 0, x: 15, y: 25, size: 50, rotation: 0, duration: 30, delay: 0 },
    { id: 1, x: 75, y: 20, size: 40, rotation: 45, duration: 25, delay: 2 },
    { id: 2, x: 40, y: 70, size: 60, rotation: 90, duration: 35, delay: 1 },
    { id: 3, x: 85, y: 60, size: 35, rotation: 180, duration: 28, delay: 3 },
  ], []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Animated grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Animated diagonal lines */}
      {lines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute border-t border-white/5"
          style={{
            width: `${line.length}px`,
            left: `${line.x}%`,
            top: `${line.y}%`,
            transform: `rotate(${line.angle}deg)`,
            transformOrigin: '0 0',
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            x: [0, 50, -50, 0],
            y: [0, 30, -30, 0],
          }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: line.delay,
          }}
        />
      ))}

      {/* Animated geometric shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute border border-white/5"
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            borderRadius: shape.id % 3 === 0 ? '50%' : shape.id % 3 === 1 ? '0%' : '20%',
          }}
          animate={{
            rotate: [shape.rotation, shape.rotation + 360],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.03, 0.08, 0.03],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        />
      ))}

      {/* Animated dots pattern - fixed positions, reduced count */}
      {useMemo(() => [
        { left: 5, top: 10, duration: 3.5, delay: 0 },
        { left: 25, top: 30, duration: 4, delay: 0.5 },
        { left: 45, top: 15, duration: 3, delay: 1 },
        { left: 65, top: 50, duration: 4.5, delay: 0.3 },
        { left: 85, top: 25, duration: 3.2, delay: 0.8 },
        { left: 15, top: 70, duration: 4.2, delay: 1.2 },
        { left: 35, top: 85, duration: 3.8, delay: 0.2 },
        { left: 55, top: 65, duration: 4.8, delay: 0.7 },
        { left: 75, top: 80, duration: 3.3, delay: 1.5 },
        { left: 95, top: 55, duration: 4.3, delay: 0.4 },
      ], []).map((dot, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: dot.delay,
          }}
        />
      ))}

      {/* Scanning line effect */}
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        }}
        animate={{
          y: ['-100%', '200%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;

