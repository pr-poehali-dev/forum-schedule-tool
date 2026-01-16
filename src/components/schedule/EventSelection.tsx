import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Event, mockEvents, categories, getDurationColor } from './types';
import TimeCalculator from './TimeCalculator';

interface EventSelectionProps {
  selectedEvents: Record<string, Event[]>;
  durationFilter: 'all' | 'short' | 'medium' | 'long';
  setDurationFilter: (filter: 'all' | 'short' | 'medium' | 'long') => void;
  handleEventSelect: (event: Event) => void;
  handleEventRemoveOne: (event: Event) => void;
  isEventSelected: (eventId: string) => boolean;
  handleViewEvent: (event: Event) => void;
  setMasterClassDialog: (open: boolean) => void;
  canGenerateSchedule: boolean;
  generateInitialSchedule: () => void;
}

const EventSelection = ({
  selectedEvents,
  durationFilter,
  setDurationFilter,
  handleEventSelect,
  handleEventRemoveOne,
  isEventSelected,
  handleViewEvent,
  setMasterClassDialog,
  canGenerateSchedule,
  generateInitialSchedule
}: EventSelectionProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <TimeCalculator selectedEvents={selectedEvents} />
      
      <Card className="shadow-lg dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-foreground">
            <Icon name="Filter" size={24} className="text-primary" />
            Фильтр по длительности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={durationFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setDurationFilter('all')}
              className={durationFilter === 'all' ? 'bg-primary hover:bg-primary/90' : 'dark:hover:bg-slate-800 hover:bg-slate-100'}
            >
              <Icon name="List" size={18} className="mr-2" />
              Все мероприятия
              <Badge className="ml-2 bg-muted text-foreground">
                {mockEvents.filter(e => !e.id.startsWith('3b') && !(e.id.startsWith('2b') && e.id.length > 2) && !(e.id.startsWith('4c') && e.id.length > 2)).length}
              </Badge>
            </Button>
            <Button
              variant={durationFilter === 'short' ? 'default' : 'outline'}
              onClick={() => setDurationFilter('short')}
              className={durationFilter === 'short' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-500 text-green-600 hover:bg-green-50 dark:border-green-500/50 dark:text-green-400 dark:hover:bg-green-950/30'}
            >
              🟢 Короткие (0-59 мин)
              <Badge className={durationFilter === 'short' ? 'ml-2 bg-white text-green-700' : 'ml-2 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'}>
                {mockEvents.filter(e => e.duration > 0 && e.duration < 60 && !e.id.startsWith('3b') && !(e.id.startsWith('2b') && e.id.length > 2) && !(e.id.startsWith('4c') && e.id.length > 2)).length}
              </Badge>
            </Button>
            <Button
              variant={durationFilter === 'medium' ? 'default' : 'outline'}
              onClick={() => setDurationFilter('medium')}
              className={durationFilter === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-500/50 dark:text-yellow-400 dark:hover:bg-yellow-950/30'}
            >
              🟡 Средние (60-89 мин)
              <Badge className={durationFilter === 'medium' ? 'ml-2 bg-white text-yellow-700' : 'ml-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'}>
                {mockEvents.filter(e => e.duration >= 60 && e.duration < 90 && !e.id.startsWith('3b') && !(e.id.startsWith('2b') && e.id.length > 2) && !(e.id.startsWith('4c') && e.id.length > 2)).length}
              </Badge>
            </Button>
            <Button
              variant={durationFilter === 'long' ? 'default' : 'outline'}
              onClick={() => setDurationFilter('long')}
              className={durationFilter === 'long' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-500 text-red-600 hover:bg-red-50 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-950/30'}
            >
              🔴 Длинные (90+ мин)
              <Badge className={durationFilter === 'long' ? 'ml-2 bg-white text-red-700' : 'ml-2 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'}>
                {mockEvents.filter(e => e.duration >= 90 && !e.id.startsWith('3b') && !(e.id.startsWith('2b') && e.id.length > 2) && !(e.id.startsWith('4c') && e.id.length > 2)).length}
              </Badge>
            </Button>
          </div>
        </CardContent>
      </Card>
      {categories.map((category) => (
        <div key={category} className="bg-card rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-foreground">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            {category}
            {selectedEvents[category] && selectedEvents[category].length > 0 && (
              <Badge className="ml-2 bg-green-500">
                <Icon name="Check" size={16} className="mr-1" />
                {category === 'Знакомство с программой АС' 
                  ? `Выбрано: ${selectedEvents[category].length}`
                  : 'Выбрано'}
              </Badge>
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockEvents
              .filter(event => {
                if (event.category === category) {
                  if (category === 'Знакомство с программой АС' && event.id.startsWith('3b')) {
                    return false;
                  }
                  if (category === 'Открывающие мероприятия' && event.id.length > 2 && event.id.startsWith('2b')) {
                    return false;
                  }
                  if (category === 'Развлекательные мероприятия' && event.id.length > 2 && event.id.startsWith('4c')) {
                    return false;
                  }
                  if (category === 'Дополнительно') {
                    return false;
                  }
                  
                  if (durationFilter === 'short' && event.duration >= 60) return false;
                  if (durationFilter === 'medium' && (event.duration < 60 || event.duration >= 90)) return false;
                  if (durationFilter === 'long' && event.duration < 90) return false;
                  
                  return true;
                }
                return false;
              })
              .map(event => {
                const selected = isEventSelected(event.id);
                const colorScheme = getDurationColor(event.duration);
                const is2aBlocked = event.id === '2a' && (selectedEvents['Открывающие мероприятия'] || []).some(e => e.id === '2b');
                
                return (
                  <Card
                    key={event.id}
                    className={`transition-all hover:-translate-y-1 relative ${
                      is2aBlocked 
                        ? 'opacity-50 cursor-not-allowed bg-muted' 
                        : selected 
                          ? 'ring-2 ring-primary bg-muted/50 cursor-pointer hover:shadow-md' 
                          : 'hover:bg-muted/30 cursor-pointer hover:shadow-md'
                    }`}
                  >
                    {is2aBlocked && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-red-500 text-white">
                          <Icon name="X" size={16} className="mr-1" />
                          Недоступно
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="pb-3" onClick={() => !is2aBlocked && handleEventSelect(event)}>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className={`text-base leading-tight ${is2aBlocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {event.title}
                        </CardTitle>
                        <Badge className={`${colorScheme.badge} text-white shrink-0 ${is2aBlocked ? 'opacity-50' : ''}`}>
                          {event.duration} мин
                        </Badge>
                      </div>
                      <CardDescription className={`text-sm line-clamp-2 ${is2aBlocked ? 'text-muted-foreground' : 'text-slate-600 dark:text-slate-300'}`}>
                        {event.description}
                      </CardDescription>
                      {is2aBlocked && (
                        <p className="text-xs text-red-600 mt-2">
                          ⚠️ Уже выбрано "Открытие с интерактивом"
                        </p>
                      )}
                      {event.id === '4d' && !is2aBlocked && (
                        <div className="mt-2">
                          <Badge className="bg-blue-600 text-white text-[10px] px-1.5 py-0">
                            Для участниц из РФ
                          </Badge>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className={`flex items-center gap-2 text-sm ${is2aBlocked ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                          <Icon name="MapPin" size={16} className="shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewEvent(event);
                          }}
                          className={`h-8 ${is2aBlocked ? 'text-muted-foreground' : 'text-primary hover:text-primary/80'}`}
                          disabled={is2aBlocked}
                        >
                          <Icon name="Info" size={16} className="shrink-0" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            {category === 'Знакомство с программой АС' && (
              <Card
                className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 bg-muted border-2 border-border"
                onClick={() => setMasterClassDialog(true)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Icon name="GraduationCap" size={28} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">Мастер-классы по направлениям</CardTitle>
                      <CardDescription>6 направлений: Кейтеринг, Сервис, Композитное производство, Автотранспорт, Логистика, Отделочные работы</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {(selectedEvents[category] || []).filter(e => e.id.startsWith('3b')).length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-green-500 text-white">
                        <Icon name="Check" size={16} className="mr-1" />
                        Выбрано: {(selectedEvents[category] || []).filter(e => e.id.startsWith('3b')).length}
                      </Badge>
                      {(selectedEvents[category] || []).filter(e => e.tier === 'premium').length > 0 && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                          <Icon name="Sparkles" size={16} className="mr-1" />
                          Роскошных: {(selectedEvents[category] || []).filter(e => e.tier === 'premium').length}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Нажмите, чтобы выбрать</p>
                  )}
                </CardContent>
              </Card>
            )}
            {category === 'Дополнительно' && (
              <div className="col-span-full space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 pb-2 border-b-2 border-border">
                    <Icon name="Utensils" size={22} className="text-primary" />
                    Приемы пищи
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockEvents
                      .filter(e => e.category === category && e.id.startsWith('meal_'))
                      .map(event => {
                        const colorScheme = getDurationColor(event.duration);
                        const selected = isEventSelected(event.id);
                        
                        return (
                          <Card
                            key={event.id}
                            onClick={() => handleEventSelect(event)}
                            className={`cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${
                              selected 
                                ? 'ring-2 ring-primary bg-muted/50' 
                                : 'hover:bg-muted/30'
                            }`}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-base leading-tight">{event.title}</CardTitle>
                                <Badge className={`${colorScheme.badge} text-white shrink-0`}>
                                  {event.duration} мин
                                </Badge>
                              </div>
                              <CardDescription className="text-sm">Общее время проведения: 30-40 минут</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Icon name="MapPin" size={16} className="shrink-0" />
                                  <span className="line-clamp-1">{event.location}</span>
                                </div>
                                {selected && (
                                  <Badge className="bg-green-500 text-white">
                                    <Icon name="Check" size={16} className="mr-1" />
                                    Выбрано
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 pb-2 border-b-2 border-border">
                    <Icon name="Bus" size={22} className="text-primary" />
                    Трансфер
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockEvents
                      .filter(e => e.category === category && e.id.startsWith('transfer_'))
                      .map(event => {
                        const colorScheme = getDurationColor(event.duration);
                        const count = (selectedEvents[category] || []).filter(e => e.id === event.id).length;
                        
                        return (
                          <Card
                            key={event.id}
                            className="transition-all hover:shadow-md"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-base leading-tight">{event.title}</CardTitle>
                                <Badge className={`${colorScheme.badge} text-white shrink-0`}>
                                  {event.duration} мин
                                </Badge>
                              </div>
                              <CardDescription className="text-sm">
                                Общее время переезда: 15 минут
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Icon name="MapPin" size={16} className="shrink-0" />
                                  <span className="line-clamp-1">{event.location}</span>
                                </div>
                                {count > 0 && (
                                  <Badge className="bg-green-500 text-white">
                                    <Icon name="Check" size={16} className="mr-1" />
                                    {count}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {count > 0 && (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEventRemoveOne(event);
                                    }}
                                    size="sm"
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                  >
                                    <Icon name="Minus" size={16} />
                                  </Button>
                                )}
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventSelect(event);
                                  }}
                                  size="sm"
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                                >
                                  <Icon name="Plus" size={16} />
                                  Добавить трансфер
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {canGenerateSchedule && (
        <div className="flex justify-center pt-6 animate-scale-in">
          <Button
            size="lg"
            onClick={generateInitialSchedule}
            className="gap-2 bg-primary hover:bg-primary/90 text-lg px-8 py-6"
          >
            Создать расписание
            <Icon name="ArrowRight" size={22} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventSelection;