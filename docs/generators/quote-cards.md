# Quote Card Generators Technical Documentation

## Overview

This document provides detailed technical information about the quote card generators implemented in this project. The generators are designed to create professional, visually appealing quote cards optimized for various social media platforms.

## LinkedIn Post Quote Card Generator

### Component Architecture

File: `src/components/generators/quote-card-generator.tsx`
Version: 1.3.0 (Finalized)

### Implementation Details

#### Canvas Setup
- Dimensions: 1920×1080 pixels (16:9)
- Resolution: Optimized for high-DPI displays
- Context: 2D rendering context with alpha channel

#### Image Processing Pipeline

1. **Profile Image Processing**
   ```typescript
   const weights = [
     0, -0.3, 0,
     -0.3, 2.2, -0.3,
     0, -0.3, 0
   ];
   ```
   - Convolution matrix optimized for professional portraits
   - Edge preservation with natural enhancement
   - Alpha channel preservation for transparency

2. **Dynamic Typography System**
   - Binary search algorithm for optimal font size
   - Range: 70px to 42px
   - Performance optimization using text metrics caching
   - Line height scaling: proportional to font size

3. **Gradient System**
   ```typescript
   gradient.addColorStop(0, '#1a1a1a')
   gradient.addColorStop(1, '#000000')
   ```
   - Multi-layer gradient composition
   - Sophisticated lighting effects
   - Optimized alpha channel blending

### Performance Considerations

1. **Image Processing**
   - Temporary canvas usage for image manipulation
   - Efficient pixel data handling
   - Optimized convolution matrix application

2. **Memory Management**
   - Canvas cleanup after generation
   - Efficient image data handling
   - Resource disposal patterns

3. **Rendering Pipeline**
   - Layered rendering approach
   - Optimized draw calls
   - Efficient gradient composition

### Error Handling

1. **Image Loading**
   - Graceful fallback for missing images
   - Cross-origin handling
   - Load error recovery

2. **Font Loading**
   - System font fallbacks
   - Dynamic font size adjustment
   - Missing font handling

### Usage Guidelines

1. **Image Requirements**
   - Recommended size: ≥ 1344×1080 pixels
   - Format: PNG or JPEG
   - Aspect ratio: Portrait preferred

2. **Text Content**
   - Quote length: Optimized for 100-250 characters
   - Highlight words: Comma-separated list
   - Company details: Recommended character limits

3. **Performance Tips**
   - Pre-load images when possible
   - Cache generated cards when appropriate
   - Implement proper error boundaries

### Component Props Interface

```typescript
interface QuoteCardGeneratorProps {
  name: string;              // Person's name
  companyTitle: string;      // Professional title
  companyName: string;       // Company name
  quoteContent: string;      // The quote text
  highlightWord: string;     // Comma-separated highlight words
  imageUrl: string | null;   // Profile image URL
  onGenerated: (imageUrl: string) => void;  // Callback
}
```

### Customization Points

1. **Visual Elements**
   - Gradient colors and stops
   - Gold accent color (#BEA152)
   - Font sizes and weights
   - Spacing and padding values

2. **Image Processing**
   - Sharpening matrix values
   - Image positioning offsets
   - Scaling and cropping parameters

3. **Typography**
   - Font size ranges
   - Line height ratios
   - Text box dimensions

## Maintenance Notes

### Version History

- v1.3.0: Dynamic typography implementation
- v1.2.0: Enhanced image processing
- v1.1.0: Layout optimization
- v1.0.0: Initial release

### Known Limitations

1. Font loading dependent on system availability
2. Image processing intensive for large images
3. Text overflow handling for extreme cases

### Future Considerations

1. WebGL acceleration for image processing
2. Font preloading optimization
3. Additional customization options

## Integration Examples

### Basic Usage
```typescript
import { QuoteCardGenerator } from '@/components/generators/quote-card-generator';

function QuoteCard() {
  const handleGenerated = (imageUrl: string) => {
    // Handle the generated image URL
  };

  return (
    <QuoteCardGenerator
      name="John Doe"
      companyTitle="Chief Executive Officer"
      companyName="Example Corp"
      quoteContent="Leadership is about making others better as a result of your presence and making sure that impact lasts in your absence."
      highlightWord="leadership,impact"
      imageUrl="/profile.jpg"
      onGenerated={handleGenerated}
    />
  );
}
```

### Error Handling Example
```typescript
function QuoteCardWithErrorHandling() {
  const [error, setError] = useState<Error | null>(null);

  const handleGenerated = (imageUrl: string) => {
    try {
      // Process the generated image
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  };

  if (error) {
    return <div>Error generating quote card: {error.message}</div>;
  }

  return (
    <QuoteCardGenerator
      // ... props
      onGenerated={handleGenerated}
    />
  );
}
``` 