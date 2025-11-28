import { Card } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const TournamentChat = () => {
  // This is a placeholder - you would integrate with your chat solution
  const chatUrl = window.location.origin + '/chat';

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <MessageCircle className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-primary">Live Chat</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Naskenujte QR kód pro připojení k turnajovému chatu
      </p>

      <div className="flex justify-center p-6 bg-background rounded-lg">
        <QRCodeSVG value={chatUrl} size={200} />
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        {chatUrl}
      </div>

      <div className="mt-6 p-4 bg-accent/10 rounded-lg">
        <h3 className="font-bold text-primary mb-2">💡 Doporučené řešení pro chat:</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li><strong>Slido/Mentimeter:</strong> Nejjednodušší - embed iframe do aplikace</li>
          <li><strong>Lovable Cloud:</strong> Vlastní real-time chat s Supabase</li>
          <li><strong>Discord/Telegram:</strong> Připojit existující skupinový chat</li>
        </ul>
      </div>
    </Card>
  );
};
