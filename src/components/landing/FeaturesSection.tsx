import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const features = [
  {
    icon: 'Bot',
    title: 'ИИ-генерация',
    description: 'Передовой искусственный интеллект создаёт уникальный дизайн под ваши требования'
  },
  {
    icon: 'Zap',
    title: 'Мгновенный результат',
    description: 'От идеи до готового сайта — всего за 2-3 минуты. Без программирования'
  },
  {
    icon: 'Palette',
    title: 'Профессиональный дизайн',
    description: 'Современные адаптивные макеты, которые отлично выглядят на всех устройствах'
  },
  {
    icon: 'Code',
    title: 'Чистый код',
    description: 'Оптимизированный React-код, готовый к публикации и дальнейшей доработке'
  },
  {
    icon: 'Layers',
    title: 'Готовые блоки',
    description: 'Библиотека из 50+ готовых секций: герои, портфолио, контакты, цены'
  },
  {
    icon: 'Globe',
    title: 'Публикация в один клик',
    description: 'Разместите сайт в интернете за секунды. Бесплатный хостинг включён'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4">Возможности</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Всё, что нужно для создания сайта
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            От идеи до публикации — всё в одном месте
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                <Icon name={feature.icon as any} size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
