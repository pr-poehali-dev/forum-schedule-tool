import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Event } from './types';

interface TimeCalculatorProps {
  selectedEvents: Record<string, Event[]>;
}

const TimeCalculator = ({ selectedEvents }: TimeCalculatorProps) => {
  const allEvents = Object.values(selectedEvents).flat();
  const totalMinutes = allEvents.reduce((sum, event) => sum + event.duration, 0);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (allEvents.length === 0) return null;
  
  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-foreground shadow-2xl border border-slate-700 sticky top-4 z-10">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/20 rounded-full p-2.5 ring-2 ring-primary/30">
            <Icon name="Clock" size={24} className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Общее время</h3>
        </div>
        
        <div className="flex items-baseline gap-4 mb-4">
          {hours > 0 && (
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-bold text-primary">{hours}</span>
              <span className="text-lg text-muted-foreground">{hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}</span>
            </div>
          )}
          {minutes > 0 && (
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-bold text-primary">{minutes}</span>
              <span className="text-lg text-muted-foreground">{minutes === 1 ? 'минута' : minutes < 5 && minutes !== 0 ? 'минуты' : 'минут'}</span>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Мероприятий:</span>
            <span className="text-lg font-bold text-primary">{allEvents.length}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TimeCalculator;