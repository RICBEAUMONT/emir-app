# EMIR Content Generator

A modern web application for generating professional quote cards and social media content using Next.js and AI.

## Overview

EMIR Content Generator is a sophisticated web application that helps users create professional quote cards for social media platforms like LinkedIn and Instagram. The application features a modern, animated interface with a focus on user experience and professional design.

## Features

- 🎨 Professional quote card generation
- 📱 Optimized for LinkedIn & Instagram posts
- ✨ Animated hero section with video background
- 🎯 Category-based content generation
- 🖼️ Customizable quote card editor
- 🌙 Dark mode support
- ⚡ Fast development with Turbopack
- 🎭 Smooth animations with Framer Motion

## Tech Stack

- **Framework**: Next.js 15.2.1 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Development**: Turbopack
- **Build Tools**: PostCSS, ESLint

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── generators/       # Content generation components
│   ├── previews/         # Preview components
│   ├── editors/          # Editor components
│   ├── forms/            # Form components
│   ├── hero-header.tsx   # Animated hero section
│   └── category-selector.tsx # Category selection
└── lib/                  # Utility functions and shared logic
```

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RICBEAUMONT/emir-app.git
cd emir-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Components

### Hero Header
The application features an animated hero section with:
- Video background with fade effects
- Animated content transitions
- Responsive design
- Professional branding elements

### Quote Card Editor
A sophisticated editor component that allows users to:
- Generate quote cards
- Customize content
- Preview results
- Export for social media

## Development

The project uses modern development practices and tools:
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Framer Motion for animations
- Radix UI for accessible components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary. All rights reserved.

## Quote Card Generators

This project includes a suite of professional quote card generators optimized for different social media platforms. Each generator is carefully tuned for its target platform's specifications and best practices.

### LinkedIn Post Quote Card [1920×1080]

The LinkedIn post quote card generator (`src/components/generators/quote-card-generator.tsx`) creates premium social media cards optimized for:
- LinkedIn posts and articles
- Executive thought leadership content
- Professional testimonials
- Conference highlights
- Company announcements

#### Technical Specifications

**Canvas Dimensions:**
- Width: 1920px
- Height: 1080px (16:9 aspect ratio)
- Text box width: 1100px (fixed)

**Typography:**
- Quote text: Dynamic sizing (70px to 42px)
  - Automatically adjusts based on content length
  - Maximum height: 45% of canvas
  - Font: Akkurat (600 weight)
- Name: 58px Akkurat Bold
- Title/Company: 36px Akkurat Normal
- All text in uppercase

**Layout:**
- Left padding: 90px
- Quote starts: 14% from top
- Content width: 52% of canvas
- Profile image width: 70% of canvas
- Logo width: 370px

**Visual Elements:**
- Background: Dark gradient (#1a1a1a to #000000)
- Gold accents: #BEA152 (separator line, highlighted words)
- Sophisticated lighting effects
- Vertical pattern with 20px spacing
- Enhanced profile images with professional sharpening

#### Usage

```typescript
<QuoteCardGenerator
  name="John Doe"
  companyTitle="Chief Executive Officer"
  companyName="Example Corp"
  quoteContent="Your quote text here"
  highlightWord="key,words,to,highlight"
  imageUrl="/path/to/profile-image.jpg"
  onGenerated={(imageUrl) => {
    // Handle the generated image URL
  }}
/>
```

#### Features

1. **Dynamic Typography**
   - Intelligent font sizing (70px to 42px)
   - Maintains fixed text box width
   - Preserves readability and layout balance

2. **Image Processing**
   - Professional sharpening effect
   - Optimal profile image positioning
   - Preserves natural look while enhancing definition

3. **Visual Effects**
   - Sophisticated lighting gradients
   - Gold accent elements
   - Subtle vertical patterns
   - Professional color scheme

4. **Responsive Layout**
   - Automatically adjusts to content length
   - Maintains visual hierarchy
   - Ensures consistent spacing

For more details about implementation and customization, refer to the component documentation in `src/components/generators/quote-card-generator.tsx`.
