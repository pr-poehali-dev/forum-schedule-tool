import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Event, getDurationColor } from '../types';

interface ViewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  handleEventSelect: (event: Event) => void;
  isEventSelected: (eventId: string) => boolean;
}

const ViewEventDialog = ({
  open,
  onOpenChange,
  event,
  handleEventSelect,
  isEventSelected
}: ViewEventDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Icon name="Calendar" size={28} className="text-primary" />
            {event?.title}
          </DialogTitle>
        </DialogHeader>
        {event && (
          <div className="space-y-4 pt-4">
            <div className={`p-4 rounded-lg ${getDurationColor(event.duration).bg} ${getDurationColor(event.duration).border} border-2`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={20} className={getDurationColor(event.duration).text} />
                  <span className={`font-semibold ${getDurationColor(event.duration).text}`}>
                    Длительность: {event.duration} минут
                  </span>
                </div>
                <Badge className={`${getDurationColor(event.duration).badge} text-white`}>
                  {event.duration > 0 && event.duration < 60 ? '🟢 Оптимально' : 
                   event.duration >= 60 && event.duration < 90 ? '🟡 Средне' : '🔴 Длительно'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground dark:text-black mb-1 flex items-center gap-2">
                    <Icon name="FileText" size={18} className="dark:text-black" />
                    Описание
                  </h4>
                  <p className="text-foreground/80 dark:text-black leading-relaxed">{event.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground dark:text-black mb-1 flex items-center gap-2">
                    <Icon name="MapPin" size={16} className="dark:text-black" />
                    Место проведения
                  </h4>
                  <p className="text-foreground/80 dark:text-black">{event.location}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground dark:text-black mb-1 flex items-center gap-2">
                    <Icon name="Folder" size={18} className="dark:text-black" />
                    Категория
                  </h4>
                  <Badge variant="outline" className="text-primary border-primary/30 dark:text-black dark:border-black/30 dark:bg-white">
                    {event.category}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Закрыть
              </Button>
              <Button
                onClick={() => {
                  handleEventSelect(event);
                  onOpenChange(false);
                }}
                className="bg-primary hover:bg-primary/90"
              >
                {isEventSelected(event.id) ? 'Убрать из расписания' : 'Добавить в расписание'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewEventDialog;
