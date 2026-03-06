# DWP Ask Frontend

DWP Ask is an AI-powered policy search and question-answering application that helps DWP staff quickly find accurate information from policy documents. The frontend provides an intuitive chat interface for users to interact with the AI system and access policy information efficiently.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview

The DWP Ask frontend is a Next.js 15 application built with React 19 and TypeScript. It provides a modern, accessible, and responsive user interface that integrates with Azure OpenAI services and Azure AI Search to deliver intelligent policy search capabilities.

## Key Features

### 🤖 AI-Powered Chat Interface

- Interactive chat interface for natural language policy queries
- Real-time streaming responses from Azure OpenAI (GPT-4o)
- Follow-up question suggestions based on context
- Query refinement and elaboration capabilities

### 📚 Policy Search & Discovery

- Semantic search across DWP policy documents
- Source citations with direct links to policy documents
- Document download functionality
- Advanced search filtering and pagination

### 👥 User Management & Analytics

- Role-based access control (Admin, User)
- User group management and permissions
- Comprehensive analytics and usage tracking
- Message history and conversation management

### 📊 Administrative Features

- Admin dashboard for system monitoring
- Feedback collection and management
- CSV export functionality for data analysis
- User activity and query analytics

### ♿ Accessibility & Compliance

- GOV.UK Design System compliance
- WCAG 2.1 AA accessibility standards
- Screen reader compatibility
- Keyboard navigation support

### 📱 Responsive Design

- Mobile-first responsive design
- Progressive Web App (PWA) capabilities
- Cross-browser compatibility
- Optimized performance

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 19, TypeScript
- **Styling**: SCSS, GOV.UK Frontend 5.13
- **State Management**: React Context API
- **Testing**: Jest, React Testing Library
- **Code Quality**: Biome, Husky
- **Analytics**: Google Tag Manager integration
- **Security**: Content Security Policy, DOMPurify

## Project Structure

```
app/
├── (pages)/                 # Route groups
│   ├── accessibility/       # Accessibility statement
│   ├── admin/              # Admin dashboard
│   ├── ai-notice/          # AI usage notice
│   ├── chat/               # Main chat interface
│   └── feedback/           # Feedback forms
├── api/                    # API routes
│   ├── query/              # Search queries
│   ├── feedback/           # Feedback handling
│   ├── messages/           # Message management
│   └── download/           # File downloads
├── components/             # Reusable UI components
│   ├── Analytics/          # Analytics components
│   ├── Answer/             # AI response display
│   ├── ChatInput/          # Chat input interface
│   ├── Layout/             # Page layouts
│   ├── Navbar/             # Navigation
│   └── Shared/             # Common components
├── hooks/                  # Custom React hooks
├── providers/              # Context providers
├── types/                  # TypeScript definitions
├── utils/                  # Utility functions
└── constants/              # Application constants
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Access to DWP Ask backend services
- Environment variables (contact a-cubed group maintainers)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd a-cubed-new-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env-example .env
```

4. Contact the a-cubed group maintainers to obtain the required environment variables for your `.env` file.

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### HTTPS Development (Optional)

For testing with HTTPS locally:

```bash
npm run dev:https
```

## Environment Configuration

The application requires several environment variables. Contact the a-cubed group maintainers to obtain the necessary values:

```bash
NEXT_PUBLIC_BASE_URL=         # Backend API URL
NEXT_PUBLIC_APP_URL=          # Frontend application URL
ACCESS_TOKEN=                 # API access token
NODE_ENV=                     # Environment (development/production)
NEXT_PUBLIC_MAX_ROW_CSV=      # CSV export row limit
```

## Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run dev:https` - Start development server with HTTPS
- `npm run build` - Build production application
- `npm run start` - Start production server

### Code Quality

- `npm run lint` - Run Biome
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Biome

### Testing

- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:notest` - Pass with no tests (for CI)

## Development Workflow

### Pre-commit Hooks

The project uses Husky for pre-commit hooks that automatically run:

- Code formatting check (Biome)
- Linting (Biome)
- Type checking
- Tests
- Commit message validation

### Commit Message Format

Follow conventional commit format:

```bash
feat: A new feature
fix: A bug fix
docs: Documentation only changes
style: Changes that do not affect the meaning of the code
refactor: A code change that neither fixes a bug nor adds a feature
perf: A code change that improves performance
test: Adding missing tests or correcting existing tests
build: Changes that affect the build system or external dependencies
ci: Changes to our CI configuration files and scripts
chore: Other changes that don't modify source or test files
```

## Testing

The project uses Jest and React Testing Library for testing:

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API route and user interaction tests
- **Coverage Reports**: Available in `coverage/` directory

Run tests with:

```bash
npm run test:coverage
```

## Deployment

The application is deployed using GitLab CI/CD pipelines:

1. **Development**: Automatic deployment on merge to `develop`
2. **Test**: Deployment to test environment
3. **Production**: Manual deployment from `main` branch

### Docker

The application includes a Dockerfile for containerized deployment:

```bash
docker build -t dwp-ask-frontend .
docker run -p 3000:3000 dwp-ask-frontend
```

## Contributing

1. Create a feature branch from `develop`
2. Make your changes following the coding standards
3. Ensure all tests pass and pre-commit hooks succeed
4. Submit a merge request with a clear description
5. Request review from team members

### Code Standards

- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Maintain accessibility standards (WCAG 2.1 AA)
- Write comprehensive tests for new features
- Document complex functionality

### Architecture Patterns

- **Component Structure**: Use functional components with hooks
- **State Management**: Context API for global state, local state for components
- **API Integration**: Custom hooks for data fetching
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Code splitting, lazy loading, and optimization

## Support

For technical support or questions:

- Contact the a-cubed group maintainers for environment variables and access
- Refer to the [DWP Ask documentation](https://dwpdigital.atlassian.net/wiki/spaces/GA/pages/133629184456/DWP+Ask+Q+A) for system overview
