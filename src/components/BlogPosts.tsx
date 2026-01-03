import { motion } from 'framer-motion';
import { FiBookOpen, FiCalendar, FiClock, FiExternalLink } from 'react-icons/fi';
import { BlogPost } from '@/types';

interface BlogPostsProps {
  posts: BlogPost[];
  isInView: boolean;
}

const BlogPosts = ({ posts, isInView }: BlogPostsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-effect rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <FiBookOpen size={24} className="text-purple-400" />
        <h2 className="text-xl font-bold text-gray-200">Blog Posts</h2>
      </div>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            whileHover={{ y: -2 }}
            className="block p-4 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-purple-500/20 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-200 group-hover:text-purple-400 transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar size={12} />
                    <span>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {post.readTime && (
                    <div className="flex items-center gap-1.5">
                      <FiClock size={12} />
                      <span>{post.readTime}</span>
                    </div>
                  )}
                </div>
              </div>
              <FiExternalLink
                size={20}
                className="text-gray-500 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-1"
              />
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default BlogPosts;

