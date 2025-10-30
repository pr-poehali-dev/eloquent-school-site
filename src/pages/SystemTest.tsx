import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { api, type Project as ApiProject, type ProjectFile as ApiProjectFile } from '@/lib/api';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'building' | 'deployed';
  createdAt: string;
  files: ProjectFile[];
  url?: string;
  color: string;
}

interface ProjectFile {
  id: string;
  path: string;
  content: string;
  type: 'component' | 'page' | 'style' | 'config';
}

const projectColors = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-violet-500 to-purple-500',
  'from-rose-500 to-pink-500',
];

function SystemTest() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [logs, setLogs] = useState<string[]>(['🚀 Система запущена и готова к работе']);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showFileEditor, setShowFileEditor] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const addLog = (message: string) => {
    setLogs(prev => [`${new Date().toLocaleTimeString()} ${message}`, ...prev].slice(0, 100));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      addLog('📡 Загрузка проектов из базы данных...');
      const data = await api.projects.getAll();
      
      const projectsWithFiles = await Promise.all(
        data.map(async (p) => {
          try {
            const fullProject = await api.projects.getById(p.id);
            return {
              id: fullProject.id,
              name: fullProject.name,
              description: fullProject.description || '',
              status: fullProject.status,
              createdAt: fullProject.created_at || new Date().toISOString(),
              url: fullProject.url,
              color: fullProject.color,
              files: (fullProject.files || []).map(f => ({
                id: f.id,
                path: f.path,
                content: f.content,
                type: (f.file_type || 'page') as ProjectFile['type']
              }))
            };
          } catch (err) {
            return {
              id: p.id,
              name: p.name,
              description: p.description || '',
              status: p.status,
              createdAt: p.created_at || new Date().toISOString(),
              url: p.url,
              color: p.color,
              files: []
            };
          }
        })
      );

      setProjects(projectsWithFiles);
      addLog(`✅ Загружено ${projectsWithFiles.length} проектов`);
    } catch (error) {
      addLog(`❌ Ошибка загрузки: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;

    const projectId = String(Date.now());
    const fileId = `f${Date.now()}`;
    const color = projectColors[projects.length % projectColors.length];

    try {
      addLog(`🔨 Создание проекта: ${newProjectName}`);
      
      await api.projects.create({
        id: projectId,
        name: newProjectName,
        description: newProjectDescription,
        status: 'active',
        color,
        files: [
          {
            id: fileId,
            path: 'src/App.tsx',
            content: `import React from "react";\n\nfunction App() {\n  return (\n    <div className="min-h-screen">\n      <h1>${newProjectName}</h1>\n    </div>\n  );\n}\n\nexport default App;`,
            type: 'page'
          }
        ]
      });

      addLog(`✅ Проект создан: ${newProjectName}`);
      await loadProjects();
      setShowNewProjectDialog(false);
      setNewProjectName('');
      setNewProjectDescription('');
    } catch (error) {
      addLog(`❌ Ошибка создания: ${error}`);
    }
  };

  const deleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    setProjects(projects.filter(p => p.id !== projectId));
    addLog(`🗑️ Удален проект: ${project?.name} (только локально)`);
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  const buildProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, status: 'building' as const } : p
    ));
    addLog(`🔨 Начата сборка: ${project.name}`);

    try {
      setTimeout(async () => {
        const deployUrl = `https://${project.name.toLowerCase().replace(/\s+/g, '-')}.poehali.dev`;
        
        await api.projects.update(projectId, {
          status: 'deployed',
          url: deployUrl
        });

        setProjects(prevProjects => prevProjects.map(p => 
          p.id === projectId ? { 
            ...p, 
            status: 'deployed' as const,
            url: deployUrl
          } : p
        ));
        addLog(`🚀 Проект развернут: ${project.name}`);
        
        if (selectedProject?.id === projectId) {
          setSelectedProject(prev => prev ? {
            ...prev,
            status: 'deployed',
            url: deployUrl
          } : null);
        }
      }, 3000);
    } catch (error) {
      addLog(`❌ Ошибка деплоя: ${error}`);
    }
  };

  const processAiRequest = async () => {
    if (!aiPrompt.trim() || !selectedProject) return;

    setIsProcessing(true);
    addLog(`🤖 AI обрабатывает запрос: "${aiPrompt}"`);

    try {
      const fileName = aiPrompt.toLowerCase().includes('форм') ? 'ContactForm' :
                       aiPrompt.toLowerCase().includes('кнопк') ? 'Button' :
                       aiPrompt.toLowerCase().includes('карточ') ? 'Card' :
                       `Component${Date.now()}`;

      const fileId = `f${Date.now()}`;
      const filePath = `src/components/${fileName}.tsx`;
      const fileContent = `// Generated by AI\n// Request: ${aiPrompt}\n\nimport React from 'react';\n\ninterface ${fileName}Props {\n  // Add your props here\n}\n\nexport const ${fileName}: React.FC<${fileName}Props> = () => {\n  return (\n    <div className="p-4">\n      <h2>Generated ${fileName}</h2>\n    </div>\n  );\n};\n\nexport default ${fileName};`;

      await api.files.create({
        id: fileId,
        project_id: selectedProject.id,
        path: filePath,
        content: fileContent,
        type: 'component'
      });

      const newFile: ProjectFile = {
        id: fileId,
        path: filePath,
        content: fileContent,
        type: 'component'
      };

      setProjects(projects.map(p => 
        p.id === selectedProject.id 
          ? { ...p, files: [...p.files, newFile] }
          : p
      ));

      addLog(`✨ AI создал компонент: ${filePath}`);
      setAiPrompt('');
      
      setSelectedProject(prev => prev ? {
        ...prev,
        files: [...prev.files, newFile]
      } : null);
    } catch (error) {
      addLog(`❌ Ошибка AI: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateFileContent = async (content: string) => {
    if (!selectedFile || !selectedProject) return;

    try {
      await api.files.update(selectedFile.id, { content });

      setProjects(projects.map(p => 
        p.id === selectedProject.id 
          ? {
              ...p,
              files: p.files.map(f => 
                f.id === selectedFile.id ? { ...f, content } : f
              )
            }
          : p
      ));

      setSelectedFile({ ...selectedFile, content });
      addLog(`💾 Сохранен: ${selectedFile.path}`);
    } catch (error) {
      addLog(`❌ Ошибка сохранения: ${error}`);
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch(status) {
      case 'deployed': return { icon: 'CheckCircle2', color: 'text-emerald-400' };
      case 'building': return { icon: 'Loader2', color: 'text-amber-400 animate-spin' };
      default: return { icon: 'Circle', color: 'text-slate-400' };
    }
  };

  const getFileIcon = (type: ProjectFile['type']) => {
    switch(type) {
      case 'component': return 'Box';
      case 'page': return 'FileText';
      case 'style': return 'Palette';
      default: return 'File';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                  <Icon name="Rocket" size={28} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Project Studio
                </h1>
                <p className="text-slate-400 mt-1">AI-powered development platform</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowNewProjectDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-6 rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:scale-105"
          >
            <Icon name="Plus" size={20} className="mr-2" />
            Новый проект
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Загрузка проектов...</p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Проекты</h2>
                  <div className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium">
                    {projects.length}
                  </div>
                </div>

                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Icon name="FolderOpen" size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Нет проектов</p>
                      <p className="text-xs mt-1">Создайте первый проект</p>
                    </div>
                  ) : (
                    projects.map(project => {
                  const statusInfo = getStatusIcon(project.status);
                  return (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedProject?.id === project.id
                          ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                          : 'bg-white/5 hover:bg-white/10 border-2 border-transparent hover:border-white/20'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`}></div>
                      
                      <div className="relative">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-white font-semibold text-sm flex-1 truncate pr-2">
                            {project.name}
                          </h3>
                          <Icon name={statusInfo.icon as any} size={18} className={statusInfo.color} />
                        </div>
                        
                        <p className="text-slate-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Icon name="FileCode" size={14} />
                            <span>{project.files.length}</span>
                          </div>
                          {project.url && (
                            <a 
                              href={project.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Icon name="ExternalLink" size={14} />
                              <span>Open</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Icon name="BarChart3" size={18} />
                Статистика
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Активных', value: projects.filter(p => p.status === 'active').length, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Развернутых', value: projects.filter(p => p.status === 'deployed').length, color: 'from-emerald-500 to-teal-500' },
                  { label: 'Файлов', value: projects.reduce((acc, p) => acc + p.files.length, 0), color: 'from-purple-500 to-pink-500' },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-slate-400 text-sm">{stat.label}</span>
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} blur-lg opacity-30`}></div>
                      <div className={`relative px-3 py-1 bg-gradient-to-r ${stat.color} rounded-lg text-white font-bold text-sm`}>
                        {stat.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            {selectedProject ? (
              <>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${selectedProject.color} opacity-5`}></div>
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {selectedProject.name}
                        </h2>
                        <p className="text-slate-400">
                          {selectedProject.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => buildProject(selectedProject.id)}
                          disabled={selectedProject.status === 'building'}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-500/25"
                        >
                          <Icon name="Rocket" size={16} className="mr-1" />
                          {selectedProject.status === 'building' ? 'Деплой...' : 'Деплой'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => deleteProject(selectedProject.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>

                    {selectedProject.url && (
                      <a
                        href={selectedProject.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-400 text-sm transition-all"
                      >
                        <Icon name="Globe" size={16} />
                        {selectedProject.url}
                        <Icon name="ExternalLink" size={14} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                      <Icon name="Sparkles" size={18} className="text-white" />
                    </div>
                    AI Ассистент
                  </h3>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Создай форму обратной связи с полями имя, email, сообщение..."
                        className="bg-black/20 border-white/10 text-white placeholder:text-slate-500 pr-12 py-6 rounded-xl"
                        onKeyDown={(e) => e.key === 'Enter' && processAiRequest()}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                        <Icon name="Command" size={14} />
                      </div>
                    </div>
                    <Button
                      onClick={processAiRequest}
                      disabled={isProcessing || !aiPrompt.trim()}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 rounded-xl shadow-lg shadow-purple-500/25"
                    >
                      {isProcessing ? (
                        <Icon name="Loader2" size={20} className="animate-spin" />
                      ) : (
                        <Icon name="Send" size={20} />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Icon name="FolderTree" size={20} />
                    Файлы проекта
                    <span className="ml-auto text-sm font-normal text-slate-400">
                      {selectedProject.files.length} файлов
                    </span>
                  </h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {selectedProject.files.map(file => (
                      <div
                        key={file.id}
                        onClick={() => {
                          setSelectedFile(file);
                          setShowFileEditor(true);
                        }}
                        className="group p-4 rounded-xl bg-black/20 hover:bg-black/40 border border-white/5 hover:border-white/10 cursor-pointer transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all">
                            <Icon name={getFileIcon(file.type) as any} size={18} className="text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white text-sm font-mono font-medium">
                              {file.path}
                            </div>
                            <div className="text-slate-500 text-xs mt-0.5 capitalize">
                              {file.type}
                            </div>
                          </div>
                          <Icon name="ChevronRight" size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-16 shadow-2xl text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-20"></div>
                  <div className="relative p-6 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl">
                    <Icon name="FolderOpen" size={64} className="text-purple-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Выберите проект
                </h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Откройте существующий проект из списка или создайте новый для начала работы
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Icon name="Activity" size={20} />
                Логи системы
              </h3>
              <div className="bg-black/40 rounded-xl p-4 h-[calc(100vh-240px)] overflow-y-auto font-mono text-xs space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {logs.map((log, i) => (
                  <div key={i} className="text-emerald-400 leading-relaxed opacity-90 hover:opacity-100 transition-opacity">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="bg-[#0f0f1a] border-white/10 backdrop-blur-2xl shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Создать новый проект</DialogTitle>
            <DialogDescription className="text-slate-400">
              Введите информацию о вашем проекте
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-6">
            <div>
              <label className="text-sm text-slate-300 mb-2 block font-medium">Название</label>
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Мой новый проект"
                className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-2 block font-medium">Описание</label>
              <Textarea
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Краткое описание проекта и его целей..."
                className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 rounded-xl"
                rows={4}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={createProject}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl py-6 shadow-lg shadow-purple-500/25"
                disabled={!newProjectName.trim()}
              >
                <Icon name="Plus" size={20} className="mr-2" />
                Создать проект
              </Button>
              <Button
                onClick={() => setShowNewProjectDialog(false)}
                variant="outline"
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl px-6"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFileEditor} onOpenChange={setShowFileEditor}>
        <DialogContent className="bg-[#0f0f1a] border-white/10 backdrop-blur-2xl shadow-2xl max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white font-mono flex items-center gap-2">
              <Icon name="FileCode" size={20} className="text-purple-400" />
              {selectedFile?.path}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Редактирование файла проекта
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              value={selectedFile?.content || ''}
              onChange={(e) => updateFileContent(e.target.value)}
              className="bg-black/40 border-white/10 text-white font-mono text-sm rounded-xl leading-relaxed"
              rows={24}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SystemTest;