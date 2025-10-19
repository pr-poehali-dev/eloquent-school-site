import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import funcUrls from '../../backend/func2url.json';

interface WebsiteData {
  title: string;
  description: string;
  sections: Array<{
    type: string;
    title: string;
    content: string;
    items?: string[];
  }>;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export default function Index() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState<WebsiteData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch(funcUrls['generate-site'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка генерации сайта');
      }
      
      setGeneratedWebsite(data.website);
      toast({
        title: '✅ Сайт создан!',
        description: `"${data.website.title}" готов к просмотру`,
      });
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось создать сайт',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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

      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Icon name="Zap" size={14} className="mr-1" />
            Создано с помощью ИИ
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Создавайте сайты <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              силой мысли
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Опишите свою идею — ИИ создаст профессиональный сайт за минуты. 
            Без кода, без дизайнера, без головной боли.
          </p>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Icon 
                  name="Sparkles" 
                  size={20} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="Например: Создай сайт для кофейни с меню и онлайн-заказом..."
                  className="pl-12 h-14 text-base"
                />
              </div>
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                size="lg"
                className="h-14 px-8"
              >
                {isGenerating ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Создаю...
                  </>
                ) : (
                  <>
                    Создать сайт
                    <Icon name="ArrowRight" size={20} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3 text-left">
              💡 Попробуйте: "Лендинг для фитнес-клуба", "Портфолио фотографа", "Магазин handmade украшений"
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-green-600" />
              Без кредитной карты
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-green-600" />
              Готово за 2 минуты
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-green-600" />
              Бесплатный тариф навсегда
            </div>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-20"></div>
          {generatedWebsite ? (
            <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{generatedWebsite.title}</h2>
                  <p className="text-muted-foreground">{generatedWebsite.description}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setGeneratedWebsite(null)}
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Закрыть
                </Button>
              </div>
              
              <div className="space-y-6">
                {generatedWebsite.sections.map((section, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{section.type}</Badge>
                        <h3 className="text-xl font-bold">{section.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">{section.content}</p>
                      {section.items && section.items.length > 0 && (
                        <ul className="list-disc list-inside space-y-1">
                          {section.items.map((item, i) => (
                            <li key={i} className="text-sm">{item}</li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold mb-2">Цветовая схема:</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: generatedWebsite.colorScheme.primary }}
                    />
                    <span className="text-sm">Primary: {generatedWebsite.colorScheme.primary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: generatedWebsite.colorScheme.secondary }}
                    />
                    <span className="text-sm">Secondary: {generatedWebsite.colorScheme.secondary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: generatedWebsite.colorScheme.background }}
                    />
                    <span className="text-sm">Background: {generatedWebsite.colorScheme.background}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
              <img
                src="https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/70e2bf45-fe31-4622-b86d-55a206427bd7.jpg"
                alt="AI Website Builder Interface"
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      </section>

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
            {[
              {
                icon: 'Brain',
                title: 'Умный ИИ-ассистент',
                description: 'Понимает ваши идеи и создаёт уникальный дизайн с учётом специфики бизнеса'
              },
              {
                icon: 'Wand2',
                title: 'Автоматический дизайн',
                description: 'Современные шаблоны, адаптивная вёрстка и профессиональная типографика'
              },
              {
                icon: 'Smartphone',
                title: 'Адаптивность',
                description: 'Идеально выглядит на любых устройствах — от смартфона до 4K монитора'
              },
              {
                icon: 'Zap',
                title: 'Мгновенные правки',
                description: 'Попросите изменить цвета, текст или структуру — ИИ исправит за секунды'
              },
              {
                icon: 'Globe',
                title: 'Публикация в 1 клик',
                description: 'Готовый сайт сразу уходит в интернет с бесплатным доменом и хостингом'
              },
              {
                icon: 'ShieldCheck',
                title: 'Безопасность',
                description: 'SSL-сертификаты, защита от DDoS и регулярные бэкапы включены'
              }
            ].map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                    <Icon name={feature.icon as any} size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Как это работает?
            </h2>
            <p className="text-xl opacity-90 mb-16">
              Три простых шага до готового сайта
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  icon: 'MessageSquare',
                  title: 'Опишите идею',
                  description: 'Расскажите, какой сайт вам нужен — для бизнеса, портфолио или блога'
                },
                {
                  step: '02',
                  icon: 'Sparkles',
                  title: 'ИИ создаёт сайт',
                  description: 'Искусственный интеллект генерирует дизайн, контент и структуру'
                },
                {
                  step: '03',
                  icon: 'Rocket',
                  title: 'Публикуйте',
                  description: 'Один клик — и сайт в интернете. Правки тоже делаются мгновенно'
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-6xl font-bold opacity-20 mb-4">{step.step}</div>
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto">
                    <Icon name={step.icon as any} size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="opacity-90">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="templates" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Примеры работ</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Созданные ИИ за минуты
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Реальные сайты, созданные нашими пользователями
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <img
              src="https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/684dd590-8509-4091-a50c-b958768950bd.jpg"
              alt="Website Examples"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { type: 'Интернет-магазин', time: '2 мин', icon: 'ShoppingBag' },
              { type: 'Лендинг', time: '1 мин', icon: 'Layout' },
              { type: 'Портфолио', time: '2 мин', icon: 'Briefcase' },
              { type: 'Блог', time: '1 мин', icon: 'BookOpen' },
              { type: 'Корпоративный сайт', time: '3 мин', icon: 'Building2' },
              { type: 'Личный бренд', time: '2 мин', icon: 'User' }
            ].map((example, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon name={example.icon as any} size={24} className="text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      <Icon name="Clock" size={12} className="mr-1" />
                      {example.time}
                    </Badge>
                  </div>
                  <h3 className="font-semibold group-hover:text-primary transition">
                    {example.type}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Тарифы</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Начните бесплатно
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Выберите тариф под свои задачи
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Старт',
                price: '0',
                period: 'навсегда',
                features: [
                  '1 сайт',
                  'Базовые шаблоны',
                  'Поддомен .aibuilder.app',
                  'SSL-сертификат',
                  'Техподдержка'
                ],
                cta: 'Начать бесплатно',
                popular: false
              },
              {
                name: 'Про',
                price: '990',
                period: 'в месяц',
                features: [
                  'До 10 сайтов',
                  'Все шаблоны',
                  'Свой домен',
                  'Приоритетная поддержка',
                  'Экспорт кода',
                  'Аналитика'
                ],
                cta: 'Попробовать 14 дней',
                popular: true
              },
              {
                name: 'Бизнес',
                price: '2990',
                period: 'в месяц',
                features: [
                  'Безлимит сайтов',
                  'Белая метка',
                  'API доступ',
                  'Персональный менеджер',
                  'SLA 99.9%',
                  'Кастомные интеграции'
                ],
                cta: 'Связаться с нами',
                popular: false
              }
            ].map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-primary border-2 shadow-xl scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Популярный
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.price !== '0' && <span className="text-muted-foreground"> ₽</span>}
                    <div className="text-sm text-muted-foreground mt-1">{plan.period}</div>
                  </div>
                  <Button 
                    className={`w-full mb-6 ${plan.popular ? '' : 'variant-outline'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Icon name="Check" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">FAQ</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Частые вопросы
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'Нужны ли знания программирования?',
                  a: 'Абсолютно нет! Просто опишите, что вам нужно, остальное сделает ИИ.'
                },
                {
                  q: 'Сколько времени занимает создание сайта?',
                  a: 'В среднем 1-3 минуты от идеи до готового сайта в интернете.'
                },
                {
                  q: 'Можно ли экспортировать код?',
                  a: 'Да, на тарифе Про и выше доступен экспорт чистого кода для самостоятельного хостинга.'
                },
                {
                  q: 'Какие сайты можно создавать?',
                  a: 'Любые: лендинги, интернет-магазины, портфолио, блоги, корпоративные сайты и многое другое.'
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-2 flex items-start gap-2">
                      <Icon name="HelpCircle" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground ml-7">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Готовы создать свой сайт?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Присоединяйтесь к 10,000+ пользователям, которые уже создают сайты с ИИ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg h-14 px-8">
                Начать бесплатно
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-transparent text-white border-white hover:bg-white/10">
                <Icon name="Play" size={20} className="mr-2" />
                Посмотреть демо
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Icon name="Sparkles" size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold text-white">AIBuilder</span>
              </div>
              <p className="text-sm">
                Создавайте профессиональные сайты с помощью искусственного интеллекта
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Возможности</a></li>
                <li><a href="#" className="hover:text-white transition">Шаблоны</a></li>
                <li><a href="#" className="hover:text-white transition">Тарифы</a></li>
                <li><a href="#" className="hover:text-white transition">Примеры</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Компания</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">О нас</a></li>
                <li><a href="#" className="hover:text-white transition">Блог</a></li>
                <li><a href="#" className="hover:text-white transition">Карьера</a></li>
                <li><a href="#" className="hover:text-white transition">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Документация</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Помощь</a></li>
                <li><a href="#" className="hover:text-white transition">Статус</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2024 AIBuilder. Все права защищены.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">
                <Icon name="Github" size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Icon name="Twitter" size={20} />
              </a>
              <a href="#" className="hover:text-white transition">
                <Icon name="Linkedin" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}