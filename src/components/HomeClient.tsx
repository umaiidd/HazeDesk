"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'

const HomeClient = ({ email }: { email: string }) => {

  const [loggingIn, setLoggingIn] = useState(false)

  const handleLogin = () => {
    setLoggingIn(true)
    window.location.href = "/api/auth/login"
  }

  const handleLogout = () => {
    window.location.href = "/api/auth/logout"
  }

  const handleDashboard = () => {
    window.location.href = "/dashboard"
  }

  const handleLearnMore = () => {
    document.getElementById("learn-more")?.scrollIntoView({ behavior: "smooth" })
  }

  const firstLetter = email ? email[0].toUpperCase() : null

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      title: "Plug & Play",
      desc: "Add the chatbot to your site with a single script tag. No setup headaches.",
      delay: 0.1,
    },
    {
      icon: (
        <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      ),
      title: "Admin Controlled",
      desc: "You control exactly what the AI knows and how it responds to customers.",
      delay: 0.18,
    },
    {
      icon: (
        <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "Always Online",
      desc: "Your customers get instant support 24/7 — even when your team is offline.",
      delay: 0.26,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .anim-fade-down   { animation: fadeDown   0.5s ease forwards; }
        .anim-fade-left   { animation: fadeLeft   0.5s ease 0.15s both; }
        .anim-fade-right  { animation: fadeRight  0.5s ease 0.2s  both; }
        .anim-dropdown    { animation: dropdownIn 0.2s ease forwards; }
      `}</style>

      {/* ── Navbar ── */}
      <div className="anim-fade-down fixed top-4 left-0 right-0 z-50 px-3 sm:px-0">
        <div className={`max-w-5xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between rounded-2xl border transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl border-gray-200/80 shadow-sm'
            : 'bg-white border-gray-200'
        }`}>

          {/* Logo */}
          <div className="anim-fade-left flex items-baseline gap-1.5 cursor-pointer group">
            <span className="text-[16px] font-semibold text-gray-800 tracking-[-0.4px] group-hover:text-black transition-colors duration-200">
              Haze Desk
            </span>
            <span className="text-[16px] font-light text-gray-400 tracking-[-0.2px] group-hover:text-gray-500 transition-colors duration-200">
              AI
            </span>
          </div>

          {/* Right side */}
          <div className="anim-fade-right relative" ref={dropdownRef}>
            {firstLetter ? (
              <>
                <button
                  onClick={() => setOpen(!open)}
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-white text-[13px] font-semibold flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
                >
                  {firstLetter}
                </button>

                {open && (
                  <div className="anim-dropdown absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">Signed in as</p>
                      <p className="text-[13px] text-gray-700 font-medium truncate">{email}</p>
                    </div>
                    <div className="p-1.5 flex flex-col gap-0.5">
                      <button
                        onClick={handleDashboard}
                        className="w-full text-left px-3 py-2.5 text-[13px] text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-150 font-medium flex items-center gap-2.5"
                      >
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="3" width="7" height="7" rx="1" />
                          <rect x="3" y="14" width="7" height="7" rx="1" />
                          <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        Dashboard
                      </button>
                      <div className="h-px bg-gray-100 my-0.5" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 text-[13px] text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-150 font-medium flex items-center gap-2.5"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={handleLogin}
                disabled={loggingIn}
                className="text-[13.5px] font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 rounded-full px-5 py-2 transition-all duration-200 cursor-pointer tracking-[-0.1px] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2"
              >
                {loggingIn && (
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                )}
                {loggingIn ? 'Logging in...' : 'Log in'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <div className="min-h-screen flex items-center">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-24 sm:pt-16 pb-20 sm:pb-32 w-full flex flex-col md:flex-row items-center justify-between gap-10 sm:gap-12">

          {/* Left: Text */}
          <div className="w-full max-w-xl text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
              className="text-[36px] sm:text-[44px] md:text-[52px] font-semibold text-gray-900 leading-[1.1] tracking-[-1.5px] mb-5 sm:mb-6"
            >
              AI Customer Support
              <br />
              Built for Modern
              <br />
              Websites
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.22 }}
              className="text-[15px] sm:text-[16px] text-gray-400 leading-relaxed tracking-[-0.2px] mb-8 sm:mb-10 max-w-md mx-auto md:mx-0"
            >
              Add a powerful AI chatbot to your website in minutes. Let your
              customers get instant answers using your own business knowledge.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.34 }}
              className="flex items-center gap-3 justify-center md:justify-start"
            >
              {email ? (
                <button
                  onClick={handleDashboard}
                  className="bg-gray-900 hover:bg-black text-white text-[13.5px] font-medium px-6 py-2.5 rounded-xl tracking-[-0.1px] transition-all duration-200 active:scale-95 shadow-sm"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  disabled={loggingIn}
                  className="bg-gray-900 hover:bg-black text-white text-[13.5px] font-medium px-6 py-2.5 rounded-xl tracking-[-0.1px] transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2"
                >
                  {loggingIn && (
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  )}
                  {loggingIn ? 'Redirecting...' : 'Get Started'}
                </button>
              )}
              <button
                onClick={handleLearnMore}
                className="text-[13.5px] font-medium text-gray-500 hover:text-gray-800 px-6 py-2.5 rounded-xl border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 active:scale-95 tracking-[-0.1px]"
              >
                Learn More
              </button>
            </motion.div>
          </div>

          {/* Right: Live Chat Preview */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
            className="hidden md:flex flex-col w-[400px] shrink-0 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden"
          >
            {/* Chat header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
              <span className="text-[12px] font-medium text-gray-400 tracking-wide">Live Chat Preview</span>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 px-4 py-4">
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.7 }}
                className="self-end bg-gray-900 text-white text-[13px] font-medium px-3.5 py-2.5 rounded-2xl rounded-br-sm max-w-[220px] leading-relaxed"
              >
                What's your return policy?
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 1.05 }}
                className="self-start bg-gray-100 text-gray-700 text-[13px] px-3.5 py-2.5 rounded-2xl rounded-bl-sm max-w-[220px] leading-relaxed"
              >
                Returns accepted within 30 days, no hassle.
              </motion.div>

              {/* Typing indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.4 }}
                className="self-start flex items-center gap-1 bg-gray-100 px-3.5 py-3 rounded-2xl rounded-bl-sm"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 block"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[12px] text-gray-300 select-none">
                Ask anything...
              </div>
              <button className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Features Section ── */}
      <div id="learn-more" className="border-t border-gray-100 py-16 pb-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center text-[12px] font-medium text-gray-400 uppercase tracking-widest mb-3"
          >
            Why choose us
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
            className="text-center text-[24px] sm:text-[30px] font-semibold text-gray-900 tracking-[-1px] mb-10 sm:mb-12"
          >
            Why Businesses Choose Haze Desk
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
            {features.map(({ icon, title, desc, delay }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay }}
                className="group border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-default"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center mb-5 group-hover:bg-gray-200 transition-colors duration-200">
                  {icon}
                </div>
                <h3 className="text-[16px] font-semibold text-gray-800 tracking-[-0.3px] mb-2.5">{title}</h3>
                <p className="text-[14px] text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[14px] font-semibold text-gray-700 tracking-[-0.4px]">Haze Desk</span>
            <span className="text-[14px] font-light text-gray-400">AI</span>
          </div>
          <p className="text-[12px] text-gray-300">© 2026 Haze Desk AI. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

export default HomeClient