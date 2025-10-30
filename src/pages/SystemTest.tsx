import { useState } from 'react';
import Icon from '@/components/ui/icon';

function SystemTest() {
  const [projects, setProjects] = useState<Array<{id: string, name: string, status: string}>>([
    { id: '1', name: 'Проект 1', status: 'active' },
    { id: '2', name: 'Проект 2', status: 'active' },
  ]);
  const [logs, setLogs] = useState<string[]>(['Система готова к работе']);
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFileOperations = async () => {
    addLog('Тест: Чтение/запись файлов...');
    try {
      const response = await fetch('/api/files/test', { method: 'POST' });
      const result = await response.json();
      setTestResults(prev => ({ ...prev, files: response.ok }));
      addLog(response.ok ? '✅ Файловые операции работают' : '❌ Ошибка файловых операций');
    } catch (error) {
      setTestResults(prev => ({ ...prev, files: false }));
      addLog('❌ Ошибка соединения с API файлов');
    }
  };

  const testDatabase = async () => {
    addLog('Тест: Подключение к БД...');
    try {
      const response = await fetch('/api/db/test');
      const result = await response.json();
      setTestResults(prev => ({ ...prev, database: response.ok }));
      addLog(response.ok ? '✅ База данных подключена' : '❌ Ошибка БД');
    } catch (error) {
      setTestResults(prev => ({ ...prev, database: false }));
      addLog('❌ Ошибка соединения с БД');
    }
  };

  const testAI = async () => {
    addLog('Тест: AI генерация кода...');
    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'создай простой компонент кнопки' })
      });
      const result = await response.json();
      setTestResults(prev => ({ ...prev, ai: response.ok }));
      addLog(response.ok ? '✅ AI работает' : '❌ Ошибка AI');
    } catch (error) {
      setTestResults(prev => ({ ...prev, ai: false }));
      addLog('❌ Ошибка соединения с AI');
    }
  };

  const testGithub = async () => {
    addLog('Тест: GitHub интеграция...');
    try {
      const response = await fetch('/api/github/test');
      const result = await response.json();
      setTestResults(prev => ({ ...prev, github: response.ok }));
      addLog(response.ok ? '✅ GitHub подключен' : '❌ Ошибка GitHub');
    } catch (error) {
      setTestResults(prev => ({ ...prev, github: false }));
      addLog('❌ Ошибка соединения с GitHub');
    }
  };

  const runAllTests = () => {
    setLogs(['Запуск всех тестов...']);
    setTestResults({});
    testFileOperations();
    setTimeout(() => testDatabase(), 500);
    setTimeout(() => testAI(), 1000);
    setTimeout(() => testGithub(), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Icon name="Rocket" size={40} />
            Панель управления проектами
          </h1>
          <p className="text-purple-200">Тестирование системы разработки через AI</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Icon name="FolderGit2" size={24} />
              Проекты
            </h2>
            <div className="space-y-2">
              {projects.map(project => (
                <div key={project.id} className="bg-white/5 rounded p-3 flex items-center justify-between">
                  <span className="text-white">{project.name}</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const newProject = {
                  id: String(projects.length + 1),
                  name: `Проект ${projects.length + 1}`,
                  status: 'active'
                };
                setProjects([...projects, newProject]);
                addLog(`Создан новый проект: ${newProject.name}`);
              }}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded flex items-center justify-center gap-2"
            >
              <Icon name="Plus" size={20} />
              Создать проект
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Icon name="TestTube" size={24} />
              Тесты системы
            </h2>
            <div className="space-y-2 mb-4">
              {[
                { key: 'files', label: 'Файловые операции', test: testFileOperations },
                { key: 'database', label: 'База данных', test: testDatabase },
                { key: 'ai', label: 'AI генерация', test: testAI },
                { key: 'github', label: 'GitHub интеграция', test: testGithub },
              ].map(({ key, label, test }) => (
                <div key={key} className="flex items-center justify-between bg-white/5 rounded p-3">
                  <span className="text-white">{label}</span>
                  <div className="flex items-center gap-2">
                    {testResults[key] === true && <Icon name="CheckCircle" size={20} className="text-green-400" />}
                    {testResults[key] === false && <Icon name="XCircle" size={20} className="text-red-400" />}
                    <button
                      onClick={test}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                    >
                      Тест
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={runAllTests}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center gap-2"
            >
              <Icon name="Play" size={20} />
              Запустить все тесты
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="Terminal" size={24} />
            Логи системы
          </h2>
          <div className="bg-black/30 rounded p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.map((log, i) => (
              <div key={i} className="text-green-400 mb-1">{log}</div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <h3 className="text-yellow-300 font-semibold mb-2 flex items-center gap-2">
            <Icon name="Info" size={20} />
            Информация о развертывании
          </h3>
          <p className="text-yellow-200 text-sm">
            Эта страница тестирует основные компоненты системы. 
            Для полноценной работы нужно настроить backend API и подключить необходимые сервисы.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SystemTest;
