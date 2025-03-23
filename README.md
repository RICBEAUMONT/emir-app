# EMIR Social Media Asset Generator

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
