import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const FeedLayout = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="flex-1 space-y-6">
      {/* About Card - LinkedIn Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-gray-200 mb-4">About</h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          I am an enthusiastic and quick-learning developer with hands-on experience in React, React Native, TypeScript, Spring Boot, MongoDB, and AWS.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          I enjoy building intuitive user interfaces, scalable backend systems, and integrating design with development through modern tools and workflows.
        </p>
        <p className="text-gray-400 leading-relaxed">
          I have worked across mobile, web, and backend development, and contributed to projects that include multi-step workflows, API integrations, and cloud-based deployments. I'm passionate about solving real problems, improving user experience, and writing clean, maintainable code.
        </p>
      </motion.div>

    </div>
  );
};

export default FeedLayout;

