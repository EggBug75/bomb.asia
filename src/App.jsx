import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaDiscord,
  FaYoutube,
  FaSteam,
  FaPlay,
  FaPause,
} from 'react-icons/fa'

function TypewriterText({ text, delay, start }) {
  const [currentText, setCurrentText] = useState('')

  useEffect(() => {
    if (!start) return
    let timeout
    let currentIndex = 0

    const typeChar = () => {
      setCurrentText(text.slice(0, currentIndex + 1))
      currentIndex++
      if (currentIndex < text.length) {
        timeout = setTimeout(typeChar, 35)
      }
    }

    const initialDelay = setTimeout(typeChar, delay)
    return () => {
      clearTimeout(timeout)
      clearTimeout(initialDelay)
    }
  }, [text, delay, start])
  
  useEffect(() => {
    const text = "@ketchupceo"
    let isDeleting = false
    let currentIndex = 0
    let timeout

    const updateTitle = () => {
      document.title = text.substring(0, currentIndex) + (currentIndex % 2 === 0 ? "_" : "")

      if (!isDeleting) {
        if (currentIndex < text.length) {
          currentIndex++
          timeout = setTimeout(updateTitle, 200)
        } else {
          isDeleting = true
          timeout = setTimeout(updateTitle, 3000)
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--
          timeout = setTimeout(updateTitle, 100)
        } else {
          isDeleting = false
          timeout = setTimeout(updateTitle, 1000)
        }
      }
    }

    updateTitle()
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.3) return
      const star = document.createElement('div')
      star.className = 'cursor-star'
      star.style.left = `${e.clientX}px`
      star.style.top = `${e.clientY}px`
      document.body.appendChild(star)
      setTimeout(() => {
        star.remove()
      }, 800)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <span>
      {currentText}
      {start && currentText.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="inline-block w-[3px] h-[1em] bg-white align-middle ml-1"
        />
      )}
    </span>
  )
}

function App() {
  const [entered, setEntered] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [steamHovered, setSteamHovered] = useState(false)

  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  const handleEnter = () => {
    setEntered(true)

    if (audioRef.current) {
      const audio = audioRef.current
      audio.currentTime = 42
      audio.volume = 0
      audio.play()
      setPlaying(true)
      let volume = 0
      const fadeIn = setInterval(() => {
        volume += 0.01

        if (volume >= 0.5) {
          volume = 0.5
          clearInterval(fadeIn)
        }

        audio.volume = volume
      }, 50)
    }
  
    setTimeout(() => setShowContent(true), 2200)
  }

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  const formatTime = (time) => {
    if (!time) return '0:00'

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.4 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 12,
      },
    },
  }

  const iconVariants = {
    hidden: { opacity: 0, width: 0, margin: '0px 0px' },
    visible: {
      opacity: 1,
      width: 'auto',
      margin: '0px 16px', 
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-black text-white">
      <audio
        ref={audioRef}
        src="/music.mp3"
        loop
      />

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/50" />
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="absolute inset-0 bg-black z-20"
            exit={{
              opacity: 0,
              transition: {
                duration: 2,
              },
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="absolute z-30 flex items-center justify-center"
        initial={{
          width: '100vw',
          height: '75vh',
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
        }}
        animate={
          entered
            ? {
                width: 600,
                height: 220,
                left: '50%',
                top: -30,
                x: '-50%',
                y: 0,
              }
            : {}
        }
        transition={{
          duration: 2.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <model-viewer 
            src="/ketchuplogo360.glb" 
            alt="spinning logo" 
            autoplay 
            shadow-intensity="1"
            environment-image="neutral"
            style={{ width: '100%', height: '100%', outline: 'none' }}
        ></model-viewer>
      </motion.div>

      <AnimatePresence>
        {!entered && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center"
            exit={{
              opacity: 0,
              y: 20,
              transition: {
                duration: 0.8,
              },
            }}
          >
            <motion.p
              onClick={handleEnter}
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
              }}
              className="mt-80 cursor-pointer tracking-[7px] text-lg font-medium text-gray-300"
            >
              [click]
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex items-center justify-center px-6">

        {showContent && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
            className="relative z-10 w-full max-w-2xl mt-20 flex flex-col"
          >

            {/* Avatar + nick */}
            <motion.div variants={itemVariants} layout className="flex items-center gap-7">

              <div className="relative shrink-0">
                <img
                  src="/cat.gif"
                  className="absolute -top-9 -left-6 w-20 z-10"
                />
                <img
                  src="/avatar.jpg"
                  className="w-36 h-36 rounded-full object-cover shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                />
              </div>

              <div>
                <h1 className="text-5xl font-bold leading-none min-h-[48px]">
                  <TypewriterText text="KetchupCEO" delay={400} start={showContent} />
                </h1>

                <p className="text-base text-gray-400 mt-3 min-h-[24px]">
                  <TypewriterText text="Unemployment Operations Manager (UOM)" delay={1000} start={showContent} />
                </p>
              </div>

            </motion.div>

            {/* Icons */}
            <motion.div layout className="flex justify-center items-center mt-10 text-5xl h-16">
              
              <motion.a 
                variants={iconVariants} 
                href="https://www.youtube.com/@KetchupCEO" 
                target="_blank"
                className="hover:scale-110 transition flex items-center justify-center overflow-hidden"
              >
                <FaYoutube />
              </motion.a>

              <motion.a 
                variants={iconVariants} 
                href="#" 
                className="hover:scale-110 transition flex items-center justify-center overflow-hidden"
              >
                <FaDiscord />
              </motion.a>

              <motion.div 
                variants={iconVariants} 
                layout 
                onMouseEnter={() => setSteamHovered(true)}
                onMouseLeave={() => setSteamHovered(false)}
                className="flex items-center justify-center overflow-hidden h-[48px] min-w-[48px]"
              >
                <AnimatePresence mode="wait">
                  {!steamHovered ? (
                    <motion.a
                      key="steam-icon"
                      href="#"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                      className="hover:scale-110 transition flex items-center justify-center text-5xl"
                    >
                      <FaSteam />
                    </motion.a>
                  ) : (
                    <motion.div
                      key="steam-links"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-4 text-3xl font-bold px-2"
                    >
                      <a href="https://steamcommunity.com/id/ketchupceo/" target="_blank" className="hover:text-gray-400 transition hover:scale-125">1</a>
                      <span className="text-gray-600 font-light text-2xl">/</span>
                      <a href="https://steamcommunity.com/id/skdo/" target="_blank" className="hover:text-gray-400 transition hover:scale-125">2</a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            </motion.div>

            {/* Player */}
            <motion.div variants={itemVariants} layout className="w-full mt-10 flex items-center gap-5">
              <img
                src="/cover.jpg"
                className="w-16 h-16 rounded-lg object-cover"
              />

              <div className="flex-1">
                <p className="text-lg font-semibold min-h-[28px]">
                  <TypewriterText text="HARRY POTHED" delay={1600} start={showContent} />
                </p>

                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => {
                    audioRef.current.currentTime = Number(e.target.value)
                  }}
                  className="music-slider w-full mt-2"
                />

                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <button
                onClick={toggleMusic}
                className="text-2xl hover:scale-110 transition"
              >
                {playing ? <FaPause /> : <FaPlay />}
              </button>
            </motion.div>

          </motion.div>
        )}

      </div>

      <style>
        {`
          .music-slider {
            appearance: none;
            height: 3px;
            background: white;
            border-radius: 20px;
            cursor: pointer;
          }

          .music-slider::-webkit-slider-thumb {
            appearance: none;
            width: 11px;
            height: 11px;
            background: white;
            border-radius: 50%;
          }

          .music-slider::-moz-range-thumb {
            width: 11px;
            height: 11px;
            background: white;
            border-radius: 50%;
            border: none;
          }

          body, a, button, input, .cursor-pointer {
            cursor: url('/cursor.gif'), auto !important;
          }

          .cursor-star {
            position: fixed;
            width: 10px;
            height: 10px;
            background: white;
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%);
            animation: starFall 0.8s ease-out forwards;
          }

          @keyframes starFall {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
            100% { opacity: 0; transform: translate(-50%, 40px) scale(0) rotate(180deg); }
          }
        `}
      </style>
    </div>
  )
}

export default App