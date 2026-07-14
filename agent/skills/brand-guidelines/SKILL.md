---
name: brand-guidelines
description: Applies Portl's official brand colors and typography to any sort of artifact that may benefit from having Portl's look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.
license: Complete terms in LICENSE.txt
---

# Portl Brand Styling

## Overview

To access Portl's official brand identity and style resources, use this skill.

**Keywords**: branding, corporate identity, visual identity, post-processing, styling, brand colors, typography, Portl brand, visual formatting, visual design

## Brand Guidelines

### Colors

**Main Colors:**

- Primary: `#D9F20F` - Neon yellow/lime accent
- Primary Dark: `#B8D100` - Darker shade of primary
- Primary Light: `#EEF8B5` - Lighter tint of primary
- Background: `#FAF9F5` - Screen backgrounds
- Surface: `#FFFFFF` - Cards and panels
- Surface Secondary: `#F5F4EF` - Subtle surfaces

**Text Colors:**

- Text: `#252833` - Primary body and headings
- Text Secondary: `#5E6573` - Subtitles and secondary info
- Text Muted: `#9AA3AF` - Placeholders and disabled states
- Border: `#ECE8DD` - Dividers and outlines

**Status Colors:**

- Success: `#28C76F` - Green
- Warning: `#FFB547` - Orange
- Danger: `#FF5A5F` - Red
- Info: `#4D9FFF` - Blue

### Typography

- **Primary Brand Font**: Inter / Outfit (Clean sans-serif)
- **Fallback Fonts**: System default sans-serif (Arial, Helvetica, sans-serif)

## Features

### Smart Font Application

- Applies Outfit/Inter to headings and body text
- Automatically falls back to system sans-serif fonts
- Preserves readability across all systems

### Text Styling

- Smart color selection based on background
- Preserves text hierarchy and formatting

### Shape and Accent Colors

- Uses Portl's brand colors (Primary, Surface, Text)
- Maintains visual interest while staying on-brand

## Technical Details

### Font Management

- Uses system-installed fonts or Expo router-loaded fonts
- Provides automatic fallback to default sans-serif fonts

### Color Application

- Uses hex color values for precise theme matching
- Applied via theme provider in mobile app

