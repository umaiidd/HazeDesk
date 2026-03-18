"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

const EmbedClient = ({ ownerId, email }: { ownerId: string; email: string }) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const firstLetter = email ? email[0].toUpperCase() : null;

 const embedScript = `<script\n  src="${process.env.NEXT_PUBLIC_APP_URL}/chatBot.js"\n  data-owner-id="${ownerId}"\n></script>`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout   = () => { window.location.href = "/api/auth/logout"; };
  const handleHome     = () => { window.location.href = "/"; };
  const handleDashboard = () => { window.location.href = "/dashboard"; };

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

      {/* ── Navbar ── */}
      <div className="anim-fade-down fixed top-4 left-0 right-0 z-50">
        <div className={`max-w-5xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between rounded-2xl border transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-2xl border-gray-200/80 shadow-sm"
            : "bg-white border-gray-200"
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
            {/* Back to Dashboard button */}
            <button
              onClick={handleDashboard}
              className="text-[13px] font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl px-3 sm:px-4 py-2 transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span className="hidden sm:inline">Back to Dashboard</span>
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
              Embed ChatBot
            </h1>
            <p className="text-[14px] text-gray-400">
              Copy and paste this code before{" "}
              <code className="bg-gray-100 text-gray-600 text-[12px] px-1.5 py-0.5 rounded-md font-mono">
                &lt;/body&gt;
              </code>
            </p>
          </div>

          {/* Card Body */}
          <div className="px-4 sm:px-8 py-5 sm:py-7 flex flex-col gap-8">

            {/* Code Block */}
            <div className="relative bg-gray-900 rounded-xl overflow-hidden">
              <pre className="text-[11px] sm:text-[13.5px] font-mono text-gray-200 leading-relaxed p-4 sm:p-5 pr-24 sm:pr-28 overflow-x-auto whitespace-pre">
                {`<script\n  src="http://localhost:3000/chatBot.js"\n  data-owner-id="${ownerId}"\n></script>`}
              </pre>
              <button
                onClick={handleCopy}
                className={`absolute top-4 right-4 text-[12.5px] font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-200 active:scale-95 ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-3">
              {[
                "Copy the embed script",
                "Paste it before the closing body tag",
                "Reload your website",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-[14px] text-gray-600">{step}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Live Preview */}
            <div>
              <h2 className="text-[15px] font-semibold text-gray-800 tracking-[-0.3px] mb-1">
                Live Preview
              </h2>
              <p className="text-[13px] text-gray-400 mb-4">
                This is how the chatbot will appear on your website
              </p>

              {/* Browser mockup */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Browser chrome */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    {["#ff5f57", "#ffbd2e", "#28ca41"].map((c, i) => (
                      <div key={i} style={{ backgroundColor: c }} className="w-3 h-3 rounded-full" />
                    ))}
                  </div>
                  <span className="text-[12px] text-gray-400 font-mono">Your-website.com</span>
                </div>

                {/* Website body */}
                <div className="bg-gray-50 h-64 relative p-5">
                  <p className="text-[13px] text-gray-300">Your website goes here</p>

                  {/* Chat widget */}
                  <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2.5">
                    <div className="bg-white rounded-2xl shadow-lg w-44 sm:w-56 overflow-hidden border border-gray-100">
                      <div className="bg-gray-900 px-4 py-2.5 flex items-center justify-between">
                        <span className="text-white text-[12px] font-semibold">Customer Support</span>
                        <span className="text-gray-400 text-[16px] leading-none">×</span>
                      </div>
                      <div className="p-3 flex flex-col gap-2">
                        <div className="self-start bg-gray-100 text-gray-700 text-[12px] px-3 py-2 rounded-2xl rounded-bl-sm max-w-[85%] leading-relaxed">
                          hi! how can I help you?
                        </div>
                        <div className="self-end bg-gray-900 text-white text-[12px] px-3 py-2 rounded-2xl rounded-br-sm max-w-[85%] leading-relaxed">
                          what is the return policy?
                        </div>
                      </div>
                    </div>

                    <button className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center shadow-md hover:bg-black transition-colors duration-200">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmbedClient;