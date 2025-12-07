import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  // Generate animated lines
  const lines = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    length: Math.random() * 200 + 100,
    angle: Math.random() * 360,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }));

  // Generate geometric shapes
  const shapes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 60 + 20,
    rotation: Math.random() * 360,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * 5,
  }));

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

      {/* Animated dots pattern */}
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
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

