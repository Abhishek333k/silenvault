import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Instagram, Youtube, MessageCircle, Mail } from 'lucide-react';

function App() {
  const [timeLeft, setTimeLeft] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  
  // REFACTOR: Use useRef for scrolling instead of getElementById
  const accessFormRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    // ADVISOR NOTE: Ideally, fetch this date from a server so users can't change their system clock to cheat.
    const targetDate = new Date('2025-08-01T00:00:00').getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.whatsapp) {
      toast({
        title: "Access Denied",
        description: "All fields are mandatory.",
        variant: "destructive"
      });
      return;
    }

    // Show loading state (Optional: Add a loading state variable)
    toast({ title: "Encrypting Transmission...", description: "Please wait." });

    try {
      // Use Web3Forms or similar simple endpoint
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // GO TO web3forms.com to get your free access_key
          access_key: "YOUR_ACCESS_KEY_HERE", 
          name: formData.name,
          email: formData.email,
          message: `WhatsApp: ${formData.whatsapp} - Requesting Vault Access`
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Access Request Sent",
          description: "You are now in the queue. Await signal.",
        });
        setFormData({ name: '', email: '', whatsapp: '' });
      } else {
        throw new Error("Transmission failed");
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Secure uplink failed. Try again later.",
        variant: "destructive"
      });
    }
  };
    
    // 🔴 CRITICAL TODO: Connect this to EmailJS, Firebase, or Supabase.
    // localStorage is NOT a backend. This console log demonstrates the data payload.
    console.log("Form Submission Payload:", {
        ...formData,
        timestamp: new Date().toISOString()
    });

    // Simulate API call
    setTimeout(() => {
        toast({
            title: "Access Request Encrypted",
            description: "You have been added to the protocol. Await signal.",
        });
        setFormData({ name: '', email: '', whatsapp: '' });
    }, 500);
  };

  const handleJoinVault = () => {
    accessFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProductClick = (productCode) => {
    toast({
      title: "Encrypted Asset",
      description: `${productCode} requires Level 2 clearance.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>SILENVAULT | Encrypted in Style</title>
        <meta name="description" content="The elite ecosystem for gaming, luxury apparel, and secure digital assets. Unlock the Vault." />
        <meta name="theme-color" content="#000000" />
      </Helmet>
      
      <div className="min-h-screen bg-black text-bone-white vault-grid noise-overlay">
        <Toaster />
        
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            {/* Logo Placeholder - Ensure this URL is permanent or host locally */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="mb-12"
            >
              {/* ADVISOR NOTE: Replace with your specific SVG logo if available locally */}
              <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/0cd3abd7-30ff-48f1-823d-bd5ec6fbcccf/8d758a2fe5dc23db782d30ac428d28ce.png" alt="SILENVAULT Crest" className="w-full max-w-md mx-auto" />
            </motion.div>

            {/* Drop Title */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl md:text-4xl font-bold tracking-widest text-gray-300">
                DROP 001: INDEPENDENT
              </h2>
              <p className="text-lg md:text-xl font-light tracking-wide text-gray-400">
                Wear What's Hidden Within.
              </p>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-4 gap-4 max-w-md mx-auto my-12"
            >
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="countdown-digit rounded-lg p-4 text-center border border-gray-800 bg-opacity-10 bg-gray-900">
                  <div className="text-2xl md:text-3xl font-bold text-bone-white">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">
                    {unit}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Button
                onClick={handleJoinVault}
                className="vault-button px-8 py-4 text-lg rounded-none border-2 border-white hover:bg-white hover:text-black transition-all"
              >
                <Lock className="mr-2 h-5 w-5" />
                Initialize Access
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Access Form Section */}
        <section ref={accessFormRef} id="access-form" className="py-20 px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-bold mb-4 text-bone-white">Secure Uplink</h3>
              <p className="text-gray-400 text-sm">
                Only <span className="text-bone-white font-semibold">47 insiders</span> will be accepted.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Operative Name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input w-full px-4 py-3 rounded-none font-medium bg-gray-900 border border-gray-700 text-white focus:border-white focus:outline-none"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Secure Email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input w-full px-4 py-3 rounded-none font-medium bg-gray-900 border border-gray-700 text-white focus:border-white focus:outline-none"
                required
              />
              <input
                type="tel"
                name="whatsapp"
                placeholder="Comms Number (WhatsApp)"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="form-input w-full px-4 py-3 rounded-none font-medium bg-gray-900 border border-gray-700 text-white focus:border-white focus:outline-none"
                required
              />
              <Button
                type="submit"
                className="vault-button w-full py-3 rounded-none bg-white text-black font-bold hover:bg-gray-200"
              >
                Transmit Data
              </Button>
            </motion.form>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-12 px-4 mt-20">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <span className="text-2xl font-bold text-bone-white tracking-widest mb-4">SILENVAULT</span>
            <p className="text-gray-500 text-sm">
                © 2025 SILENVAULT. Encrypted in Style.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
