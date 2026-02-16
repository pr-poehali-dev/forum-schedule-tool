import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Event, getDurationColor } from '../types';

interface SelectionDialogsProps {
  interactiveDialog: boolean;
  setInteractiveDialog: (open: boolean) => void;
  networkingDialog: boolean;
  setNetworkingDialog: (open: boolean) => void;
  masterClassDialog: boolean;
  setMasterClassDialog: (open: boolean) => void;
  selectedEvents: Record<string, Event[]>;
  setSelectedEvents: (events: Record<string, Event[]> | ((prev: Record<string, Event[]>) => Record<string, Event[]>)) => void;
  mockEvents: Event[];
}

const SelectionDialogs = ({
  interactiveDialog,
  setInteractiveDialog,
  networkingDialog,
  setNetworkingDialog,
  masterClassDialog,
  setMasterClassDialog,
  selectedEvents,
  setSelectedEvents,
  mockEvents
}: SelectionDialogsProps) => {
  const handleInteractiveSelect = (eventId: string) => {
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) return;

    setSelectedEvents((prev: Record<string, Event[]>) => {
      const category = event.category;
      const categoryEvents = prev[category] || [];
      const isSelected = categoryEvents.some(e => e.id === event.id);

      if (isSelected) {
        return {
          ...prev,
          [category]: categoryEvents.filter(e => e.id !== event.id)
        };
      } else {
        return {
          ...prev,
          [category]: [...categoryEvents, event]
        };
      }
    });
  };

  const isInteractiveSelected = (eventId: string) => {
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) return false;
    return (selectedEvents[event.category] || []).some(e => e.id === eventId);
  };

  const interactiveEvents = mockEvents.filter(e => e.id.startsWith('2b'));
  const networkingEvents = mockEvents.filter(e => e.id.startsWith('4c'));
  const masterClassEvents = mockEvents.filter(e => e.id.includes('3b'));

  return (
    <>
      <Dialog open={interactiveDialog} onOpenChange={setInteractiveDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="Sparkles" size={28} className="text-primary" />
              Выбор интерактивов для открытия
            </DialogTitle>
            <DialogDescription>
              Выберите от 1 до 3 интерактивов, которые будут проводиться после открытия форума
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {interactiveEvents.map((event) => {
              const selected = isInteractiveSelected(event.id);
              const colorScheme = getDurationColor(event.duration);
              
              return (
                <Card
                  key={event.id}
                  className={`cursor-pointer transition-all hover:-translate-y-1 ${
                    selected 
                      ? 'ring-2 ring-primary bg-muted/50 hover:shadow-md' 
                      : 'hover:bg-muted/30 hover:shadow-md'
                  }`}
                  onClick={() => handleInteractiveSelect(event.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-tight">{event.title}</CardTitle>
                      <Badge className={`${colorScheme.badge} text-white shrink-0`}>
                        {event.duration} мин
                      </Badge>
                    </div>
                    <CardDescription className="text-sm line-clamp-3">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setInteractiveDialog(false)}>
              Готово
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={networkingDialog} onOpenChange={setNetworkingDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="Users" size={28} className="text-primary" />
              Выбор игры для нетворкинга
            </DialogTitle>
            <DialogDescription>
              Выберите одну игру, которая будет проводиться для знакомства участниц
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {networkingEvents.map((event) => {
              const selected = isInteractiveSelected(event.id);
              const colorScheme = getDurationColor(event.duration);
              
              return (
                <Card
                  key={event.id}
                  className={`cursor-pointer transition-all hover:-translate-y-1 ${
                    selected 
                      ? 'ring-2 ring-primary bg-muted/50 hover:shadow-md' 
                      : 'hover:bg-muted/30 hover:shadow-md'
                  }`}
                  onClick={() => handleInteractiveSelect(event.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-tight">{event.title}</CardTitle>
                      <Badge className={`${colorScheme.badge} text-white shrink-0`}>
                        {event.duration} мин
                      </Badge>
                    </div>
                    <CardDescription className="text-sm line-clamp-3">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setNetworkingDialog(false)}>
              Готово
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={masterClassDialog} onOpenChange={setMasterClassDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="GraduationCap" size={28} className="text-primary" />
              Выбор мастер-классов
            </DialogTitle>
            <DialogDescription>
              Выберите желаемые мастер-классы по направлениям программы АС. Можно выбрать базовую или роскошную версию каждого направления.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {masterClassEvents.map((event) => {
              const selected = isInteractiveSelected(event.id);
              const colorScheme = getDurationColor(event.duration);
              const isPremium = event.tier === 'premium';
              
              return (
                <Card
                  key={event.id}
                  className={`cursor-pointer transition-all hover:-translate-y-1 ${
                    selected 
                      ? 'ring-2 ring-primary bg-muted/50 hover:shadow-md' 
                      : 'hover:bg-muted/30 hover:shadow-md'
                  }`}
                  onClick={() => handleInteractiveSelect(event.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-tight">{event.title}</CardTitle>
                      <div className="flex flex-col gap-1 items-end shrink-0">
                        <Badge className={`${colorScheme.badge} text-white`}>
                          {event.duration} мин
                        </Badge>
                        {isPremium && (
                          <Badge className="bg-amber-500 text-white">
                            Роскошный
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-sm line-clamp-3">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setMasterClassDialog(false)}>
              Готово
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SelectionDialogs;