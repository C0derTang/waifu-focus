import React, { useState, useEffect } from "react";
import { safeStorage } from "../utils/chromePolyfill";

function isValidUrl(url) {
  if (url.includes('*')) {
    return /^[\w.*-]+$/.test(url);
  }

  const pattern = new RegExp(
    "^(https?:\\/\\/)?" +
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
    "((\\d{1,3}\\.){3}\\d{1,3}))" +
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
    "(\\?[;&a-z\\d%_.~+=-]*)?" +
    "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(url);
}

function extractDomain(url) {
  try {
    if (url.includes('*')) {
      return url;
    }
    return url.replace(/^https?:\/\//, '').split('/')[0];
  } catch (e) {
    return url;
  }
}

const DEFAULT_SCHEDULE = {
  days: [0, 1, 2, 3, 4, 5, 6],
  startTime: "00:00",
  endTime: "23:59",
  enabled: false
};

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function saveRules(rules) {
  safeStorage.set({ blockRules: rules }, function () {
    console.log("Rules saved in storage");
  });
}

function LinkBox() {
  const [input, setInput] = useState("");
  const [ruleType, setRuleType] = useState("domain");
  const [blockRules, setBlockRules] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isListExpanded, setIsListExpanded] = useState(false);

  // Deletion friction state
  const [frictionState, setFrictionState] = useState({ id: null, count: 0, pos: { top: '50%', right: '1rem' } });

  useEffect(() => {
    safeStorage.get(["blockRules"], function (result) {
      const rules = result.blockRules || [];
      const migratedRules = rules.map(rule => ({
        ...rule,
        schedule: rule.schedule || { ...DEFAULT_SCHEDULE },
        id: rule.id || Math.random().toString(36).substr(2, 9)
      }));
      setBlockRules(migratedRules);
    });
  }, []);

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  function addRule() {
    if (!input.trim()) {
      alert("Please enter a URL or pattern");
      return;
    }

    let newRuleData;
    if (ruleType === "domain") {
      if (!isValidUrl(input) && !input.includes('*')) {
        alert("Please enter a valid domain or pattern");
        return;
      }
      newRuleData = {
        type: 'domain',
        value: extractDomain(input)
      };
    } else {
      try {
        const url = new URL(input);
        newRuleData = {
          type: 'path',
          domain: url.hostname,
          value: url.pathname + (url.search || '')
        };
      } catch (e) {
        alert("Please enter a valid URL for path blocking");
        return;
      }
    }

    const newRule = {
      ...newRuleData,
      id: Math.random().toString(36).substr(2, 9),
      schedule: { ...DEFAULT_SCHEDULE }
    };

    const updatedRules = [...blockRules, newRule];
    setBlockRules(updatedRules);
    saveRules(updatedRules);
    setInput("");
    // Automatically expand when adding new rule for feedback
    setIsListExpanded(true);
  }

  function deleteRule(id) {
    const updatedRules = blockRules.filter(rule => rule.id !== id);
    setBlockRules(updatedRules);
    saveRules(updatedRules);
    setFrictionState({ id: null, count: 0, pos: { top: '50%', right: '1rem' } });
  }

  function handleFrictionDelete(id) {
    const messages = [
      "Are you sure you want to unblock this? Think about your goals.",
      "Are you really sure? Your waifu is watching.",
      "Just 3 more clicks to go. Is it worth it?",
      "Almost there... are you certain?",
      "Final confirmation: Break your focus now?"
    ];

    if (frictionState.id !== id) {
      // First click for this specific item
      if (window.confirm(messages[0])) {
        const newPos = {
          top: `${Math.floor(Math.random() * 80) + 10}%`,
          left: `${Math.floor(Math.random() * 80) + 10}%`,
          right: 'auto',
          transform: 'translate(-50%, -50%)'
        };
        setFrictionState({ id, count: 1, pos: newPos });
      }
    } else {
      // Subsequent clicks
      if (window.confirm(messages[frictionState.count])) {
        if (frictionState.count >= 4) {
          deleteRule(id);
        } else {
          const newPos = {
            top: `${Math.floor(Math.random() * 80) + 10}%`,
            left: `${Math.floor(Math.random() * 80) + 10}%`,
            right: 'auto',
            transform: 'translate(-50%, -50%)'
          };
          setFrictionState({ ...frictionState, count: frictionState.count + 1, pos: newPos });
        }
      }
    }
  }

  function updateRuleSchedule(id, scheduleUpdate) {
    const updatedRules = blockRules.map(rule => {
      if (rule.id === id) {
        return { ...rule, schedule: { ...rule.schedule, ...scheduleUpdate } };
      }
      if (rule.type === 'group') {
        return {
          ...rule,
          sites: rule.sites.map(site => {
            if (site.id === id) {
              return { ...site, schedule: { ...site.schedule, ...scheduleUpdate } };
            }
            return site;
          })
        };
      }
      return rule;
    });
    setBlockRules(updatedRules);
    saveRules(updatedRules);
  }

  function updateGroupSchedule(groupId, scheduleUpdate) {
    const updatedRules = blockRules.map(rule => {
      if (rule.id === groupId) {
        return { ...rule, schedule: { ...rule.schedule, ...scheduleUpdate } };
      }
      return rule;
    });
    setBlockRules(updatedRules);
    saveRules(updatedRules);
  }

  // --- Drag and Drop Grouping ---
  function onDragStart(e, index) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function onDrop(e, targetIndex) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const rules = [...blockRules];
    const source = rules[draggedIndex];
    const target = rules[targetIndex];

    let newRules = [...blockRules];

    if (source.type !== 'group' && target.type !== 'group') {
      const newGroup = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'group',
        name: 'New Group',
        schedule: { ...DEFAULT_SCHEDULE },
        sites: [source, target]
      };
      newRules = rules.filter((_, i) => i !== draggedIndex && i !== targetIndex);
      newRules.push(newGroup);
    }
    else if (target.type === 'group' && source.type !== 'group') {
      const updatedTarget = { ...target, sites: [...target.sites, source] };
      newRules = rules.filter((_, i) => i !== draggedIndex);
      newRules[newRules.indexOf(target)] = updatedTarget;
    }
    else if (source.type === 'group' && target.type !== 'group') {
      const updatedSource = { ...source, sites: [...source.sites, target] };
      newRules = rules.filter((_, i) => i !== targetIndex);
      newRules[newRules.indexOf(source)] = updatedSource;
    }
    else if (source.type === 'group' && target.type === 'group') {
      const mergedTarget = { ...target, sites: [...target.sites, ...source.sites] };
      newRules = rules.filter((_, i) => i !== draggedIndex);
      newRules[newRules.indexOf(target)] = mergedTarget;
    }

    setBlockRules(newRules);
    saveRules(newRules);
    setDraggedIndex(null);
  }

  function removeFromGroup(groupId, siteId) {
    const updatedRules = blockRules.map(rule => {
      if (rule.id === groupId) {
        const remainingSites = rule.sites.filter(s => s.id !== siteId);
        if (remainingSites.length === 0) return null;
        return { ...rule, sites: remainingSites };
      }
      return rule;
    }).filter(Boolean);

    const group = blockRules.find(r => r.id === groupId);
    const site = group.sites.find(s => s.id === siteId);
    updatedRules.push(site);

    setBlockRules(updatedRules);
    saveRules(updatedRules);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Focus Schedule
        </h2>
        <p className="text-sm text-slate-500 font-medium">Manage your distractions</p>
      </div>

      <div className="glass-panel p-1.5 rounded-2xl soft-shadow flex items-center gap-2">
        <select
          value={ruleType}
          onChange={(e) => setRuleType(e.target.value)}
          className="py-3 px-4 bg-transparent text-sm font-semibold text-slate-600 focus:outline-none cursor-pointer hover:text-pink-500 transition-colors border-r border-slate-200/50"
        >
          <option value="domain">Domain</option>
          <option value="path">Path</option>
        </select>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && addRule()}
          placeholder={ruleType === "domain" ? "youtube.com" : "Full URL..."}
          className="flex-1 py-3 bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none font-medium"
        />
        <button
          onClick={addRule}
          className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setIsListExpanded(!isListExpanded)}
          className="w-full group flex items-center justify-between py-2 px-4 rounded-lg hover:bg-pink-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`p-1 rounded-full transition-transform duration-300 ${isListExpanded ? 'bg-pink-100 rotate-90' : 'bg-slate-100'}`}>
              <svg className={`w-4 h-4 ${isListExpanded ? 'text-pink-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <span className="font-semibold text-slate-600 group-hover:text-pink-600 transition-colors">Blocked Websites</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-bold group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors">
              {blockRules.length}
            </span>
          </div>
        </button>

        {isListExpanded && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="text-[10px] text-slate-400 text-center italic mb-2">
              Tip: Drag sites onto each other to group them!
            </div>

            {blockRules.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                No sites blocked yet. Stay focused!
              </div>
            ) : (
              blockRules.map((rule, index) => (
                <div
                  key={rule.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, index)}
                  className={`transition-all duration-200 ${draggedIndex === index ? 'opacity-50' : ''}`}
                >
                  {rule.type === 'group' ? (
                    <GroupItem
                      group={rule}
                      onDelete={() => handleFrictionDelete(rule.id)}
                      onUpdateSchedule={(upd) => updateGroupSchedule(rule.id, upd)}
                      onRemoveSite={(siteId) => removeFromGroup(rule.id, siteId)}
                      frictionPos={frictionState.id === rule.id ? frictionState.pos : null}
                    />
                  ) : (
                    <RuleItem
                      rule={rule}
                      onDelete={() => handleFrictionDelete(rule.id)}
                      onUpdateSchedule={(upd) => updateRuleSchedule(rule.id, upd)}
                      frictionPos={frictionState.id === rule.id ? frictionState.pos : null}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ScheduleEditor({ schedule, onUpdate }) {
  const toggleDay = (dayIndex) => {
    const newDays = schedule.days.includes(dayIndex)
      ? schedule.days.filter(d => d !== dayIndex)
      : [...schedule.days, dayIndex];
    onUpdate({ days: newDays });
  };

  return (
    <div className="mt-3 pt-3 border-t border-pink-100 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={schedule.enabled}
            onChange={(e) => onUpdate({ enabled: e.target.checked })}
            className="w-4 h-4 accent-pink-500"
          />
          <span className="text-sm font-medium text-slate-600">Enable Schedule</span>
        </label>

        <div className="flex gap-1">
          {DAY_LABELS.map((day, i) => (
            <button
              key={i}
              onClick={() => toggleDay(i)}
              className={`w-7 h-7 rounded text-[10px] font-bold transition ${schedule.days.includes(i)
                ? 'bg-pink-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {schedule.enabled && (
        <div className="flex items-center gap-4 text-sm text-slate-600 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex-1 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Start</span>
            <input
              type="time"
              value={schedule.startTime}
              onChange={(e) => onUpdate({ startTime: e.target.value })}
              className="w-full p-1 border border-pink-100 rounded focus:ring-1 focus:ring-pink-400 outline-none"
            />
          </div>
          <div className="flex-1 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">End</span>
            <input
              type="time"
              value={schedule.endTime}
              onChange={(e) => onUpdate({ endTime: e.target.value })}
              className="w-full p-1 border border-pink-100 rounded focus:ring-1 focus:ring-pink-400 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function RuleItem({ rule, onDelete, onUpdateSchedule, frictionPos }) {
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <div className="relative p-0.5 bg-white rounded-xl shadow-sm border border-pink-100 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-center p-3">
        <div className="flex-1 flex items-center gap-3">
          <div className={`w-1.5 h-8 rounded-full ${rule.type === 'domain' ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-700 truncate max-w-[180px] text-sm leading-tight">
              {rule.type === 'domain' ? rule.value : `${rule.domain}${rule.value}`}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {rule.type}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pr-10">
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full border transition-all ${rule.schedule.enabled
              ? 'border-pink-200 text-pink-600 bg-pink-50'
              : 'border-slate-100 text-slate-400 bg-slate-50 hover:bg-slate-100'
              }`}
          >
            {rule.schedule.enabled ? 'Scheduled' : 'Always'}
          </button>
        </div>

        <button
          onClick={onDelete}
          style={frictionPos || { top: '50%', right: '0.75rem', transform: 'translateY(-50%)' }}
          className={`absolute p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-full ${frictionPos ? 'shadow-lg border border-red-200 z-10 scale-125 bg-white' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {showSchedule && (
        <div className="px-4 pb-4">
          <ScheduleEditor
            schedule={rule.schedule}
            onUpdate={onUpdateSchedule}
          />
        </div>
      )}
    </div>
  );
}

function GroupItem({ group, onDelete, onUpdateSchedule, onRemoveSite, frictionPos }) {
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <div className="relative p-4 border border-pink-200 rounded-xl bg-gradient-to-br from-pink-50/50 to-white shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-pink-200 shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-700 text-sm">Group: {group.sites.length} Sites</span>
            <span className="text-[10px] text-pink-500 font-bold uppercase tracking-wider">Shared Schedule</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pr-10">
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full border transition-all ${group.schedule.enabled
              ? 'border-pink-200 text-pink-600 bg-pink-100/50'
              : 'border-slate-100 text-slate-400 bg-white hover:bg-slate-50'
              }`}
          >
            {group.schedule.enabled ? 'Scheduled' : 'Always'}
          </button>
        </div>

        <button
          onClick={onDelete}
          style={frictionPos || { top: '1rem', right: '1rem' }}
          className={`absolute p-2 text-slate-300 hover:text-red-500 hover:bg-white transition-all rounded-full ${frictionPos ? 'shadow-lg border border-red-200 z-10 scale-125 bg-white' : ''}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="space-y-1.5 mb-3 pr-2 pl-1">
        {group.sites.map(site => (
          <div key={site.id} className="flex justify-between items-center bg-white p-2 rounded-lg text-sm border border-slate-100 shadow-sm hover:border-pink-100 transition-colors">
            <span className="truncate text-slate-600 font-medium text-xs max-w-[150px]">{site.type === 'domain' ? site.value : site.domain + site.value}</span>
            <button
              onClick={() => onRemoveSite(site.id)}
              className="text-slate-300 hover:text-pink-500 px-1.5 transition-colors"
              title="Remove from group"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {showSchedule && (
        <ScheduleEditor
          schedule={group.schedule}
          onUpdate={onUpdateSchedule}
        />
      )}
    </div>
  );
}

export default LinkBox;
