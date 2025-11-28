import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Calendar, Trophy } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TournamentCountdown = () => {
  const targetDate = new Date('2024-12-18T18:00:00');
  
  const calculateTimeLeft = (): TimeLeft => {
    const difference = targetDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isFinished = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <Card className="p-8 bg-gradient-to-br from-accent/20 via-primary/10 to-accent/10 border-accent/30 backdrop-blur-sm">
      <div className="text-center space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-10 h-10 text-accent animate-pulse" />
          <h2 className="text-3xl font-bold text-primary">
            {isFinished ? 'Turnaj začíná!' : 'Odpočet do začátku turnaje'}
          </h2>
          <Trophy className="w-10 h-10 text-accent animate-pulse" />
        </div>

        {/* Date Info */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Calendar className="w-5 h-5" />
          <span className="text-lg font-medium">18. prosince 2024 v 18:00</span>
        </div>

        {/* Countdown Display */}
        {!isFinished && (
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { value: timeLeft.days, label: 'Dní' },
              { value: timeLeft.hours, label: 'Hodin' },
              { value: timeLeft.minutes, label: 'Minut' },
              { value: timeLeft.seconds, label: 'Sekund' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-primary/10 rounded-xl p-6 border-2 border-primary/20 shadow-lg">
                  <div className="text-5xl font-bold text-accent tabular-nums">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2 font-medium uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clock Icon for finished state */}
        {isFinished && (
          <div className="py-8">
            <Clock className="w-24 h-24 mx-auto text-accent animate-bounce" />
          </div>
        )}

        {/* Footer Message */}
        <div className="pt-4">
          <p className="text-lg text-muted-foreground">
            {isFinished 
              ? '🎉 Je čas začít turnaj! Vytvořte nový turnaj pro zahájení zápasů.' 
              : '⚽ Připravte se na nejlepší fotbálkový turnaj roku!'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TournamentCountdown;
