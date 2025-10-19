import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'courses', 'teachers', 'testimonials', 'gallery', 'faq', 'contacts'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const courses = [
    {
      title: 'Базовый курс',
      duration: '2 месяца',
      lessons: '16 занятий',
      description: 'Основы публичных выступлений, работа со страхом сцены, постановка голоса',
      price: '25 000 ₽'
    },
    {
      title: 'Продвинутый курс',
      duration: '3 месяца',
      lessons: '24 занятия',
      description: 'Мастерство аргументации, управление аудиторией, продающие презентации',
      price: '42 000 ₽'
    },
    {
      title: 'Индивидуальные занятия',
      duration: 'По запросу',
      lessons: 'От 8 занятий',
      description: 'Персональная программа под ваши цели, гибкий график, быстрый результат',
      price: 'От 5 000 ₽'
    }
  ];

  const teachers = [
    {
      name: 'Александра Волкова',
      position: 'Основатель школы, эксперт по риторике',
      experience: '12 лет опыта',
      image: 'https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/327c5c7e-68d8-4ffb-87d7-9678b2e37c53.jpg'
    },
    {
      name: 'Дмитрий Соколов',
      position: 'Тренер по сценической речи',
      experience: '8 лет опыта',
      image: 'https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/20eb401a-ed5d-46f2-8b09-b3d31e5d8049.jpg'
    },
    {
      name: 'Мария Петрова',
      position: 'Психолог, специалист по невербальной коммуникации',
      experience: '10 лет опыта',
      image: 'https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/cbe87b4b-d758-4f16-86e8-0e0d76bcca9f.jpg'
    }
  ];

  const testimonials = [
    {
      name: 'Елена Смирнова',
      role: 'Руководитель отдела продаж',
      text: 'После курса я полностью преодолела страх публичных выступлений. Теперь провожу презентации с уверенностью!'
    },
    {
      name: 'Михаил Кузнецов',
      role: 'Предприниматель',
      text: 'Навыки, полученные в школе, помогли мне успешно выступить на конференции перед 500 участниками.'
    },
    {
      name: 'Анна Федорова',
      role: 'Менеджер по маркетингу',
      text: 'Индивидуальный подход и профессионализм преподавателей превзошли все мои ожидания!'
    }
  ];

  const galleryImages = [
    'https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/cbe87b4b-d758-4f16-86e8-0e0d76bcca9f.jpg',
    'https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/327c5c7e-68d8-4ffb-87d7-9678b2e37c53.jpg',
    'https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/20eb401a-ed5d-46f2-8b09-b3d31e5d8049.jpg',
    'https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/cbe87b4b-d758-4f16-86e8-0e0d76bcca9f.jpg',
    'https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/327c5c7e-68d8-4ffb-87d7-9678b2e37c53.jpg',
    'https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/20eb401a-ed5d-46f2-8b09-b3d31e5d8049.jpg'
  ];

  const faqs = [
    {
      question: 'Какой формат занятий?',
      answer: 'Занятия проходят в группах до 12 человек в нашей студии в центре Москвы. Есть возможность индивидуальных занятий.'
    },
    {
      question: 'Нужна ли предварительная подготовка?',
      answer: 'Нет, мы принимаем всех желающих независимо от уровня подготовки. Программа адаптируется под каждую группу.'
    },
    {
      question: 'Выдаете ли сертификат?',
      answer: 'Да, по окончании курса все студенты получают именной сертификат о прохождении обучения.'
    },
    {
      question: 'Можно ли посетить пробное занятие?',
      answer: 'Да, первое пробное занятие бесплатно. Это поможет вам познакомиться с преподавателем и форматом обучения.'
    },
    {
      question: 'Какое расписание занятий?',
      answer: 'Группы занимаются 2 раза в неделю по вечерам (будни) или по выходным. Точное расписание согласовывается с группой.'
    }
  ];

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Mic2" className="text-primary" size={28} />
              <span className="text-2xl font-bold text-foreground">Школа Ораторов</span>
            </div>
            <div className="hidden md:flex gap-6">
              {[
                { id: 'home', label: 'Главная' },
                { id: 'courses', label: 'Курсы' },
                { id: 'teachers', label: 'Преподаватели' },
                { id: 'testimonials', label: 'Отзывы' },
                { id: 'gallery', label: 'Галерея' },
                { id: 'faq', label: 'Вопросы' },
                { id: 'contacts', label: 'Контакты' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                Найдите свой голос
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Научитесь уверенно выступать публично, убеждать аудиторию и достигать целей с помощью слова
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="text-base" onClick={() => scrollToSection('courses')}>
                  Выбрать курс
                </Button>
                <Button size="lg" variant="outline" className="text-base" onClick={() => scrollToSection('contacts')}>
                  Записаться
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Выпускников</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">12</div>
                  <div className="text-sm text-muted-foreground">Лет опыта</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Довольных</div>
                </div>
              </div>
            </div>
            <div className="animate-slide-up">
              <img
                src="https://cdn.poehali.dev/projects/b7f7b2d5-b36c-4ecd-924a-51eec76a70ee/files/327c5c7e-68d8-4ffb-87d7-9678b2e37c53.jpg"
                alt="Выступление"
                className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4">Наши курсы</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Программы для любого уровня подготовки — от новичков до опытных спикеров
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary/50">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <Icon name="Award" className="text-primary mb-4" size={48} />
                    <h3 className="text-2xl font-bold text-foreground mb-4">{course.title}</h3>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="Clock" size={18} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="BookOpen" size={18} />
                      <span>{course.lessons}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {course.description}
                  </p>
                  <div className="border-t pt-6">
                    <div className="text-3xl font-bold text-primary mb-4">{course.price}</div>
                    <Button className="w-full" onClick={() => scrollToSection('contacts')}>
                      Записаться
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="teachers" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4">Наши преподаватели</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Команда профессионалов с богатым опытом в ораторском искусстве
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{teacher.name}</h3>
                  <p className="text-muted-foreground mb-3">{teacher.position}</p>
                  <div className="flex items-center gap-2 text-primary">
                    <Icon name="Star" size={18} />
                    <span className="font-medium">{teacher.experience}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4">Отзывы выпускников</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Истории успеха наших студентов
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <Icon name="Quote" className="text-primary mb-4" size={40} />
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t pt-4">
                    <div className="font-bold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4">Галерея</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Атмосфера наших занятий
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-xl">
                <img
                  src={image}
                  alt={`Галерея ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4">Частые вопросы</h2>
            <p className="text-lg text-muted-foreground">
              Ответы на популярные вопросы о наших курсах
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg px-6 border-2">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="contacts" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4">Контакты</h2>
            <p className="text-lg text-muted-foreground">
              Запишитесь на бесплатное пробное занятие
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Отправить заявку</h3>
                  <form className="space-y-4">
                    <div>
                      <Input placeholder="Ваше имя" className="text-base" />
                    </div>
                    <div>
                      <Input type="tel" placeholder="Телефон" className="text-base" />
                    </div>
                    <div>
                      <Input type="email" placeholder="Email" className="text-base" />
                    </div>
                    <div>
                      <Textarea placeholder="Сообщение (необязательно)" rows={4} />
                    </div>
                    <Button className="w-full text-base" size="lg">
                      Отправить заявку
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Icon name="MapPin" className="text-primary mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Адрес</h4>
                      <p className="text-muted-foreground">Москва, ул. Тверская, д. 15, офис 301</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Icon name="Phone" className="text-primary mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Телефон</h4>
                      <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Icon name="Mail" className="text-primary mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Email</h4>
                      <p className="text-muted-foreground">info@oratory-school.ru</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Icon name="Clock" className="text-primary mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Режим работы</h4>
                      <p className="text-muted-foreground">Пн-Пт: 10:00 - 21:00<br />Сб-Вс: 11:00 - 19:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Mic2" className="text-primary" size={32} />
            <span className="text-2xl font-bold">Школа Ораторов</span>
          </div>
          <p className="text-background/70 mb-6">
            Раскройте свой потенциал с лучшей школой ораторского мастерства в Москве
          </p>
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="text-background/70 hover:text-primary transition-colors">
              <Icon name="Facebook" size={24} />
            </a>
            <a href="#" className="text-background/70 hover:text-primary transition-colors">
              <Icon name="Instagram" size={24} />
            </a>
            <a href="#" className="text-background/70 hover:text-primary transition-colors">
              <Icon name="Youtube" size={24} />
            </a>
          </div>
          <p className="text-sm text-background/50">
            © 2024 Школа Ораторов. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}