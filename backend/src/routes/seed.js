const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Certificate = require('../models/Certificate');
const Testimonial = require('../models/Testimonial');

router.post('/', async (req, res) => {
  try {
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Certificate.deleteMany({});
    await Testimonial.deleteMany({});

    await Project.insertMany([
      {
        title: 'RealTime Chat App',
        description: 'A full-stack real-time messaging platform with WebSocket support, rooms, and notifications.',
        longDescription: 'Built with Node.js, Express, Socket.IO and React. Features include private messaging, group rooms, typing indicators, and online presence.',
        techStack: ['React', 'Node.js', 'Socket.IO', 'MongoDB', 'Express'],
        liveUrl: 'https://chat.example.com',
        githubUrl: 'https://github.com/finesseDev/realtime-chat',
        featured: true,
        category: 'fullstack',
        status: 'completed'
      },
      {
        title: '3D Portfolio Visualizer',
        description: 'An interactive 3D data visualization tool built with Three.js and WebGL.',
        longDescription: 'Renders complex datasets as immersive 3D scenes. Users can interact, rotate, and filter data points in real time.',
        techStack: ['Three.js', 'React', 'JavaScript', 'WebGL'],
        githubUrl: 'https://github.com/finesseDev/3d-visualizer',
        featured: true,
        category: 'frontend',
        status: 'completed'
      },
      {
        title: 'E-Commerce REST API',
        description: 'A scalable RESTful API for e-commerce with auth, payments, and inventory management.',
        longDescription: 'Handles user auth with JWT, product CRUD, cart management, and order processing. Includes rate limiting and caching.',
        techStack: ['Node.js', 'Express', 'MongoDB', 'Python', 'JWT'],
        githubUrl: 'https://github.com/finesseDev/ecommerce-api',
        featured: true,
        category: 'backend',
        status: 'completed'
      },
      {
        title: 'Task Manager Pro',
        description: 'A collaborative project management tool with drag-and-drop boards and real-time sync.',
        techStack: ['React', 'Node.js', 'WebSocket', 'MongoDB'],
        githubUrl: 'https://github.com/finesseDev/task-manager',
        featured: false,
        category: 'fullstack',
        status: 'completed'
      },
      {
        title: 'Python Data Pipeline',
        description: 'Automated data ingestion and transformation pipeline for analytics.',
        techStack: ['Python', 'MongoDB', 'Express', 'Node.js'],
        githubUrl: 'https://github.com/finesseDev/data-pipeline',
        featured: false,
        category: 'backend',
        status: 'completed'
      }
    ]);

    await Skill.insertMany([
      { name: 'JavaScript', category: 'frontend', proficiency: 92 },
      { name: 'React.js', category: 'frontend', proficiency: 90 },
      { name: 'HTML/CSS', category: 'frontend', proficiency: 95 },
      { name: 'Three.js', category: 'frontend', proficiency: 78 },
      { name: 'Node.js', category: 'backend', proficiency: 88 },
      { name: 'Express.js', category: 'backend', proficiency: 87 },
      { name: 'Python', category: 'backend', proficiency: 82 },
      { name: 'WebSocket', category: 'backend', proficiency: 80 },
      { name: 'MongoDB', category: 'database', proficiency: 85 },
      { name: 'Git', category: 'tools', proficiency: 90 },
      { name: 'REST APIs', category: 'backend', proficiency: 91 },
      { name: 'WebGL', category: 'frontend', proficiency: 70 }
    ]);

    await Experience.insertMany([
      {
        company: 'TechFlow Solutions',
        role: 'Full Stack Developer',
        description: 'Led development of scalable web apps for fintech clients.',
        achievements: [
          'Built a real-time trading dashboard using WebSocket and React',
          'Reduced API response time by 40% through MongoDB query optimization',
          'Mentored 2 junior developers'
        ],
        startDate: '2023-01',
        current: true,
        techUsed: ['React', 'Node.js', 'MongoDB', 'WebSocket']
      },
      {
        company: 'StartupHub Lagos',
        role: 'Backend Developer',
        description: 'Developed RESTful APIs and microservices for various startup clients.',
        achievements: [
          'Architected a scalable Node.js/Express backend serving 10k+ daily users',
          'Integrated payment gateways and third-party APIs',
          'Deployed and maintained MongoDB clusters'
        ],
        startDate: '2022-01',
        endDate: '2022-12',
        current: false,
        techUsed: ['Node.js', 'Express', 'Python', 'MongoDB']
      },
      {
        company: 'Freelance',
        role: 'Frontend Developer',
        description: 'Delivered responsive web apps and landing pages for small businesses.',
        achievements: [
          'Built 15+ client projects using React and vanilla JavaScript',
          'Created 3D product showcases using Three.js',
          'Maintained 100% client satisfaction rate'
        ],
        startDate: '2021-06',
        endDate: '2021-12',
        current: false,
        techUsed: ['React', 'JavaScript', 'HTML/CSS', 'Three.js']
      }
    ]);

    await Certificate.insertMany([
      {
        title: 'Full Stack Web Development',
        issuer: 'freeCodeCamp',
        issueDate: '2023-05',
        credentialUrl: 'https://freecodecamp.org/certification/finesseDev',
        description: 'Comprehensive certification covering responsive web design, JavaScript algorithms, and backend APIs.'
      },
      {
        title: 'MongoDB Developer Path',
        issuer: 'MongoDB University',
        issueDate: '2023-09',
        credentialUrl: 'https://university.mongodb.com/certification',
        description: 'Hands-on certification on schema design, aggregation pipelines, and performance tuning.'
      },
      {
        title: 'React - The Complete Guide',
        issuer: 'Udemy',
        issueDate: '2022-11',
        credentialUrl: 'https://udemy.com/certificate/finesseDev',
        description: 'Deep dive into React Hooks, Context API, Redux, and advanced component patterns.'
      },
      {
        title: 'Node.js, Express & MongoDB Bootcamp',
        issuer: 'Udemy',
        issueDate: '2022-07',
        credentialUrl: 'https://udemy.com/certificate/finesseDev-node',
        description: 'Built RESTful APIs and authentication systems with the MERN stack.'
      }
    ]);

    await Testimonial.insertMany([
      {
        name: 'Sarah Johnson',
        role: 'Product Manager',
        company: 'TechFlow Solutions',
        quote: "Quadri is one of the most reliable developers I've worked with. He turned a complex real-time dashboard requirement into a polished product ahead of schedule.",
        rating: 5
      },
      {
        name: 'David Okafor',
        role: 'CTO',
        company: 'StartupHub Lagos',
        quote: 'His backend architecture decisions saved us significant scaling headaches later. Clean code, clear documentation, and great communication throughout.',
        rating: 5
      },
      {
        name: 'Amara Chen',
        role: 'Founder',
        company: 'Freelance Client',
        quote: 'Quadri built our 3D product showcase and it completely transformed how customers interact with our site. Highly recommend his Three.js expertise.',
        rating: 5
      }
    ]);

    res.json({ message: 'Database seeded successfully!' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
