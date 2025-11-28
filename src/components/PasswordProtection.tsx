import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import marketupLogo from '@/assets/marketup-logo.png';

interface PasswordProtectionProps {
  onSuccess: () => void;
}

const CORRECT_PASSWORD = 'ifeelgreat';

export const PasswordProtection = ({ onSuccess }: PasswordProtectionProps) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.trim().toLowerCase() === CORRECT_PASSWORD) {
      localStorage.setItem('fotbalek-auth', 'true');
      toast.success('Vítejte! 🎉');
      onSuccess();
    } else {
      toast.error('Nesprávné heslo');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-secondary p-4">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <img src={marketupLogo} alt="Marketup" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary mb-2">Vánoční Fotbálek</h1>
          <p className="text-muted-foreground">
            Zadejte heslo pro přístup do aplikace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Heslo
            </Label>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Zadejte heslo..."
              className="mt-1"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Wifi className="w-4 h-4 text-accent" />
            <span>Tip: heslo na wifi</span>
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90" size="lg">
            <Lock className="w-4 h-4 mr-2" />
            Vstoupit
          </Button>
        </form>
      </Card>
    </div>
  );
};
