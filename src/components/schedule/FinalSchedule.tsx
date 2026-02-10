import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ScheduleItem, getDurationColor, addMinutes } from './types';
import html2canvas from 'html2canvas';

interface FinalScheduleProps {
  schedule: ScheduleItem[];
  exportToExcel: () => void;
  exportToJPG: () => Promise<void>;
  exportToPDF: () => Promise<void>;
  setStep: (step: 'selection' | 'editing' | 'final') => void;
  setSelectedEvents: (events: Record<string, Event[]>) => void;
  setSchedule: (schedule: ScheduleItem[]) => void;
}

const FinalSchedule = ({
  schedule,
  exportToExcel,
  exportToJPG,
  exportToPDF,
  setStep,
  setSelectedEvents,
  setSchedule
}: FinalScheduleProps) => {
  const scheduleRef = useRef<HTMLDivElement>(null);

  return (
    <div className="animate-fade-in">
      <Card className="bg-card shadow-2xl" data-schedule-export>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://cdn.poehali.dev/files/Рисунок алабуга.png" 
                alt="Алабуга логотип" 
                className="w-16 h-auto"
              />
              <div>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Icon name="CalendarCheck" size={32} className="text-primary" />
                  Финальное расписание
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Готовое расписание форума программы АС
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2" data-no-export>
              <Button onClick={exportToPDF} className="gap-2 bg-red-600 hover:bg-red-700">PDF</Button>
              <Button onClick={exportToExcel} className="gap-2 bg-green-600 hover:bg-green-700">
                <Icon name="FileSpreadsheet" size={18} />
                Excel
              </Button>
              <Button onClick={exportToJPG} className="gap-2 bg-primary hover:bg-primary/90">
                <Icon name="Image" size={18} />
                JPG
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedule.map((item) => {
              const endTime = addMinutes(item.startTime, item.event.duration);
              const isCustomItem = item.type !== 'event';
              const isMeal = item.type === 'meal';
              
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-xl border-l-4 transition-all hover:shadow-md ${
                    item.type === 'event'
                      ? `${getDurationColor(item.event.duration).bg} ${getDurationColor(item.event.duration).border.replace('border-', 'border-l-')}`
                      : item.type === 'meal'
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-l-emerald-500 dark:border-l-emerald-400 border-l-8 ring-2 ring-emerald-500/20 dark:ring-emerald-400/20'
                      : item.type === 'break'
                      ? 'bg-purple-500/10 dark:bg-purple-500/20 border-l-purple-400 dark:border-l-purple-300 border-l-4'
                      : 'bg-primary/10 border-l-primary border-l-8'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {isCustomItem && (
                      <div className={`${isMeal ? 'text-5xl' : 'text-4xl'}`}>
                        {item.type === 'meal' ? '🍽️' : item.type === 'break' ? '⏸️' : '🚌'}
                      </div>
                    )}
                    <div className="flex flex-col items-center bg-card rounded-lg px-3 py-2 shadow-sm border dark:bg-slate-700 dark:border-slate-600">
                      <span className="text-sm font-bold text-primary dark:text-blue-400">{item.startTime}</span>
                      <span className="text-xs text-muted-foreground dark:text-slate-400">—</span>
                      <span className="text-sm font-bold text-primary dark:text-blue-400">{endTime}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-lg ${isMeal ? 'text-2xl text-emerald-600 dark:text-emerald-400' : isCustomItem ? 'text-xl dark:text-white' : 'dark:text-white'}`}>
                          {item.customTitle || item.event.title}
                        </h3>
                        {isCustomItem && (
                          <Badge className={
                            item.type === 'meal' 
                              ? 'bg-emerald-600 text-white text-sm' 
                              : item.type === 'break' 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-primary text-primary-foreground'
                          }>
                            {item.type === 'meal' ? '🍴 Прием пищи' : item.type === 'break' ? '⏸️ Дополнительный элемент' : '🚌 Трансфер'}
                          </Badge>
                        )}
                      </div>
                      {item.event.category && (
                        <p className="text-sm text-primary font-medium mt-1 dark:text-blue-400">
                          [{item.event.category}]
                        </p>
                      )}
                      {item.event.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1 dark:text-slate-300">
                          <Icon name="MapPin" size={16} />
                          {item.event.location}
                        </p>
                      )}
                    </div>
                    <Badge className={`${item.type === 'event' ? getDurationColor(item.event.duration).badge : 'bg-muted text-foreground'} text-white`} data-no-export>
                      {item.event.duration} мин
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between gap-4 pt-8 border-t mt-8" data-no-export>
            <Button
              variant="outline"
              onClick={() => setStep('editing')}
              className="gap-2"
            >
              <Icon name="ArrowLeft" size={18} />
              Редактировать
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedEvents({});
                setSchedule([]);
                setStep('selection');
              }}
            >
              Начать заново
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalSchedule;