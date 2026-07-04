import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Certificates from '../components/Certificates';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { useScrollRevealAll } from '../hooks/useScrollReveal';

export default function Home() {
  useScrollRevealAll();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <Hero />
      <About />
      <Skills /> 
      <Projects />
      <Experience />
      <Certificates />
      <Testimonials />
      <Contact />
      <Footer />
      <ChatBot />
    </div>
  );
}
