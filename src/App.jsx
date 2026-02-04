import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
  const { toast } = useToast();

  useEffect(() => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.whatsapp) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to join the vault.",
        variant: "destructive"
      });
      return;
    }
    
    // Store in localStorage
    const existingData = JSON.parse(localStorage.getItem('silenvault_insiders') || '[]');
    existingData.push({
      ...formData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('silenvault_insiders', JSON.stringify(existingData));
    
    toast({
      title: "Welcome to the Vault",
      description: "You're now part of the exclusive 47. Prepare for DROP 001.",
    });
    
    setFormData({ name: '', email: '', whatsapp: '' });
  };

  const handleJoinVault = () => {
    document.getElementById('access-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleProductClick = (productCode) => {
    toast({
      title: "Classified",
      description: `${productCode} details will be revealed to vault members only.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>SILENVAULT - DROP 001: INDEPENDENT</title>
        <meta name="description" content="SILENVAULT isn't just a brand — it's a code. Curated essentials for those who unfold. Unbranded. Genderless. Timeless." />
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
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="mb-12"
            >
              <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/0cd3abd7-30ff-48f1-823d-bd5ec6fbcccf/8d758a2fe5dc23db782d30ac428d28ce.png" alt="SILENVAULT Logo" className="w-full max-w-md mx-auto" />
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
                <div key={unit} className="countdown-digit rounded-lg p-4 text-center">
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
                className="vault-button px-8 py-4 text-lg rounded-none"
              >
                <Lock className="mr-2 h-5 w-5" />
                Join the Vault
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Access Form Section */}
        <section id="access-form" className="py-20 px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-bold mb-4 text-bone-white">Exclusive Access</h3>
              <p className="text-gray-400 text-sm">
                Only <span className="text-bone-white font-semibold">47 insiders</span> will get early access.
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
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input w-full px-4 py-3 rounded-none font-medium"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input w-full px-4 py-3 rounded-none font-medium"
                required
              />
              <input
                type="tel"
                name="whatsapp"
                placeholder="WhatsApp Number"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="form-input w-full px-4 py-3 rounded-none font-medium"
                required
              />
              <Button
                type="submit"
                className="vault-button w-full py-3 rounded-none"
              >
                Secure My Access
              </Button>
            </motion.form>
          </div>
        </section>

        {/* Product Teaser Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-bone-white">The Vault</h3>
              <p className="text-gray-400 text-lg">
                What's in the vault will unfold.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { code: 'SVT-001', name: 'CLASSIFIED' },
                { code: 'SVT-002', name: 'CLASSIFIED' },
                { code: 'SVT-003', name: 'CLASSIFIED' },
                { code: 'SVT-004', name: 'CLASSIFIED' },
                { code: 'SVT-005', name: 'CLASSIFIED' }
              ].map((item, index) => (
                <motion.div
                  key={item.code}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="product-card rounded-lg p-6 cursor-pointer group"
                  onClick={() => handleProductClick(item.code)}
                >
                  <div className="aspect-square bg-gray-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    <img  
                      alt="Mysterious techwear silhouette"
                      className="w-full h-full object-cover filter blur-sm grayscale group-hover:blur-none transition-all duration-300"
                     src="https://images.unsplash.com/photo-1575365940134-d45b1db00b9b" />
                    <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    <Lock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-bone-white opacity-80" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-bone-white mb-1">{item.code}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{item.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-bone-white mb-8">The Code</h3>
              <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-300">
                <p>
                  <span className="text-bone-white font-semibold">SILENVAULT</span> isn't just a brand — it's a code.
                </p>
                <p>
                  Curated essentials for those who unfold.
                </p>
                <p className="text-gray-400">
                  Unbranded. Genderless. Timeless.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-2xl font-bold text-bone-white">SILENVAULT</span>
                <div className="flex flex-col space-y-2 text-gray-400">
                  <a href="mailto:support@silenvault.com" className="flex items-center hover:text-bone-white transition-colors">
                    <Mail className="h-4 w-4 mr-2" />
                    support@silenvault.com
                  </a>
                </div>
              </div>
              
              <div className="flex justify-start md:justify-end space-x-6">
                <a href="#" className="text-gray-400 hover:text-bone-white transition-colors">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-bone-white transition-colors">
                  <Youtube className="h-6 w-6" />
                  <span className="sr-only">YouTube</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-bone-white transition-colors">
                  <MessageCircle className="h-6 w-6" />
                  <span className="sr-only">WhatsApp</span>
                </a>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-500 text-sm">
                © 2025 SILENVAULT. All rights reserved. The vault remains sealed.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;