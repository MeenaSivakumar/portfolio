import { motion } from 'framer-motion';
import { FiMessageCircle, FiZap } from 'react-icons/fi';
import { socialLinks } from '@/utils/constants';

const RightSidebar = () => {
  // Generate animated shapes
  const shapes = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 30 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <aside className="w-64 flex-shrink-0 relative">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute border border-purple-500/10 rounded-lg"
            style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              borderRadius: shape.id % 2 === 0 ? '50%' : '20%',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.05, 0.15, 0.05],
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: shape.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sticky top-24 relative z-10"
      >
        {/* Skills Preview - GitHub Style */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-200 mb-4">Top Skills</h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'React Native', 'Flutter', 'Node.js'].map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="px-3 py-1.5 text-sm bg-purple-500/20 text-purple-300 rounded-lg cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Achievements - Animated */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-200 mb-4">Achievements</h3>
          <div className="space-y-3">
            {[
              { icon: FiZap, text: 'Fast Delivery', color: 'from-purple-500 to-blue-500' },
            ].map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.text}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${achievement.color} flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-300">{achievement.text}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions - LinkedIn Style */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-200 mb-4">Quick Actions</h3>
          <motion.a
            href={socialLinks.email}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiMessageCircle size={18} />
            <span>Send Message</span>
          </motion.a>
        </div>

        {/* Animated Pulse Circle */}
        <motion.div
          className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-2xl pointer-events-none"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </aside>
  );
};

export default RightSidebar;

