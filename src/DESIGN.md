---
version: alpha
name: Eliza Conversation Design System

colors:
  brand:
    primary: "#111111"
    accent: "#005fcc"
    secondary: "#555555"
    tertiary: "#b8b8b8"
  action:
    success: "#08783e"
    info: "#005fcc"
    warning: "#8a5700"
    danger: "#b42318"
  text:
    base: "#111111"
    accent: "var(--color-brand-accent)"
    muted: "#555555"
    ondark: "#ffffff"
  surface:
    base: "#ffffff"
    alt: "#f0f0f0"
    dark: "#111111"
    card: "var(--color-surface)"

typography:
  base:
    fontFamily: '"DM Sans", sans-serif'
    fontWeight: "var(--font-weight-regular)"
    lineHeight: "var(--line-height-normal)"
  display:
    fontFamily: '"DM Sans", sans-serif'
    fontWeight: "var(--font-weight-bold)"
    lineHeight: "var(--line-height-tight)"
  mono:
    fontFamily: '"DM Sans", sans-serif'

spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  base: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  xxl: "3rem"

rounded:
  none: "0"
  sm: "0.25rem"
  md: "0.75rem"
  lg: "1.25rem"
  full: "9999px"

elevation:
  sm: "none"
  md: "none"
  lg: "none"

border:
  sm: "0.0625rem"
  md: "0.125rem"
  lg: "0.25rem"
---

# Eliza Conversation Design System

## Overview

The interface is a flat, conversation-first surface. It avoids ornamental
containers and reserves rounded corners for speech bubbles.

## Colors

Paper is the base contract above. Theme modes override only documented color
tokens in `design-tokens.css`.

| Theme | Accent | Surface |
| --- | --- | --- |
| Paper | `#005fcc` | `#ffffff` |
| Midnight | `#3045dc` | 3% accent over white |
| Cyan | `#00FFFF` | 3% accent over white |
| Magenta | `#FF00FF` | 3% accent over white |

Paper remains pure white. The tinted themes use the base surface formula
`color-mix(in srgb, var(--color-brand-accent) 3%, white)`.

## Typography

Paper uses DM Sans, Midnight uses IBM Plex Mono, Cyan uses Space Mono, and
Magenta uses Azeret Mono. Body copy uses the accessible `md` size and relaxed
line height.

## Layout

Use the spacing scale for component gaps and padding. The conversation remains
centered and gives messages generous vertical separation.

## Elevation & Depth

All elevation tokens are `none`. Hierarchy comes from contrast and spacing.

## Shapes

Controls are square. Speech bubbles alone use `--rounded-lg`, with
`--rounded-none` on the corner pointing to the author.
