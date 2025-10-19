import Icon from '@/components/ui/icon';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Icon name="Sparkles" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">AIBuilder</span>
            </div>
            <p className="text-gray-400 text-sm">
              Создавайте профессиональные сайты с помощью искусственного интеллекта
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Продукт</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-white transition">Возможности</a></li>
              <li><a href="#templates" className="hover:text-white transition">Шаблоны</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Цены</a></li>
              <li><a href="#" className="hover:text-white transition">Обновления</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Компания</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">О нас</a></li>
              <li><a href="#" className="hover:text-white transition">Блог</a></li>
              <li><a href="#" className="hover:text-white transition">Карьера</a></li>
              <li><a href="#" className="hover:text-white transition">Контакты</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Поддержка</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Документация</a></li>
              <li><a href="#" className="hover:text-white transition">Справка</a></li>
              <li><a href="#" className="hover:text-white transition">Статус</a></li>
              <li><a href="#" className="hover:text-white transition">API</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2024 AIBuilder. Все права защищены.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Icon name="Github" size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Icon name="Twitter" size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <Icon name="Linkedin" size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
