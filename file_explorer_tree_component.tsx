import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  FileText, 
  Settings, 
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

const defaultTreeData = [
  {
    id: 'dir-1',
    name: 'directory-1',
    type: 'directory',
    children: [
      { id: 'file-1', name: 'file-1.js', type: 'file', content: '// file-1.js\nconsole.log("Hello from directory 1, file 1");' },
      { id: 'file-2', name: 'file-2.js', type: 'file', content: '// file-2.js\nexport const helper = () => {\n  return "utility active";\n};' }
    ]
  },
  {
    id: 'dir-2',
    name: 'directory-2',
    type: 'directory',
    children: [
      { id: 'file-3', name: 'file-3.js', type: 'file', content: '// file-3.js\nimport React from "react";\nexport function Component3() {\n  return <div>Directory 2 Component</div>;\n}' },
      {
        id: 'dir-3',
        name: 'directory-3',
        type: 'directory',
        children: [
          { id: 'file-4', name: 'file-4.js', type: 'file', content: '// file-4.js\nconst config = {\n  env: "production",\n  version: "1.0.4"\n};' },
          {
            id: 'dir-4',
            name: 'directory-4',
            type: 'directory',
            children: [
              { id: 'file-5', name: 'file-5.js', type: 'file', content: '// file-5.js\n// Deepest nested file\nconsole.log("Deep file active!");' }
            ]
          }
        ]
      }
    ]
  },
  { id: 'file-6', name: 'file-6.js', type: 'file', content: '// file-6.js\n// Root level file\nconst rootConfig = true;' }
];

function TreeNode({ node, level = 0, selectedFileId, onSelectFile, searchTerm }) {
  const [isOpen, setIsOpen] = useState(true);

  // Check if node matches search filter
  const matchesSearch = (item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    if (item.name.toLowerCase().includes(term)) return true;
    if (item.children) {
      return item.children.some(child => matchesSearch(child));
    }
    return false;
  };

  if (!matchesSearch(node)) {
    return null;
  }

  const isDirectory = node.type === 'directory';
  const isSelected = selectedFileId === node.id;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node);
    }
  };

  return (
    <div className="select-none text-sm">
      <div 
        onClick={handleToggle}
        style={{ paddingLeft: `${level * 1.25 + 0.75}rem` }}
        className={`flex items-center py-1.5 pr-3 cursor-pointer transition-colors duration-150 rounded-lg group ${
          isSelected 
            ? 'bg-blue-600 text-white font-medium shadow-sm' 
            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
        }`}
      >
        {/* Chevron for directories */}
        <span className="w-5 h-5 flex items-center justify-center mr-1 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
          {isDirectory ? (
            isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />
          ) : (
            <span className="w-3" />
          )}
        </span>

        {/* Folder or File Icon */}
        <span className="mr-2">
          {isDirectory ? (
            isOpen ? (
              <FolderOpen size={17} className="text-amber-500 fill-amber-500/20" />
            ) : (
              <Folder size={17} className="text-amber-500 fill-amber-500/20" />
            )
          ) : (
            <FileCode size={17} className="text-sky-500" />
          )}
        </span>

        {/* Name */}
        <span className="truncate flex-1">
          {isDirectory ? `/${node.name}` : node.name}
        </span>
      </div>

      {/* Render children recursively if directory and open */}
      {isDirectory && isOpen && node.children && (
        <div className="flex flex-col space-y-0.5 mt-0.5">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedFileId={selectedFileId}
              onSelectFile={onSelectFile}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Tree({ data, selectedFileId, onSelectFile, searchTerm }) {
  return (
    <div className="flex flex-col space-y-1 py-2">
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          selectedFileId={selectedFileId}
          onSelectFile={onSelectFile}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [treeData, setTreeData] = useState(defaultTreeData);
  const [selectedFile, setSelectedFile] = useState(defaultTreeData[0].children[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState('');

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2500);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
      <div className="flex flex-col h-screen max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Layers size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Hierarchical File Explorer</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Reusable Tree Component with Interactive Expand/Collapse</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search files or directories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm"
              title="Toggle Dark Mode"
            >
              <Sparkles size={18} className="text-amber-500" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 flex-1 overflow-hidden pb-4">
          
          {/* Sidebar / Tree Explorer Panel */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col shadow-sm overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Workspace Explorer</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium">React Component</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <Tree 
                data={treeData} 
                selectedFileId={selectedFile?.id} 
                onSelectFile={(file) => {
                  setSelectedFile(file);
                  triggerNotification(`Opened ${file.name}`);
                }}
                searchTerm={searchTerm}
              />
            </div>

            <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Click folder arrows to toggle</span>
              <span>Select file to preview</span>
            </div>
          </div>

          {/* Code Preview & Details Panel */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col shadow-sm overflow-hidden">
            {selectedFile ? (
              <>
                {/* File Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center space-x-3">
                    <FileCode size={20} className="text-sky-500" />
                    <div>
                      <h2 className="font-semibold text-sm">{selectedFile.name}</h2>
                      <p className="text-xs text-slate-400">ID: {selectedFile.id} • JavaScript Source</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const textArea = document.createElement("textarea");
                      textArea.value = selectedFile.content;
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand("copy");
                      document.body.removeChild(textArea);
                      triggerNotification("Copied file content to clipboard!");
                    }}
                    className="px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition shadow-sm"
                  >
                    Copy Code
                  </button>
                </div>

                {/* File Content Body */}
                <div className="flex-1 p-6 bg-slate-900 dark:bg-slate-950 text-slate-200 font-mono text-sm overflow-auto">
                  <pre className="leading-relaxed">
                    <code>{selectedFile.content}</code>
                  </pre>
                </div>

                {/* Status Footer */}
                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>UTF-8 • JavaScript</span>
                  </div>
                  <span>Ready</span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <FileText size={48} className="mb-3 opacity-30" />
                <p className="font-medium">No file selected</p>
                <p className="text-xs mt-1">Select a file from the tree explorer on the left to view its contents.</p>
              </div>
            )}
          </div>

        </div>

        {/* Floating Notification Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium animate-bounce">
            <Info size={16} className="text-blue-400 dark:text-blue-600" />
            <span>{notification}</span>
          </div>
        )}

      </div>
    </div>
  );
}