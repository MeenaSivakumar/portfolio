import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import Modal from './Modal';
import FormField from './FormField';
import Toast from './Toast';
import { validateContactForm, FormData, FormErrors } from '@/utils/formValidation';

// EmailJS Configuration - Set these in your .env file
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Check if EmailJS is configured
const isEmailJSConfigured = EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY &&
  EMAILJS_SERVICE_ID !== 'your_service_id' &&
  EMAILJS_TEMPLATE_ID !== 'your_template_id' &&
  EMAILJS_PUBLIC_KEY !== 'your_public_key';

// Fallback email address
const FALLBACK_EMAIL = 'meenasad09@gmail.com';

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

    setIsSubmitting(true);

    // Helper function to open mailto fallback
    const openMailtoFallback = () => {
      const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;

      setSubmitStatus('success');
      setShowToast(true);

      // Reset form after opening mailto
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setErrors({});
        setIsSubmitting(false);
        setShowToast(false);
        setSubmitStatus('idle');
        onClose();
      }, 2000);
    };

    if (isEmailJSConfigured) {
      try {
        // Send email using EmailJS
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: 'Meena Sivakumar',
        };

        await emailjs.send(
          EMAILJS_SERVICE_ID!,
          EMAILJS_TEMPLATE_ID!,
          templateParams,
          EMAILJS_PUBLIC_KEY!
        );

        setSubmitStatus('success');
        setShowToast(true);

        // Reset form after success
        setTimeout(() => {
          setFormData({ name: '', email: '', message: '' });
          setErrors({});
          setIsSubmitting(false);
          setShowToast(false);
          setSubmitStatus('idle');
          onClose();
        }, 2000);
      } catch (error: unknown) {
        // Log detailed error for debugging
        if (error && typeof error === 'object' && 'text' in error) {
          console.error('EmailJS Error:', (error as { text: string }).text);
        } else {
          console.error('EmailJS failed:', error);
        }
        // EmailJS failed, use mailto fallback
        openMailtoFallback();
      }
    } else {
      // EmailJS not configured, use mailto fallback
      openMailtoFallback();
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

