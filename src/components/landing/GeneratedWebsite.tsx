import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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

interface GeneratedWebsiteProps {
  website: WebsiteData;
  onClose: () => void;
}

export default function GeneratedWebsite({ website, onClose }: GeneratedWebsiteProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">{website.title}</h2>
          <p className="text-muted-foreground">{website.description}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClose}
        >
          <Icon name="X" size={16} className="mr-2" />
          Закрыть
        </Button>
      </div>
      
      <div className="space-y-6">
        {website.sections.map((section, index) => (
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
              style={{ backgroundColor: website.colorScheme.primary }}
            />
            <span className="text-sm">Primary: {website.colorScheme.primary}</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded border"
              style={{ backgroundColor: website.colorScheme.secondary }}
            />
            <span className="text-sm">Secondary: {website.colorScheme.secondary}</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded border"
              style={{ backgroundColor: website.colorScheme.background }}
            />
            <span className="text-sm">Background: {website.colorScheme.background}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
