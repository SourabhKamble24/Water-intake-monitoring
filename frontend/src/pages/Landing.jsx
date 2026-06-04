import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Droplets, Activity, Target, Bell, ArrowRight } from 'lucide-react';
const Landing = () => {
  return <div className="min-h-screen bg-background text-text-primary overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel !rounded-none !border-x-0 !border-t-0 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary-dark to-primary p-2 rounded-xl shadow-md">
              <Droplets className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary-light">
              HydroTrack
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-text-secondary hover:text-text-primary font-medium transition-colors">
              Log in
            </Link>
            <Link to="/register" className="btn-primary flex items-center space-x-2">
              <span>Start Free</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-primary-400 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
          <div className="absolute inset-0 bg-secondary blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse-slow translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
              The #1 Smart Hydration App
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Track Every Sip. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-primary-light">
                Stay Perfectly Hydrated.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              Smart hydration tracking powered by intelligent reminders, personalized goals, and beautiful insights. Build healthier habits today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto flex justify-center items-center">
                Start for free
              </Link>
              <button className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto flex justify-center items-center">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-10 px-6 border-y border-border/50 bg-surface/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[{
          label: 'Active Users',
          value: '50k+'
        }, {
          label: 'Water Logged',
          value: '10M+ L'
        }, {
          label: 'Goal Completion',
          value: '92%'
        }, {
          label: 'App Rating',
          value: '4.9/5'
        }].map((stat, i) => <motion.div key={i} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: i * 0.1,
          duration: 0.5
        }} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-text-secondary uppercase tracking-wider">{stat.label}</div>
            </motion.div>)}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to build the habit</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">Simple to use, yet powerful enough to give you deep insights into your hydration patterns.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{
            icon: <Target className="text-primary" size={32} />,
            title: "Personalized Goals",
            description: "AI calculates your ideal intake based on weight, weather, and activity levels."
          }, {
            icon: <Activity className="text-secondary" size={32} />,
            title: "Beautiful Analytics",
            description: "Visualize your progress with stunning, interactive charts and weekly insights."
          }, {
            icon: <Bell className="text-success" size={32} />,
            title: "Smart Reminders",
            description: "Never forget a glass. Receive gentle nudges at the perfect times throughout the day."
          }].map((feature, i) => <motion.div key={i} whileHover={{
            y: -5
          }} className="glass-panel p-8 group">
                <div className="bg-surface border border-border p-4 rounded-2xl inline-block mb-6 shadow-sm group-hover:shadow-md transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-surface/30 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">Loved by thousands</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[{
            name: "Sarah J.",
            role: "Athlete",
            text: "HydroTrack completely changed my hydration habits. The smart reminders are a game changer."
          }, {
            name: "Michael T.",
            role: "Software Engineer",
            text: "Finally, a hydration app that looks like it belongs in 2026. The UI is absolutely gorgeous."
          }, {
            name: "Elena R.",
            role: "Fitness Coach",
            text: "I recommend this to all my clients. The analytics are incredibly motivating!"
          }].map((testimonial, i) => <div key={i} className="glass-panel p-8 text-left relative">
                <div className="text-primary mb-4">
                  {[...Array(5)].map((_, j) => <span key={j} className="inline-block">★</span>)}
                </div>
                <p className="text-lg mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-text-secondary">{testimonial.role}</div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Droplets className="text-primary" size={24} />
              <span className="text-xl font-bold">HydroTrack</span>
            </div>
            <p className="text-text-secondary max-w-sm">
              Making hydration effortless, beautiful, and smart. Build the habit that powers your life.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Download</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-border/50 text-center text-text-secondary text-sm">
          © {new Date().getFullYear()} HydroTrack Inc. All rights reserved.
        </div>
      </footer>
    </div>;
};
export default Landing;