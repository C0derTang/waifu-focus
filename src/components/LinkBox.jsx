import React, { useState, useEffect } from "react";

function isValidUrl(url) {
  // Allow * for wildcards in domain/path patterns
  if (url.includes('*')) {
    // Basic validation for wildcard patterns
    return /^[\w.*-]+$/.test(url);
  }
  
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(url);
}

function extractDomain(url) {
  try {
    // Handle wildcard patterns
    if (url.includes('*')) {
      return url;
    }
    // Remove protocol and get domain
    return url.replace(/^https?:\/\//, '').split('/')[0];
  } catch (e) {
    return url;
  }
}

function saveRules(rules) {
  chrome.storage.local.set({ blockRules: rules }, function () {
    console.log("Rules saved in chrome.storage");
  });
}

function LinkBox() {
  const [input, setInput] = useState("");
  const [ruleType, setRuleType] = useState("domain"); // 'domain' or 'path'
  const [blockRules, setBlockRules] = useState([]);

  useEffect(() => {
    // Load the rules
    chrome.storage.local.get(["blockRules"], function (result) {
      const rules = result.blockRules || [];
      setBlockRules(rules);
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

    let newRule;
    if (ruleType === "domain") {
      if (!isValidUrl(input) && !input.includes('*')) {
        alert("Please enter a valid domain or pattern");
        return;
      }
      newRule = {
        type: 'domain',
        value: extractDomain(input)
      };
    } else {
      // Path rule requires both domain and path
      try {
        const url = new URL(input);
        newRule = {
          type: 'path',
          domain: url.hostname,
          value: url.pathname + (url.search || '')
        };
      } catch (e) {
        alert("Please enter a valid URL for path blocking");
        return;
      }
    }

    const updatedRules = [...blockRules, newRule];
    setBlockRules(updatedRules);
    saveRules(updatedRules);
    setInput("");
  }

  function deleteRule(index) {
    const updatedRules = blockRules.filter((_, i) => i !== index);
    setBlockRules(updatedRules);
    saveRules(updatedRules);
  }

  return (
    <div className="p-6 max-w-md mx-auto rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-center">Sites to Block</h2>
      <div className="space-y-4">
        <div className="flex gap-2">
          <select
            value={ruleType}
            onChange={(e) => setRuleType(e.target.value)}
            className="py-2 px-3 border rounded focus:outline-none focus:ring-2 focus:ring-slate-700"
          >
            <option value="domain">Block Domain</option>
            <option value="path">Block Path</option>
          </select>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={ruleType === "domain" ? "Domain or pattern (e.g., *.youtube.com)" : "Full URL to block specific path"}
            className="flex-1 py-2 px-3 border rounded focus:outline-none focus:ring-2 focus:ring-slate-700"
          />
        </div>
        <button
          onClick={addRule}
          className="w-full py-2 px-4 bg-slate-800 text-white rounded hover:bg-slate-700 transition duration-100"
        >
          Add Rule
        </button>
      </div>
      <ul className="space-y-2">
        {blockRules.map((rule, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 border rounded bg-white"
          >
            <div className="flex-1">
              <span className="text-sm font-medium text-slate-500">
                {rule.type === 'domain' ? 'Domain: ' : 'Path: '}
              </span>
              <span className="break-all">
                {rule.type === 'domain' ? rule.value : `${rule.domain}${rule.value}`}
              </span>
            </div>
            <button
              onClick={() => deleteRule(index)}
              className="ml-2 px-2 py-1 text-red-600 hover:bg-red-50 rounded transition duration-100"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LinkBox;
