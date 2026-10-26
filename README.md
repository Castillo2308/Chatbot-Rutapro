# RutaPro

A web app for studying driving theory. It combines traffic-sign practice, quizzes, gamified lessons and a chat assistant that answers common questions.

## Features

- **Traffic signs:** identify signs and open a detail card with what each one means and when it applies.
- **Quizzes:** multiple-choice practice with instant feedback.
- **Gamified learning:** lessons with progress and rewards.
- **Chat assistant:** quick actions and guided answers inside the app.
- **Python assistant (`asistente_rutapro.py`):** a command-line assistant that matches questions against a knowledge base (`RutaPro-knowledge.json`) using text normalization, token overlap and fuzzy string similarity.

## Tech stack

React · TypeScript · Vite · Tailwind CSS · Radix UI · Python

## Getting started

```bash
npm install
npm run dev      # development server
npm run build    # production build in dist/
```

The UI was first designed in Figma and then developed as a React + Vite project.
