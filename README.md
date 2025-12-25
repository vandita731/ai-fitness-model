AI Fitness Coach

AI Fitness Coach is a full-stack web application that generates personalized fitness plans based on user input. The application provides structured workout routines, diet recommendations, motivational guidance, voice narration, and relevant exercise or food images. It is built using modern web technologies and deployed on Vercel.

Live Application

Deployed on Vercel:
https://ai-fitness-model-przv.vercel.app
 (example link)

Overview

The application collects basic user fitness information such as age, height, weight, fitness goals, and preferences. Based on this input, it generates a customized fitness plan that includes:

Weekly workout schedules

Daily meal plans

Health tips and motivational messages

The goal of this project is to demonstrate real-world integration of AI services, modern UI design, and production-ready deployment practices.

Features
Personalized Fitness Plan Generation

AI-generated workout routines

Diet plan including breakfast, lunch, dinner, and snacks

Motivation and wellness tips

Voice Narration

Text-to-speech playback for workout and diet plans

Powered by ElevenLabs API

Image Integration

Exercise and food images fetched using Unsplash API

Search-based image retrieval to avoid AI image generation costs

Production-safe implementation for deployment

User Experience

Responsive and accessible UI

Light and dark mode support

Smooth animations and transitions

PDF export for fitness plans

Tech Stack

Frontend

Next.js (App Router)

React

TypeScript

Tailwind CSS

ShadCN UI

Framer Motion

Backend / APIs

OpenAI API (text generation)

ElevenLabs API (voice synthesis)

Unsplash API (image search)

Deployment

Vercel

Project Structure
src/
├── app/
│   ├── api/
│   │   ├── generate-plan/
│   │   └── generate-image/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── FitnessForm.tsx
│   ├── PlanDisplay.tsx
│   ├── ImageModal.tsx
│   ├── VoicePlayer.tsx
│   └── ThemeToggle.tsx
├── lib/
│   └── types.ts
└── styles/
    └── globals.css

Environment Variables

Create a .env.local file in the project root:

OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key


All sensitive keys are accessed only on the server side and are securely configured in Vercel for production.

Image Handling Strategy

Instead of AI-generated images, the application uses Unsplash’s search API to fetch high-quality, relevant images for:

Exercises (e.g., squats, push-ups)

Food items (e.g., yogurt, salads)

This approach:

Avoids billing issues

Improves reliability in production

Ensures compliance with API usage policies

Local Development

Install dependencies:

npm install


Run the development server:

npm run dev


Open the application at:

http://localhost:3000

Deployment

The project is deployed using Vercel.

Deployment steps:

Push the repository to GitHub

Import the project into Vercel

Configure environment variables in Vercel settings

Deploy the application

Key Learnings

Integrating multiple third-party APIs in a production environment

Handling environment variables securely

Managing AI usage costs and API limitations

Building scalable and maintainable UI components

Debugging deployment-specific issues on Vercel

Future Enhancements

User authentication and profiles

Progress tracking and history

Exercise video integration

Mobile-first optimization

Progressive Web App support

Author

Vandita Jain
Aspiring Software Engineer