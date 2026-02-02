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
  networkingDialog: boolean;
  setNetworkingDialog: (open: boolean) => void;
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
  networkingDialog,
  setNetworkingDialog,
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
            <DialogDescription>Укажите название и длительность элемента</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="custom-title">
                Описание
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="custom-title"
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                placeholder="Дополнительный трансфер; Перерыв и т. д."
                required
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
            <Button 
              onClick={addCustomItem} 
              className="w-full"
              disabled={!addTitle.trim()}
            >
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={viewEventDialog} onOpenChange={setViewEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <Icon name="Calendar" size={28} className="text-primary" />
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
                    {viewingEvent.duration > 0 && viewingEvent.duration < 60 ? '🟢 Оптимально' : 
                     viewingEvent.duration >= 60 && viewingEvent.duration < 90 ? '🟡 Средне' : '🔴 Длительно'}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      <Icon name="FileText" size={18} />
                      Описание
                    </h4>
                    <p className="text-foreground/80 leading-relaxed">{viewingEvent.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      <Icon name="MapPin" size={16} />
                      Место проведения
                    </h4>
                    <p className="text-foreground/80">{viewingEvent.location}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      <Icon name="Folder" size={18} />
                      Категория
                    </h4>
                    <Badge variant="outline" className="text-primary border-primary/30">
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
                  className="bg-primary hover:bg-primary/90"
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
              <Icon name="Save" size={24} className="text-primary" />
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
                className="bg-primary hover:bg-primary/90"
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
              <Icon name="FolderOpen" size={28} className="text-primary" />
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
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
                <p>У вас пока нет сохраненных расписаний</p>
                <p className="text-sm mt-2">Создайте первое расписание и сохраните его</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Сохраненные расписания:</h3>
                {savedSchedules.map(schedule => {
                  const totalEvents = Object.values(schedule.selectedEvents).flat().length;
                  const totalDuration = schedule.schedule.reduce((acc, item) => acc + item.event.duration, 0);
                  
                  return (
                    <Card
                      key={schedule.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        currentScheduleId === schedule.id ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{schedule.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                      <Icon name="MapPin" size={16} />
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

      <Dialog open={networkingDialog} onOpenChange={(open) => {
        if (!open) {
          const hasNetworkingGames = (selectedEvents['Развлекательные мероприятия'] || []).some(e => e.id.startsWith('4c') && e.id.length > 2);
          if (!hasNetworkingGames) {
            setSelectedEvents(prev => {
              const categoryEvents = prev['Развлекательные мероприятия'] || [];
              return {
                ...prev,
                ['Развлекательные мероприятия']: categoryEvents.filter(e => e.id !== '4c')
              };
            });
          }
        }
        setNetworkingDialog(open);
      }}>
        <DialogContent className="max-w-3xl" onInteractOutside={(e) => {
          const hasNetworkingGames = (selectedEvents['Развлекательные мероприятия'] || []).some(e => e.id.startsWith('4c') && e.id.length > 2);
          if (!hasNetworkingGames) {
            e.preventDefault();
          }
        }}>
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="Users" size={28} className="text-cyan-600" />
              Выберите игру для нетворкинга
            </DialogTitle>
            <DialogDescription>
              Выберите хотя бы одну игру или вернитесь к выбору другого мероприятия
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 pt-4">
            {mockEvents.filter(e => e.id.startsWith('4c') && e.id.length > 2).map(event => {
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
                      <Icon name="MapPin" size={16} />
                      <span>{event.location}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              {(selectedEvents['Развлекательные мероприятия'] || []).filter(e => e.id.startsWith('4c') && e.id.length > 2).length === 0 && (
                <span className="text-amber-600 font-medium">⚠️ Выберите хотя бы одну игру</span>
              )}
            </div>
            <Button 
              onClick={() => {
                const hasNetworkingGames = (selectedEvents['Развлекательные мероприятия'] || []).some(e => e.id.startsWith('4c') && e.id.length > 2);
                if (hasNetworkingGames) {
                  setNetworkingDialog(false);
                }
              }}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              disabled={(selectedEvents['Развлекательные мероприятия'] || []).filter(e => e.id.startsWith('4c') && e.id.length > 2).length === 0}
            >
              Готово
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={masterClassDialog} onOpenChange={setMasterClassDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="GraduationCap" size={28} className="text-cyan-600" />
              Выберите мастер-классы по направлениям
            </DialogTitle>
            <DialogDescription>
              Для каждого направления вы можете выбрать базовый или роскошный вариант (там где доступно)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            {[
              { name: 'Кейтеринг', prefix: '3b1' },
              { name: 'Сервис и гостеприимство', prefix: '3b2' },
              { name: 'Оператор композитного производства', prefix: '3b3' },
              { name: 'Автотранспортный цех', prefix: '3b4' },
              { name: 'Логистика', prefix: '3b5' },
              { name: 'Монтажные + отделочные работы', prefix: '3b6' }
            ].map(direction => {
              const directionEvents = mockEvents.filter(e => e.id.startsWith(direction.prefix));
              
              return (
                <div key={direction.prefix} className="space-y-3">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                    {direction.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {directionEvents.map(event => {
                      const selected = isEventSelected(event.id);
                      const colorScheme = getDurationColor(event.duration);
                      const isPremium = event.tier === 'premium';
                      
                      return (
                        <Card
                          key={event.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selected ? 'ring-2 ring-cyan-500 bg-cyan-50' : ''
                          } ${
                            isPremium 
                              ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-2 border-amber-300 dark:border-amber-700' 
                              : 'bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600'
                          }`}
                          onClick={() => handleEventSelect(event)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <CardTitle className={`text-base ${isPremium ? 'text-white' : 'text-black dark:text-white'}`}>
                                  {event.title}
                                </CardTitle>
                                {isPremium && (
                                  <Badge className="mt-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                                    <Icon name="Sparkles" size={12} className="mr-1" />
                                    Роскошный
                                  </Badge>
                                )}
                              </div>
                              <Badge className={`${colorScheme.badge} text-white shrink-0`}>
                                {event.duration} мин
                              </Badge>
                            </div>
                            <CardDescription className={`text-sm ${isPremium ? 'text-white/90' : 'text-black dark:text-white/90'}`}>
                              {event.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className={`flex items-center gap-2 text-sm ${isPremium ? 'text-white/80' : 'text-black dark:text-white/80'}`}>
                              <Icon name="MapPin" size={16} />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              Выбрано мастер-классов: <span className="font-bold text-cyan-600">
                {(selectedEvents['Знакомство с программой АС'] || []).filter(e => e.id.startsWith('3b')).length}
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setMasterClassDialog(false)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700"
            >
              Готово
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScheduleDialogs;