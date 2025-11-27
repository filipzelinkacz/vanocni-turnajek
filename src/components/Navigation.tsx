import { NavLink } from '@/components/NavLink';
import { Home, ListChecks, Settings } from 'lucide-react';

export const Navigation = () => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-card border-2 border-primary/20 rounded-full shadow-2xl px-6 py-3 flex gap-2">
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
          to="/setup"
          className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors hover:bg-primary/10"
          activeClassName="bg-primary text-primary-foreground"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Nastavení</span>
        </NavLink>
      </div>
    </nav>
  );
};
