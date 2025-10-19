import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function Header() {
  const navigate = useNavigate();
  
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Icon name="Sparkles" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AIBuilder
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition">
              Возможности
            </a>
            <a href="#templates" className="text-sm font-medium hover:text-primary transition">
              Шаблоны
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition">
              Тарифы
            </a>
            <Button variant="outline" size="sm" onClick={() => navigate('/game')}>
              <Icon name="Gamepad2" size={16} className="mr-2" />
              Игра
            </Button>
            <Button variant="outline" size="sm">
              Войти
            </Button>
            <Button size="sm">
              Начать бесплатно
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
