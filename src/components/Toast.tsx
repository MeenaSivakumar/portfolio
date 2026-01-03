import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

const Toast = ({ message, type, show }: ToastProps) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`p-3 border rounded-lg text-sm text-center ${
        type === 'success'
          ? 'bg-green-500/20 border-green-500/30 text-green-400'
          : 'bg-red-500/20 border-red-500/30 text-red-400'
      }`}
    >
      {message}
    </motion.div>
  );
};

export default Toast;

