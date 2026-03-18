"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface DashboardClientProps {
  ownerId: string
  email: string
}

interface Toast {
  id: number
  type: 'success' | 'error'
  message: string
}

function DashboardClient({ ownerId, email }: DashboardClientProps) {
  const [businessName, setBusinessName] = useState("")
  const [supportEmail, setSupportEmail] = useState("")
  const [knowledge, setKnowledge] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const firstLetter = email ? email[0].toUpperCase() : null

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const result = await axios.post(`/api/settings/get`, { ownerId })
        setBusinessName(result.data.businessName || "")
        setSupportEmail(result.data.supportEmail || "")
        setKnowledge(result.data.knowledge || "")
      } catch (e) {
        console.error(e)
        addToast('error', 'Failed to load settings')
      }
    }
    fetchSettings()
  }, [ownerId])

  const handleSave = async () => {
    if (!businessName.trim()) {
      addToast('error', 'Business name cannot be empty')
      return
    }
    if (!supportEmail.trim()) {
      addToast('error', 'Support email cannot be empty')
      return
    }
    if (!knowledge.trim()) {
      addToast('error', 'Knowledge base cannot be empty')
      return
    }

    setSaving(true)
    try {
      await axios.post("/api/settings", { ownerId, businessName, supportEmail, knowledge })
      setSaved(true)
      addToast('success', 'Settings saved successfully')
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      console.error(e)
      addToast('error', 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => { window.location.href = "/api/auth/logout" }
  const handleHome   = () => { window.location.href = "/" }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .anim-fade-down { animation: fadeDown 0.5s ease forwards; }
        .anim-dropdown  { animation: dropdownIn 0.2s ease forwards; }
      `}</style>

      {/* ── Toast Container ── */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg border text-[13px] font-medium max-w-[280px] sm:max-w-xs ${
                toast.type === 'success'
                  ? 'bg-white border-gray-200 text-gray-800'
                  : 'bg-white border-red-100 text-red-600'
              }`}
            >
              {toast.type === 'success' ? (
                <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              )}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Navbar ── */}
      <div className="anim-fade-down fixed top-4 left-0 right-0 z-50">
        <div className={`max-w-5xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between rounded-2xl border transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl border-gray-200/80 shadow-sm'
            : 'bg-white border-gray-200'
        }`}>

          {/* Logo */}
          <div
            onClick={handleHome}
            className="flex items-baseline gap-1.5 cursor-pointer group"
          >
            <span className="text-[16px] font-semibold text-gray-800 tracking-[-0.4px] group-hover:text-black transition-colors duration-200">
              Haze Desk
            </span>
            <span className="text-[16px] font-light text-gray-400 tracking-[-0.2px] group-hover:text-gray-500 transition-colors duration-200">
              AI
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Embed ChatBot button */}
            <button
              onClick={() => router.push("/embed")}
              className="text-[13px] font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl px-3 sm:px-4 py-2 transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span className="hidden sm:inline">Embed ChatBot</span>
            </button>

            {/* Avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
              {firstLetter && (
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
                      <div className="p-1.5">
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="pt-28 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Card Header */}
          <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 border-b border-gray-100">
            <h1 className="text-[24px] font-semibold text-gray-900 tracking-[-0.6px] mb-1">
              ChatBot Settings
            </h1>
            <p className="text-[14px] text-gray-400">
              Manage your AI chatbot knowledge and business details
            </p>
          </div>

          {/* Form Body */}
          <div className="px-4 sm:px-8 py-5 sm:py-7 flex flex-col gap-8">

            {/* Business Details */}
            <div>
              <h2 className="text-[15px] font-semibold text-gray-800 tracking-[-0.3px] mb-4">
                Business Details
              </h2>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-800 placeholder:text-gray-300 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200"
                />
                <input
                  type="email"
                  placeholder="Support Email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-800 placeholder:text-gray-300 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200"
                />
              </div>
            </div>

            {/* Knowledge Base */}
            <div>
              <h2 className="text-[15px] font-semibold text-gray-800 tracking-[-0.3px] mb-1">
                Knowledge Base
              </h2>
              <p className="text-[13px] text-gray-400 mb-3">
                Add FAQs, policies, delivery info, refunds, etc.
              </p>
              <textarea
                value={knowledge}
                onChange={(e) => setKnowledge(e.target.value)}
                rows={10}
                placeholder={`Example:\n• Refund policy: 7 days return available\n• Delivery time: 3–5 working days\n• Cash on Delivery available\n• Support hours`}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-800 placeholder:text-gray-300 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200 resize-none leading-relaxed"
              />
            </div>

            {/* Save Button */}
            <div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gray-900 hover:bg-black disabled:opacity-60 text-white text-[13.5px] font-medium px-6 py-2.5 rounded-xl tracking-[-0.1px] transition-all duration-200 active:scale-95 shadow-sm flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Saved!
                  </>
                ) : "Save"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardClient