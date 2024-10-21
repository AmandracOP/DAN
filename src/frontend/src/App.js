import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, RefreshCw, Sun, Moon, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const NodeGenerator = () => {
  const [nodes, setNodes] = useState([]);
  const [generationParams, setGenerationParams] = useState({
    count: 10,
    prefix: 'Node',
    region: 'US-East',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // New states for metrics
  const [metrics, setMetrics] = useState({});

  const regions = ['US-East', 'US-West', 'EU-West', 'EU-Central', 'Asia-Pacific'];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Simulate fetching real-time metrics
  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics = {};
      nodes.forEach(node => {
        newMetrics[node.id] = {
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          network: Math.random() * 1000,
          status: Math.random() > 0.1 ? 'online' : 'offline',
          history: Array.from({ length: 10 }, () => ({
            timestamp: new Date().toISOString(),
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            network: Math.random() * 1000,
          }))
        };
      });
      setMetrics(newMetrics);
    };

    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update
    return () => clearInterval(interval);
  }, [nodes]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const generateNodes = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newNodes = Array.from({ length: generationParams.count }, (_, i) => ({
        id: Date.now() + i,
        nodeName: `${generationParams.prefix}-${i + 1}`,
        nodeAddress: `0x${Math.random().toString(16).slice(2, 10)}`,
        region: generationParams.region,
        status: 'Active',
        createdAt: new Date().toISOString()
      }));
      
      setNodes(prevNodes => [...prevNodes, ...newNodes]);
    } catch (err) {
      setError('Failed to generate nodes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-4 space-y-6 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Decentralised Autonomous Network
        </h1>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>
      
      {/* Generator Controls (Existing) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-200">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Node Generator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of Nodes
            </label>
            <input
              type="number"
              min="1"
              max="100"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded 
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         dark:bg-gray-700 dark:text-white"
              value={generationParams.count}
              onChange={(e) => setGenerationParams({
                ...generationParams,
                count: parseInt(e.target.value) || 0
              })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Node Name Prefix
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded 
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         dark:bg-gray-700 dark:text-white"
              value={generationParams.prefix}
              onChange={(e) => setGenerationParams({
                ...generationParams,
                prefix: e.target.value
              })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Region
            </label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded 
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         dark:bg-gray-700 dark:text-white"
              value={generationParams.region}
              onChange={(e) => setGenerationParams({
                ...generationParams,
                region: e.target.value
              })}
            >
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded 
                       hover:bg-blue-700 disabled:opacity-50 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 transition-colors duration-200
                       dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={generateNodes}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Generate Nodes
          </button>
        </div>
      </div>

      {/* Error Alert (Existing) */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 mr-2" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* New Performance Dashboard Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Performance Dashboard</h2>
        
        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="h-64">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">CPU Usage</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Object.values(metrics).flatMap(m => m.history || [])}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-64">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Memory Usage</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Object.values(metrics).flatMap(m => m.history || [])}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="memory" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metrics Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Node</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">CPU</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Memory</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Network</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {nodes.map((node) => {
                const nodeMetrics = metrics[node.id] || {};
                return (
                  <tr key={node.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="p-3 dark:text-gray-300">{node.nodeName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        nodeMetrics.status === 'online'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                      }`}>
                        {nodeMetrics.status || 'unknown'}
                      </span>
                    </td>
                    <td className="p-3 dark:text-gray-300">{nodeMetrics.cpu?.toFixed(1)}%</td>
                    <td className="p-3 dark:text-gray-300">{nodeMetrics.memory?.toFixed(1)}%</td>
                    <td className="p-3 dark:text-gray-300">{nodeMetrics.network?.toFixed(1)} Mb/s</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nodes List (Existing) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Generated Nodes ({nodes.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Name</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Address</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Region</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Status</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {nodes.map((node) => (
                <tr key={node.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="p-3 dark:text-gray-300">{node.nodeName}</td>
                  <td className="p-3 font-mono text-sm dark:text-gray-300">{node.nodeAddress}</td>
                  <td className="p-3 dark:text-gray-300">{node.region}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm">
                      {node.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(node.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NodeGenerator;