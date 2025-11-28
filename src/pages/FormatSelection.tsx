import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TournamentFormat } from '@/types/tournament';
import { ArrowRight } from 'lucide-react';
import marketupLogo from '@/assets/marketup-logo.png';

const FormatSelection = () => {
  const navigate = useNavigate();
  const [format, setFormat] = useState<TournamentFormat>('round-robin');

  const handleNext = () => {
    sessionStorage.setItem('tournamentFormat', format);
    navigate('/generate-teams');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-winter via-background to-winter/50 p-6 pt-24 relative overflow-hidden">
      {/* Mountain background with blue filter */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920')] bg-cover bg-center opacity-20" 
           style={{ filter: 'sepia(100%) hue-rotate(190deg) saturate(150%)' }} />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg border-4 border-background relative overflow-hidden">
            <img src={marketupLogo} alt="Marketup" className="w-10 h-10 object-contain" />
            {/* Soccer ball pattern */}
            <div className="absolute inset-0 opacity-10" 
                 style={{
                   background: `repeating-conic-gradient(from 0deg, transparent 0deg 60deg, hsl(var(--primary-foreground)) 60deg 120deg)`
                 }} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-primary">Vytvořit turnaj</h1>
            <p className="text-muted-foreground">Krok 1: Vyberte formát turnaje</p>
          </div>
        </div>

        <Card className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="format" className="text-lg">Formát turnaje</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as TournamentFormat)}>
              <SelectTrigger id="format" className="text-lg h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round-robin">Každý s každým</SelectItem>
                <SelectItem value="two-groups">Dvě skupiny (A/B)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button onClick={handleNext} size="lg" className="w-full bg-accent hover:bg-accent/90">
              <ArrowRight className="w-5 h-5 mr-2" />
              Pokračovat k výběru hráčů
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FormatSelection;
