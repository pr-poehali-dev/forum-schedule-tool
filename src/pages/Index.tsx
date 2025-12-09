import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Event {
  id: string;
  title: string;
  description: string;
  duration: number;
  location: string;
  category: string;
}

interface TimeSlot {
  type: 'event' | 'meal' | 'break' | 'transfer';
  title: string;
  startTime: string;
  duration: number;
  location?: string;
}

const mockEvents: Event[] = [
  { id: '1a', title: 'Цифровая трансформация бизнеса', description: 'Новые технологии для роста компаний', duration: 45, location: 'Зал А', category: 'Технологии' },
  { id: '1b', title: 'Искусственный интеллект в производстве', description: 'Применение ИИ в промышленности', duration: 75, location: 'Зал А', category: 'Технологии' },
  { id: '1c', title: 'Блокчейн и будущее финансов', description: 'Как блокчейн меняет финансовый сектор', duration: 60, location: 'Зал А', category: 'Технологии' },
  { id: '1d', title: 'Кибербезопасность в 2025', description: 'Актуальные угрозы и защита данных', duration: 90, location: 'Зал А', category: 'Технологии' },
  { id: '1e', title: 'IoT в умных городах', description: 'Интернет вещей для городской среды', duration: 50, location: 'Зал А', category: 'Технологии' },
  { id: '1f', title: 'Квантовые вычисления сегодня', description: 'Практическое применение квантовых технологий', duration: 120, location: 'Зал А', category: 'Технологии' },

  { id: '2a', title: 'Стратегии роста стартапов', description: 'Как масштабировать бизнес', duration: 55, location: 'Зал Б', category: 'Бизнес' },
  { id: '2b', title: 'Управление командой в кризис', description: 'HR-стратегии в сложные времена', duration: 70, location: 'Зал Б', category: 'Бизнес' },
  { id: '2c', title: 'Венчурное инвестирование', description: 'Как привлечь инвестиции', duration: 85, location: 'Зал Б', category: 'Бизнес' },
  { id: '2d', title: 'Экспорт и международные рынки', description: 'Выход на глобальный уровень', duration: 95, location: 'Зал Б', category: 'Бизнес' },
  { id: '2e', title: 'Финансовое планирование', description: 'Управление бюджетом компании', duration: 40, location: 'Зал Б', category: 'Бизнес' },
  { id: '2f', title: 'Слияния и поглощения', description: 'M&A сделки в современной экономике', duration: 100, location: 'Зал Б', category: 'Бизнес' },

  { id: '3a', title: 'Контент-маркетинг 2025', description: 'Тренды создания контента', duration: 50, location: 'Зал В', category: 'Маркетинг' },
  { id: '3b', title: 'Performance-маркетинг', description: 'Эффективная реклама с измеримыми результатами', duration: 65, location: 'Зал В', category: 'Маркетинг' },
  { id: '3c', title: 'Бренд-стратегии', description: 'Построение сильного бренда', duration: 80, location: 'Зал В', category: 'Маркетинг' },
  { id: '3d', title: 'Influencer Marketing', description: 'Работа с лидерами мнений', duration: 105, location: 'Зал В', category: 'Маркетинг' },
  { id: '3e', title: 'Email-маркетинг', description: 'Эффективные рассылки', duration: 35, location: 'Зал В', category: 'Маркетинг' },
  { id: '3f', title: 'SEO и продвижение', description: 'Оптимизация для поисковых систем', duration: 110, location: 'Зал В', category: 'Маркетинг' },

  { id: '4a', title: 'Устойчивое развитие', description: 'ESG-повестка для бизнеса', duration: 60, location: 'Зал Г', category: 'Инновации' },
  { id: '4b', title: 'Зеленые технологии', description: 'Экологичные решения', duration: 75, location: 'Зал Г', category: 'Инновации' },
  { id: '4c', title: 'Социальное предпринимательство', description: 'Бизнес с социальным эффектом', duration: 85, location: 'Зал Г', category: 'Инновации' },
  { id: '4d', title: 'Циркулярная экономика', description: 'Модели замкнутого цикла', duration: 95, location: 'Зал Г', category: 'Инновации' },
  { id: '4e', title: 'Умное производство', description: 'Индустрия 4.0', duration: 45, location: 'Зал Г', category: 'Инновации' },
  { id: '4f', title: 'Биотехнологии будущего', description: 'Инновации в биологии', duration: 115, location: 'Зал Г', category: 'Инновации' },

  { id: '5a', title: 'Лидерство нового поколения', description: 'Современные подходы к управлению', duration: 55, location: 'Зал Д', category: 'Лидерство' },
  { id: '5b', title: 'Эмоциональный интеллект', description: 'EQ в работе руководителя', duration: 70, location: 'Зал Д', category: 'Лидерство' },
  { id: '5c', title: 'Управление изменениями', description: 'Change management', duration: 80, location: 'Зал Д', category: 'Лидерство' },
  { id: '5d', title: 'Корпоративная культура', description: 'Формирование ценностей компании', duration: 100, location: 'Зал Д', category: 'Лидерство' },
  { id: '5e', title: 'Развитие талантов', description: 'Работа с командой', duration: 40, location: 'Зал Д', category: 'Лидерство' },
  { id: '5f', title: 'Стратегическое мышление', description: 'Планирование на перспективу', duration: 120, location: 'Зал Д', category: 'Лидерство' },
];

const categories = ['Технологии', 'Бизнес', 'Маркетинг', 'Инновации', 'Лидерство'];

const getDurationColor = (duration: number) => {
  if (duration >= 30 && duration <= 60) return 'success';
  if (duration > 60 && duration <= 90) return 'warning';
  return 'alert';
};

const Index = () => {
  const [selectedEvents, setSelectedEvents] = useState<Record<string, Event>>({});
  const [breakTime, setBreakTime] = useState<number>(15);
  const [transferTime, setTransferTime] = useState<number>(10);
  const [breakfastTime, setBreakfastTime] = useState<string>('08:00');
  const [lunchTime, setLunchTime] = useState<string>('12:30');
  const [dinnerTime, setDinnerTime] = useState<string>('18:00');
  const [activeTab, setActiveTab] = useState<string>('selection');

  const handleEventSelect = (event: Event) => {
    setSelectedEvents(prev => ({
      ...prev,
      [event.category]: event
    }));
  };

  const isEventSelected = (eventId: string) => {
    return Object.values(selectedEvents).some(e => e.id === eventId);
  };

  const generateSchedule = () => {
    const schedule: TimeSlot[] = [];
    let currentTime = breakfastTime;

    schedule.push({
      type: 'meal',
      title: 'Завтрак',
      startTime: currentTime,
      duration: 60
    });

    currentTime = addMinutes(currentTime, 60 + transferTime);

    categories.forEach((category, index) => {
      const event = selectedEvents[category];
      if (event) {
        schedule.push({
          type: 'event',
          title: event.title,
          startTime: currentTime,
          duration: event.duration,
          location: event.location
        });

        currentTime = addMinutes(currentTime, event.duration);

        if (currentTime >= lunchTime && !schedule.find(s => s.title === 'Обед')) {
          schedule.push({
            type: 'meal',
            title: 'Обед',
            startTime: lunchTime,
            duration: 90
          });
          currentTime = addMinutes(lunchTime, 90 + transferTime);
        } else {
          if (index < categories.length - 1) {
            schedule.push({
              type: 'break',
              title: 'Перерыв',
              startTime: currentTime,
              duration: breakTime
            });
            currentTime = addMinutes(currentTime, breakTime);

            schedule.push({
              type: 'transfer',
              title: 'Трансфер',
              startTime: currentTime,
              duration: transferTime
            });
            currentTime = addMinutes(currentTime, transferTime);
          }
        }
      }
    });

    schedule.push({
      type: 'meal',
      title: 'Ужин',
      startTime: dinnerTime,
      duration: 90
    });

    return schedule;
  };

  const addMinutes = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
  };

  const canGenerateSchedule = Object.keys(selectedEvents).length === categories.length;

  const exportToPDF = () => {
    alert('Функция экспорта в PDF будет доступна в следующей версии');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Планировщик форума</h1>
          <p className="text-muted-foreground">Составьте идеальное расписание за несколько шагов</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="selection" className="flex items-center gap-2">
              <Icon name="Calendar" size={18} />
              Выбор мероприятий
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2" disabled={!canGenerateSchedule}>
              <Icon name="Settings" size={18} />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2" disabled={!canGenerateSchedule}>
              <Icon name="Clock" size={18} />
              Расписание
            </TabsTrigger>
          </TabsList>

          <TabsContent value="selection" className="space-y-8">
            {categories.map((category) => (
              <div key={category} className="animate-fade-in">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Folder" size={24} className="text-primary" />
                  {category}
                  {selectedEvents[category] && (
                    <Badge variant="default" className="ml-2">
                      <Icon name="Check" size={14} className="mr-1" />
                      Выбрано
                    </Badge>
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockEvents
                    .filter(event => event.category === category)
                    .map(event => {
                      const durationColor = getDurationColor(event.duration);
                      const selected = isEventSelected(event.id);
                      
                      return (
                        <Card
                          key={event.id}
                          className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                            selected ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleEventSelect(event)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                              <Badge
                                variant={durationColor === 'success' ? 'default' : 'secondary'}
                                className={
                                  durationColor === 'success'
                                    ? 'bg-success text-success-foreground'
                                    : durationColor === 'warning'
                                    ? 'bg-warning text-warning-foreground'
                                    : 'bg-alert text-alert-foreground'
                                }
                              >
                                {event.duration} мин
                              </Badge>
                            </div>
                            <CardDescription className="text-sm">{event.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Icon name="MapPin" size={16} />
                              {event.location}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            ))}

            {canGenerateSchedule && (
              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() => setActiveTab('settings')}
                  className="gap-2 animate-scale-in"
                >
                  Перейти к настройкам
                  <Icon name="ArrowRight" size={20} />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Settings" size={24} />
                  Настройки расписания
                </CardTitle>
                <CardDescription>
                  Укажите время приемов пищи, длительность перерывов и трансферов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="breakfast" className="flex items-center gap-2">
                      <Icon name="Coffee" size={16} />
                      Время завтрака
                    </Label>
                    <Input
                      id="breakfast"
                      type="time"
                      value={breakfastTime}
                      onChange={(e) => setBreakfastTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lunch" className="flex items-center gap-2">
                      <Icon name="UtensilsCrossed" size={16} />
                      Время обеда
                    </Label>
                    <Input
                      id="lunch"
                      type="time"
                      value={lunchTime}
                      onChange={(e) => setLunchTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dinner" className="flex items-center gap-2">
                      <Icon name="Moon" size={16} />
                      Время ужина
                    </Label>
                    <Input
                      id="dinner"
                      type="time"
                      value={dinnerTime}
                      onChange={(e) => setDinnerTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="break" className="flex items-center gap-2">
                      <Icon name="Pause" size={16} />
                      Длительность перерывов (минут)
                    </Label>
                    <Input
                      id="break"
                      type="number"
                      min="5"
                      max="30"
                      value={breakTime}
                      onChange={(e) => setBreakTime(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transfer" className="flex items-center gap-2">
                      <Icon name="Bus" size={16} />
                      Время трансфера (минут)
                    </Label>
                    <Input
                      id="transfer"
                      type="number"
                      min="5"
                      max="30"
                      value={transferTime}
                      onChange={(e) => setTransferTime(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setActiveTab('selection')}>
                    <Icon name="ArrowLeft" size={18} className="mr-2" />
                    Назад
                  </Button>
                  <Button onClick={() => setActiveTab('schedule')} className="gap-2">
                    Сформировать расписание
                    <Icon name="Sparkles" size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="animate-fade-in">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="CalendarCheck" size={24} />
                      Финальное расписание
                    </CardTitle>
                    <CardDescription>Ваше персональное расписание форума готово</CardDescription>
                  </div>
                  <Button onClick={exportToPDF} className="gap-2">
                    <Icon name="Download" size={18} />
                    Экспорт
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generateSchedule().map((slot, index) => {
                    const endTime = addMinutes(slot.startTime, slot.duration);
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          slot.type === 'event'
                            ? 'bg-primary/5 border-primary'
                            : slot.type === 'meal'
                            ? 'bg-success/10 border-success'
                            : slot.type === 'break'
                            ? 'bg-warning/10 border-warning'
                            : 'bg-muted border-muted-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-medium">{slot.startTime}</span>
                              <span className="text-xs text-muted-foreground">—</span>
                              <span className="text-sm font-medium">{endTime}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{slot.title}</h3>
                              {slot.location && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Icon name="MapPin" size={14} />
                                  {slot.location}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline">{slot.duration} мин</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between gap-3 pt-6">
                  <Button variant="outline" onClick={() => setActiveTab('settings')}>
                    <Icon name="ArrowLeft" size={18} className="mr-2" />
                    Изменить настройки
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setSelectedEvents({});
                    setActiveTab('selection');
                  }}>
                    Начать заново
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
