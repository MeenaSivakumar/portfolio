import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';
import Modal from './Modal';
import FormField from './FormField';
import Toast from './Toast';
import { validateContactForm, FormData, FormErrors } from '@/utils/formValidation';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactFormModal = ({ isOpen, onClose }: ContactFormModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showToast, setShowToast] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
    
    // Reset status when user starts typing
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setShowToast(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateContactForm(formData);
    setErrors(validationErrors);

    if (!isValid) {
      const errorKeys = Object.keys(validationErrors).filter(
        (key) => validationErrors[key as keyof FormErrors]
      );
      if (errorKeys.length > 0) {
        setTimeout(() => {
          const errorElement = document.getElementById(`modal-${errorKeys[0]}`);
          errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement?.focus();
        }, 100);
      }
      return;
    }

    setSubmitStatus('success');
    setShowToast(true);
    setTimeout(() => setIsSubmitting(true), 500);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setIsSubmitting(false);
      setShowToast(false);
      setSubmitStatus('idle');
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setShowToast(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setShowToast(false);
        setSubmitStatus('idle');
      }, 3000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Get In Touch"
      description="Fill out the form below and I'll get back to you soon!"
      firstInputRef={firstInputRef}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          id="modal-name"
          name="name"
          label="Name"
          icon={<FiUser size={16} />}
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={isSubmitting}
          placeholder="Your name"
          inputRef={firstInputRef}
        />

        <FormField
          id="modal-email"
          name="email"
          label="Email"
          icon={<FiMail size={16} />}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isSubmitting}
          type="email"
          placeholder="your.email@example.com"
        />

        <FormField
          id="modal-message"
          name="message"
          label="Message"
          icon={<FiMessageSquare size={16} />}
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          disabled={isSubmitting}
          type="textarea"
          placeholder="Tell me about your project or just say hi..."
        />

        <Toast
          show={showToast}
          type={submitStatus === 'success' ? 'success' : 'error'}
          message={
            submitStatus === 'success'
              ? 'Message sent successfully! 🎉'
              : 'Something went wrong. Please try again.'
          }
        />

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-300 purple-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Sending...
            </>
          ) : (
            <>
              <FiSend size={18} />
              Send Message
            </>
          )}
        </motion.button>
      </form>
    </Modal>
  );
};

export default ContactFormModal;

