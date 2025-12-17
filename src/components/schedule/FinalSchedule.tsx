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
  setStep: (step: 'selection' | 'editing' | 'final') => void;
  setSelectedEvents: (events: Record<string, any[]>) => void;
  setSchedule: (schedule: ScheduleItem[]) => void;
}

const FinalSchedule = ({
  schedule,
  exportToExcel,
  exportToJPG,
  setStep,
  setSelectedEvents,
  setSchedule
}: FinalScheduleProps) => {
  const scheduleRef = useRef<HTMLDivElement>(null);

  return (
    <div className="animate-fade-in">
      <Card className="bg-white shadow-2xl" data-schedule-export>
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
                  <Icon name="CalendarCheck" size={32} className="text-cyan-600" />
                  Финальное расписание
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Готовое расписание форума программы АС
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2" data-no-export>
              <Button onClick={exportToJPG} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Icon name="Image" size={18} />
                Скачать JPG
              </Button>
              <Button onClick={exportToExcel} className="gap-2 bg-green-600 hover:bg-green-700">
                <Icon name="Download" size={18} />
                Скачать Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedule.map((item) => {
              const endTime = addMinutes(item.startTime, item.event.duration);
              
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-xl border-l-4 transition-all hover:shadow-md ${
                    item.type === 'event'
                      ? `${getDurationColor(item.event.duration).bg} ${getDurationColor(item.event.duration).border.replace('border-', 'border-l-')}`
                      : item.type === 'meal'
                      ? 'bg-emerald-50 border-l-emerald-500'
                      : item.type === 'break'
                      ? 'bg-amber-50 border-l-amber-500'
                      : 'bg-gray-50 border-l-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center bg-white rounded-lg px-3 py-2 shadow-sm">
                      <span className="text-sm font-bold text-cyan-600">{item.startTime}</span>
                      <span className="text-xs text-gray-400">—</span>
                      <span className="text-sm font-bold text-blue-600">{endTime}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">
                        {item.customTitle || item.event.title}
                      </h3>
                      {item.event.category && (
                        <p className="text-sm text-cyan-600 font-medium mt-1">
                          [{item.event.category}]
                        </p>
                      )}
                      {item.event.location && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Icon name="MapPin" size={14} />
                          {item.event.location}
                        </p>
                      )}
                    </div>
                    <Badge className={`${item.type === 'event' ? getDurationColor(item.event.duration).badge : 'bg-gray-400'} text-white`}>
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