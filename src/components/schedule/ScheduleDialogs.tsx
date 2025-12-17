import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Event, SavedSchedule, getDurationColor } from './types';

interface ScheduleDialogsProps {
  addDialog: boolean;
  setAddDialog: (open: boolean) => void;
  addType: 'break' | 'meal' | 'transfer';
  setAddType: (type: 'break' | 'meal' | 'transfer') => void;
  addDuration: number;
  setAddDuration: (duration: number) => void;
  addTitle: string;
  setAddTitle: (title: string) => void;
  addCustomItem: () => void;
  
  viewEventDialog: boolean;
  setViewEventDialog: (open: boolean) => void;
  viewingEvent: Event | null;
  handleEventSelect: (event: Event) => void;
  isEventSelected: (eventId: string) => boolean;
  
  saveDialog: boolean;
  setSaveDialog: (open: boolean) => void;
  scheduleName: string;
  setScheduleName: (name: string) => void;
  saveCurrentSchedule: () => void;
  currentScheduleId: string | null;
  
  manageDialog: boolean;
  setManageDialog: (open: boolean) => void;
  savedSchedules: SavedSchedule[];
  createNewSchedule: () => void;
  loadSchedule: (id: string) => void;
  deleteSchedule: (id: string) => void;
  
  interactiveDialog: boolean;
  setInteractiveDialog: (open: boolean) => void;
  selectedEvents: Record<string, Event[]>;
  setSelectedEvents: (events: Record<string, Event[]> | ((prev: Record<string, Event[]>) => Record<string, Event[]>)) => void;
  mockEvents: Event[];
  
  masterClassDialog: boolean;
  setMasterClassDialog: (open: boolean) => void;
}

const ScheduleDialogs = ({
  addDialog,
  setAddDialog,
  addType,
  setAddType,
  addDuration,
  setAddDuration,
  addTitle,
  setAddTitle,
  addCustomItem,
  
  viewEventDialog,
  setViewEventDialog,
  viewingEvent,
  handleEventSelect,
  isEventSelected,
  
  saveDialog,
  setSaveDialog,
  scheduleName,
  setScheduleName,
  saveCurrentSchedule,
  currentScheduleId,
  
  manageDialog,
  setManageDialog,
  savedSchedules,
  createNewSchedule,
  loadSchedule,
  deleteSchedule,
  
  interactiveDialog,
  setInteractiveDialog,
  selectedEvents,
  setSelectedEvents,
  mockEvents,
  
  masterClassDialog,
  setMasterClassDialog
}: ScheduleDialogsProps) => {
  return (
    <>
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить элемент в расписание</DialogTitle>
            <DialogDescription>Выберите тип и укажите параметры</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Тип элемента</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={addType === 'break' ? 'default' : 'outline'}
                  onClick={() => setAddType('break')}
                >
                  Перерыв
                </Button>
                <Button
                  variant={addType === 'meal' ? 'default' : 'outline'}
                  onClick={() => setAddType('meal')}
                >
                  Прием пищи
                </Button>
                <Button
                  variant={addType === 'transfer' ? 'default' : 'outline'}
                  onClick={() => setAddType('transfer')}
                >
                  Трансфер
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-title">Название (опционально)</Label>
              <Input
                id="custom-title"
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                placeholder="Например: Обед, Кофе-брейк"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Длительность (минут)</Label>
              <Input
                id="duration"
                type="number"
                value={addDuration}
                onChange={(e) => setAddDuration(Number(e.target.value))}
                min="5"
              />
            </div>
            <Button onClick={addCustomItem} className="w-full">
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={viewEventDialog} onOpenChange={setViewEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <Icon name="Calendar" size={28} className="text-cyan-600" />
              {viewingEvent?.title}
            </DialogTitle>
          </DialogHeader>
          {viewingEvent && (
            <div className="space-y-4 pt-4">
              <div className={`p-4 rounded-lg ${getDurationColor(viewingEvent.duration).bg} ${getDurationColor(viewingEvent.duration).border} border-2`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={20} className={getDurationColor(viewingEvent.duration).text} />
                    <span className={`font-semibold ${getDurationColor(viewingEvent.duration).text}`}>
                      Длительность: {viewingEvent.duration} минут
                    </span>
                  </div>
                  <Badge className={`${getDurationColor(viewingEvent.duration).badge} text-white`}>
                    {viewingEvent.duration > 0 && viewingEvent.duration <= 60 ? '🟢 Оптимально' : 
                     viewingEvent.duration > 60 && viewingEvent.duration <= 90 ? '🟡 Средне' : '🔴 Длительно'}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                      <Icon name="FileText" size={18} />
                      Описание
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{viewingEvent.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                      <Icon name="MapPin" size={18} />
                      Место проведения
                    </h4>
                    <p className="text-gray-600">{viewingEvent.location}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                      <Icon name="Folder" size={18} />
                      Категория
                    </h4>
                    <Badge variant="outline" className="text-cyan-600 border-cyan-300">
                      {viewingEvent.category}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setViewEventDialog(false)}
                >
                  Закрыть
                </Button>
                <Button
                  onClick={() => {
                    handleEventSelect(viewingEvent);
                    setViewEventDialog(false);
                  }}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                >
                  {isEventSelected(viewingEvent.id) ? 'Убрать из расписания' : 'Добавить в расписание'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={saveDialog} onOpenChange={setSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Save" size={24} className="text-cyan-600" />
              {currentScheduleId ? 'Обновить расписание' : 'Сохранить расписание'}
            </DialogTitle>
            <DialogDescription>
              Дайте название вашему расписанию для удобного поиска
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-name">Название расписания</Label>
              <Input
                id="schedule-name"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
                placeholder="Например: Форум День 1, Вариант А"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSaveDialog(false)}>
                Отмена
              </Button>
              <Button
                onClick={saveCurrentSchedule}
                disabled={!scheduleName.trim()}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              >
                <Icon name="Check" size={18} className="mr-2" />
                {currentScheduleId ? 'Обновить' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={manageDialog} onOpenChange={setManageDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="FolderOpen" size={28} className="text-cyan-600" />
              Управление расписаниями
            </DialogTitle>
            <DialogDescription>
              Загрузите сохраненное расписание или создайте новое
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Button
              onClick={createNewSchedule}
              className="w-full gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              <Icon name="Plus" size={20} />
              Создать новое расписание
            </Button>

            {savedSchedules.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
                <p>У вас пока нет сохраненных расписаний</p>
                <p className="text-sm mt-2">Создайте первое расписание и сохраните его</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Сохраненные расписания:</h3>
                {savedSchedules.map(schedule => {
                  const totalEvents = Object.values(schedule.selectedEvents).flat().length;
                  const totalDuration = schedule.schedule.reduce((acc, item) => acc + item.event.duration, 0);
                  
                  return (
                    <Card
                      key={schedule.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        currentScheduleId === schedule.id ? 'ring-2 ring-cyan-500 bg-cyan-50' : ''
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{schedule.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Icon name="Calendar" size={14} />
                                {totalEvents} мероприятий
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Clock" size={14} />
                                {Math.floor(totalDuration / 60)}ч {totalDuration % 60}м
                              </span>
                              <span className="flex items-center gap-1 text-xs">
                                <Icon name="CalendarClock" size={14} />
                                {new Date(schedule.createdAt).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadSchedule(schedule.id)}
                              className="gap-1"
                            >
                              <Icon name="FolderOpen" size={16} />
                              Открыть
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Удалить расписание "${schedule.name}"?`)) {
                                  deleteSchedule(schedule.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={interactiveDialog} onOpenChange={(open) => {
        if (!open) {
          const hasInteractives = (selectedEvents['Открывающие мероприятия'] || []).some(e => e.id.startsWith('2b') && e.id.length > 2);
          if (!hasInteractives) {
            setSelectedEvents(prev => {
              const newEvents = { ...prev };
              delete newEvents['Открывающие мероприятия'];
              return newEvents;
            });
          }
        }
        setInteractiveDialog(open);
      }}>
        <DialogContent className="max-w-3xl" onInteractOutside={(e) => {
          const hasInteractives = (selectedEvents['Открывающие мероприятия'] || []).some(e => e.id.startsWith('2b') && e.id.length > 2);
          if (!hasInteractives) {
            e.preventDefault();
          }
        }}>
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="Sparkles" size={28} className="text-cyan-600" />
              Выберите интерактив
            </DialogTitle>
            <DialogDescription>
              Выберите хотя бы один интерактив или вернитесь к выбору другого мероприятия
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 pt-4">
            {mockEvents.filter(e => e.id.startsWith('2b') && e.id.length > 2).map(event => {
              const selected = isEventSelected(event.id);
              const colorScheme = getDurationColor(event.duration);
              
              return (
                <Card
                  key={event.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selected ? 'ring-2 ring-cyan-500 bg-cyan-50' : ''
                  }`}
                  onClick={() => handleEventSelect(event)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{event.title}</CardTitle>
                      <Badge className={`${colorScheme.badge} text-white shrink-0`}>
                        {event.duration} мин
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon name="MapPin" size={14} />
                      <span>{event.location}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              {(selectedEvents['Открывающие мероприятия'] || []).filter(e => e.id.startsWith('2b') && e.id.length > 2).length === 0 && (
                <span className="text-amber-600 font-medium">⚠️ Выберите хотя бы один интерактив</span>
              )}
            </div>
            <Button 
              onClick={() => {
                const hasInteractives = (selectedEvents['Открывающие мероприятия'] || []).some(e => e.id.startsWith('2b') && e.id.length > 2);
                if (hasInteractives) {
                  setInteractiveDialog(false);
                }
              }}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              disabled={(selectedEvents['Открывающие мероприятия'] || []).filter(e => e.id.startsWith('2b') && e.id.length > 2).length === 0}
            >
              Готово
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={masterClassDialog} onOpenChange={setMasterClassDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="GraduationCap" size={28} className="text-cyan-600" />
              Выберите мастер-классы
            </DialogTitle>
            <DialogDescription>
              Выберите один или несколько мастер-классов для программы
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
            {mockEvents.filter(e => e.id.startsWith('3b')).map(event => {
              const selected = isEventSelected(event.id);
              const colorScheme = getDurationColor(event.duration);
              
              return (
                <Card
                  key={event.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selected ? 'ring-2 ring-cyan-500 bg-cyan-50' : ''
                  }`}
                  onClick={() => handleEventSelect(event)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{event.title}</CardTitle>
                      <Badge className={`${colorScheme.badge} text-white shrink-0`}>
                        {event.duration} мин
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon name="MapPin" size={14} />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setMasterClassDialog(false)}>
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScheduleDialogs;
