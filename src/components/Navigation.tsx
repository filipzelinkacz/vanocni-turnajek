import { NavLink } from '@/components/NavLink';
import { Home, ListChecks, Settings, History, Users } from 'lucide-react';
import marketupLogo from '@/assets/marketup-logo.png';

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b-2 border-primary/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 items-center justify-between">
        <img src={marketupLogo} alt="Marketup" className="w-10 h-10" />
        
        <div className="flex gap-2 items-center">
          <NavLink
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors hover:bg-primary/10"
            activeClassName="bg-primary text-primary-foreground"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </NavLink>
          
          <NavLink
            to="/scores"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors hover:bg-primary/10"
            activeClassName="bg-primary text-primary-foreground"
          >
            <ListChecks className="w-5 h-5" />
            <span className="font-medium">Skóre</span>
          </NavLink>
          
          <NavLink
            to="/generate-teams"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors hover:bg-primary/10"
            activeClassName="bg-primary text-primary-foreground"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Generovat týmy</span>
          </NavLink>
          
          <NavLink
            to="/history"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors hover:bg-primary/10"
            activeClassName="bg-primary text-primary-foreground"
          >
            <History className="w-5 h-5" />
            <span className="font-medium">Historie</span>
          </NavLink>
          
          <NavLink
            to="/setup"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors hover:bg-primary/10"
            activeClassName="bg-primary text-primary-foreground"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Nastavení</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
