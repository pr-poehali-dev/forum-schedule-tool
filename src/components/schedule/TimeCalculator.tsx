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
    <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl border-0 sticky top-4 z-10">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 rounded-full p-2">
            <Icon name="Clock" size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold">Общее время</h3>
        </div>
        
        <div className="flex items-baseline gap-3">
          {hours > 0 && (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{hours}</span>
              <span className="text-xl opacity-90">{hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}</span>
            </div>
          )}
          {minutes > 0 && (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{minutes}</span>
              <span className="text-xl opacity-90">{minutes === 1 ? 'минута' : minutes < 5 && minutes !== 0 ? 'минуты' : 'минут'}</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex justify-between text-sm opacity-90">
            <span>Мероприятий:</span>
            <span className="font-semibold">{allEvents.length}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TimeCalculator;
