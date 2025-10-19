import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  prompt: string;
  isGenerating: boolean;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
}

export default function HeroSection({ prompt, isGenerating, onPromptChange, onGenerate }: HeroSectionProps) {
  return (
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
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onGenerate()}
              placeholder="Например: Создай сайт для кофейни с меню и онлайн-заказом..."
              className="pl-12 h-14 text-base"
            />
          </div>
          <Button 
            onClick={onGenerate}
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
  );
}
