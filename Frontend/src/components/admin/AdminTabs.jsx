import React from "react";

/**
 * AdminTabs Component
 * Renders the navigation tab bar for the Admin Dashboard.
 * 
 * @param {Array} tabs - List of tab names.
 * @param {string} activeTab - The currently active tab.
 * @param {function} onTabChange - Callback function when a tab is clicked.
 */
const AdminTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-2 shadow-xl shadow-black/20 no-scrollbar">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onTabChange(t)}
          className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            activeTab === t
              ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
              : "text-slate-500 hover:bg-slate-700/40 hover:text-slate-300"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

export default AdminTabs;
