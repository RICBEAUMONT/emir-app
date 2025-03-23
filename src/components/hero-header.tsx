'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function HeroHeader() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showContent, setShowContent] = useState(false)
  const [overlayOpacity, setOverlayOpacity] = useState(0)
  const [videoOpacity, setVideoOpacity] = useState(1)

  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    const handleTimeUpdate = () => {
      if (!video) return
      
      // Start fading out video 1 second before it ends
      const timeLeft = video.duration - video.currentTime
      if (timeLeft < 1) {
        const opacity = timeLeft // Will go from 1 to 0
        setVideoOpacity(opacity)
      }
    }

    const handleVideoEnd = () => {
      // When video ends, show the content
      setOverlayOpacity(0.95)
      setShowContent(true)

      // After 8 seconds, hide the content and restart video
      setTimeout(() => {
        setShowContent(false)
        setOverlayOpacity(0)
        setVideoOpacity(1) // Reset video opacity
        video.currentTime = 0
        video.play()
      }, 8000) // Increased from 5000 to 8000ms
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleVideoEnd)
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleVideoEnd)
    }
  }, [])

  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute inset-0 bg-white z-10"
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          animate={{ opacity: videoOpacity }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/intro-video.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 h-full flex flex-col items-center justify-center px-4 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ 
                duration: 1,
                delay: 0.2,
                type: "spring",
                stiffness: 100
              }}
              className="mb-6"
            >
              <img src="/logo.png" alt="EMIR" className="h-14 mx-auto" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ 
                duration: 1.2,
                delay: 0.4,
                type: "spring",
                stiffness: 100,
                damping: 12
              }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-5"
            >
              Quote Card Generator
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ 
                duration: 1,
                delay: 0.6,
                type: "spring",
                stiffness: 70,
                damping: 15
              }}
              className="text-lg md:text-xl text-black/80 max-w-3xl"
            >
              Create professional on-brand quote cards at the click of a button!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 1,
                delay: 0.8,
                type: "spring",
                stiffness: 50
              }}
              className="mt-6"
            >
              <div className="inline-flex gap-4 text-sm tracking-wide">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{
                    duration: 0.5,
                    delay: 1,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="text-[#BEA152] font-medium"
                >
                  LinkedIn & Instagram Posts
                </motion.span>
              </div>
            </motion.div>

            {/* Animated gradient accent */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 0.5, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ 
                duration: 1.2,
                delay: 1.5,
                type: "spring",
                stiffness: 40,
                damping: 15
              }}
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#BEA152] to-transparent"
              style={{ transformOrigin: 'center' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 