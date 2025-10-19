import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const templates = [
  {
    title: 'Бизнес-лендинг',
    description: 'Продающая страница для услуг',
    image: 'https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/70e2bf45-fe31-4622-b86d-55a206427bd7.jpg',
    tags: ['Популярное', 'B2B']
  },
  {
    title: 'Интернет-магазин',
    description: 'Витрина товаров с корзиной',
    image: 'https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/70e2bf45-fe31-4622-b86d-55a206427bd7.jpg',
    tags: ['E-commerce', 'Продажи']
  },
  {
    title: 'Портфолио',
    description: 'Для дизайнеров и креативщиков',
    image: 'https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/70e2bf45-fe31-4622-b86d-55a206427bd7.jpg',
    tags: ['Креатив', 'Галерея']
  }
];

export default function TemplatesSection() {
  return (
    <section id="templates" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4">Шаблоны</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Начните с готового шаблона
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Или опишите свою идею — ИИ создаст уникальный дизайн
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {templates.map((template, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={template.image} 
                  alt={template.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {template.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="bg-white/90">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{template.title}</h3>
                <p className="text-muted-foreground mb-4">{template.description}</p>
                <Button variant="outline" className="w-full">
                  <Icon name="Eye" size={16} className="mr-2" />
                  Посмотреть
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
