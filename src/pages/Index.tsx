import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import GeneratedWebsite from '@/components/landing/GeneratedWebsite';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TemplatesSection from '@/components/landing/TemplatesSection';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';
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
      <Header />

      <section className="container mx-auto px-4 py-20 md:py-32">
        <HeroSection
          prompt={prompt}
          isGenerating={isGenerating}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
        />

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-20"></div>
          {generatedWebsite ? (
            <GeneratedWebsite
              website={generatedWebsite}
              onClose={() => setGeneratedWebsite(null)}
            />
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

      <FeaturesSection />
      <TemplatesSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
