"use client"

import { useEffect, useRef, useState } from "react"

// Animation utility functions and custom animations

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

// CSS Animation Classes
export const animationClasses = {
  // Hover animations
  hoverScale: "transform transition-transform duration-200 hover:scale-105",
  hoverScaleLarge: "transform transition-transform duration-300 hover:scale-110",
  hoverFloat: "transform transition-transform duration-500 hover:-translate-y-2",
  hoverGlow: "transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25",
  hoverRotate: "transform transition-transform duration-300 hover:rotate-3",
  
  // Loading animations
  spin: "animate-spin",
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  ping: "animate-ping",
  
  // Custom animations (requires Tailwind CSS custom animations)
  slideUp: "animate-slideUp",
  slideDown: "animate-slideDown",
  fadeIn: "animate-fadeIn",
  scaleUp: "animate-scaleUp",
  
  // Entrance animations
  fadeInUp: "animate-in slide-in-from-bottom fade-in duration-500",
  fadeInDown: "animate-in slide-in-from-top fade-in duration-500",
  fadeInLeft: "animate-in slide-in-from-left fade-in duration-500",
  fadeInRight: "animate-in slide-in-from-right fade-in duration-500",
  scaleInCenter: "animate-in zoom-in fade-in duration-300",
  
  // Exit animations
  fadeOutUp: "animate-out slide-out-to-top fade-out duration-300",
  fadeOutDown: "animate-out slide-out-to-bottom fade-out duration-300",
  fadeOutLeft: "animate-out slide-out-to-left fade-out duration-300",
  fadeOutRight: "animate-out slide-out-to-right fade-out duration-300",
  scaleOutCenter: "animate-out zoom-out fade-out duration-200",
}

// Animation delay classes
export const delayClasses = {
  delay0: "delay-0",
  delay100: "delay-100", 
  delay200: "delay-200",
  delay300: "delay-300",
  delay500: "delay-500",
  delay700: "delay-700",
  delay1000: "delay-1000",
}

// Utility function to combine animation classes
export function combineAnimations(...classes: string[]): string {
  return classes.filter(Boolean).join(" ")
}

// Intersection Observer hook for scroll animations
export function useScrollAnimation(threshold = 0.1) {
  if (typeof window === 'undefined') return { ref: null, isVisible: false }
  
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [threshold])
  
  return { ref, isVisible }
}

// Stagger animation utility
export function getStaggerDelay(index: number, baseDelay = 100): string {
  return `delay-[${index * baseDelay}ms]`
}

// Particle animation utility
export function generateParticles(count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 4,
    size: 1 + Math.random() * 3
  }))
}