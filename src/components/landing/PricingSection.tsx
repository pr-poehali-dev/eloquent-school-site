import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const plans = [
  {
    name: 'Бесплатный',
    price: '0',
    description: 'Для тестирования и личных проектов',
    features: [
      '3 сайта',
      'Базовые шаблоны',
      'Хостинг на поддомене',
      'Поддержка сообщества'
    ],
    popular: false
  },
  {
    name: 'Про',
    price: '990',
    description: 'Для фрилансеров и малого бизнеса',
    features: [
      'Неограниченно сайтов',
      'Все премиум-шаблоны',
      'Свой домен',
      'Приоритетная поддержка',
      'Удаление брендинга',
      'SEO-оптимизация'
    ],
    popular: true
  },
  {
    name: 'Бизнес',
    price: '2990',
    description: 'Для агентств и крупных проектов',
    features: [
      'Всё из тарифа Про',
      'Командная работа (5 человек)',
      'API доступ',
      'Белая метка',
      'Персональный менеджер',
      'SLA 99.9%'
    ],
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4">Тарифы</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Прозрачные цены без скрытых платежей
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Начните бесплатно. Растите вместе с нами.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`p-8 relative ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">
                  Популярный
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> ₽/мес</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${plan.popular ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.price === '0' ? 'Начать бесплатно' : 'Выбрать тариф'}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
