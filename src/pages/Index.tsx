import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Event {
  id: string;
  title: string;
  description: string;
  duration: number;
  location: string;
  category: string;
}

interface ScheduleItem {
  id: string;
  event: Event;
  startTime: string;
  type: 'event' | 'break' | 'meal' | 'transfer';
  customTitle?: string;
}

const mockEvents: Event[] = [
  { id: '1a', title: 'Обзорная экскурсия по территории ОЭЗ', description: 'Мероприятие для ознакомления участниц с ОЭЗ и ее резидентами. Автобус провозит участниц по маршруту: Синергия 13.2 - Август-Алабуга - Trakya Glass Rus - Хаят Кимия - Кастамону - КНТ-Пласт - Драйлок - Алабуга Политех', duration: 30, location: 'Территория ОЭЗ', category: 'Утренние мероприятия' },
  { id: '1b', title: 'Утренняя зарядка (Йога)', description: 'Утренняя зарядка способствует быстрому пробуждению и хорошему самочувствию в течении всего дня. Включает: 30 мин сбор, 10 мин трансфер, 40 мин зарядка, 10 мин сбор после', duration: 90, location: 'Спортзал Пирамиды', category: 'Утренние мероприятия' },

  { id: '2a', title: 'Открытие (Начальное мероприятие)', description: 'Вступительное мероприятие, на котором участницы знакомятся с организаторами и ведущими, узнают вводную информацию о форуме', duration: 60, location: 'Конференц-зал Курчатов/Яковлев', category: 'Открывающие мероприятия' },
  { id: '2b', title: 'Открытие с интерактивом', description: 'Знакомство с организаторами и друг с другом + интерактив (запуск "До - После", конкурс видеороликов)', duration: 60, location: 'Спортзал "Алабуга Политех"', category: 'Открывающие мероприятия' },

  { id: '3a', title: 'Презентация программы АС', description: 'Участницам полностью рассказывают о программе АС, знакомят с направлениями, карьерным треком, условиями проживания и т.д.', duration: 60, location: 'Конференц-зал Курчатов/Яковлев', category: 'Знакомство с программой АС' },
  { id: '3b1', title: 'МК: Сервис (Бариста, Официант, Шеф-повар)', description: 'Интерактив + кулинарный челлендж. Показать современность профессий сферы гостеприимства', duration: 35, location: 'Спортзал "Алабуга Политех"', category: 'Знакомство с программой АС' },
  { id: '3b2', title: 'МК: Оператор производства композитных материалов', description: 'Hands-on + творческая симуляция. Работа с высокими технологиями', duration: 35, location: 'Спортзал "Алабуга Политех"', category: 'Знакомство с программой АС' },
  { id: '3b3', title: 'МК: Супервайзер и Администратор', description: 'Бизнес-игра + тренажёр лидерства', duration: 35, location: 'Переговорная Курчатов/Яковлев', category: 'Знакомство с программой АС' },
  { id: '3b4', title: 'МК: Девушка за рулём (Водитель)', description: 'Лекция + игровая практика', duration: 35, location: 'Спортзал "Алабуга Политех"', category: 'Знакомство с программой АС' },
  { id: '3b5', title: 'МК: Водитель погрузчика и крановщик', description: 'Симулятор + командный челлендж', duration: 40, location: 'Территория ОЭЗ', category: 'Знакомство с программой АС' },
  { id: '3b6', title: 'МК: Мастер мебели / Штукатур', description: 'DIY-практикум. Монтаж дверей, сборка конструкций, плиточные работы', duration: 35, location: 'Спортзал "Алабуга Политех"', category: 'Знакомство с программой АС' },

  { id: '4a', title: 'Игра "Предпринимательский вызов"', description: 'Развитие навыков работы в команде и предпринимательского мышления. Участницы разрабатывают проект с "секретными ингредиентами" и презентуют его', duration: 110, location: 'Конференц-зал Курчатов/Яковлев', category: 'Развлекательные мероприятия' },
  { id: '4b', title: 'Корп. игра "Бенди"', description: 'Хоккей с мячом - командная игра в формате турнира (включая подведение итогов и награждение)', duration: 150, location: 'Футбольное поле МШ', category: 'Развлекательные мероприятия' },
  { id: '4c', title: 'Мета-Игра "Индустрия"', description: 'Увлекательная мета-игра: постройте промышленный город в команде по 5 человек, взаимодействуйте с другими командами', duration: 85, location: 'Конференц-зал Курчатов/Яковлев', category: 'Развлекательные мероприятия' },
  { id: '4d', title: 'Нетворкинг с действующими участницами АС', description: 'Игры на командообразование и сближение: дебаты, "Крокодил" и другие активности', duration: 40, location: 'Спортзал "Алабуга Политех"', category: 'Развлекательные мероприятия' },

  { id: '5a', title: 'Браталки', description: 'Ритуал обмена теплыми словами с другими участницами и организаторами. Каждая ниточка - чья-то улыбка и важное слово', duration: 40, location: 'Спортзал "Алабуга Политех"', category: 'Завершающие мероприятия' },
  { id: '5b', title: 'Закрытие и награждение', description: 'Завершающая речь, прощание с организаторами, вручение подарков, фотосессия и интервью', duration: 60, location: 'Спортзал "Алабуга Политех"', category: 'Завершающие мероприятия' },

  { id: '6a', title: 'Тимбилдинг, вечерний квест', description: 'Хоррор-квест на развитие навыков работы в команде. Прохождение точек с заданиями по маршрутным листам', duration: 85, location: 'Лес ЖК "Южный Парк"', category: 'Вечерние мероприятия' },
  { id: '6b', title: 'Свечка', description: 'Нормализация эмоционального состояния после дня. Задания от ведущих, общение в спокойной атмосфере', duration: 50, location: 'Спортзал "Алабуга Политех"', category: 'Вечерние мероприятия' },
  { id: '6c', title: 'Красочное завершение дня', description: 'Бенгальские огни и красочный салют', duration: 20, location: 'Территория у хостелов', category: 'Вечерние мероприятия' },

  { id: '7a', title: 'Лекция об истории успеха', description: 'Руководитель делится путем становления, полезными советами и жизненным опытом', duration: 50, location: 'Конференц-зал Курчатов/Яковлев', category: 'Лекции' },
  { id: '7b', title: 'Лекция от действующих участниц АС.Мир', description: 'Действующие участницы рассказывают о своем выборе, первых впечатлениях и опыте работы в "Алабуге"', duration: 50, location: 'Спортзал "Алабуга Политех"', category: 'Лекции' },
];

const categories = [
  'Утренние мероприятия',
  'Открывающие мероприятия',
  'Знакомство с программой АС',
  'Развлекательные мероприятия',
  'Завершающие мероприятия',
  'Вечерние мероприятия',
  'Лекции'
];

const Index = () => {
  const [selectedEvents, setSelectedEvents] = useState<Record<string, Event[]>>({});
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [step, setStep] = useState<'selection' | 'editing' | 'final'>('selection');
  const [addDialog, setAddDialog] = useState(false);
  const [addType, setAddType] = useState<'break' | 'meal' | 'transfer'>('break');
  const [addDuration, setAddDuration] = useState(15);
  const [addTitle, setAddTitle] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleEventSelect = (event: Event) => {
    setSelectedEvents(prev => {
      const categoryEvents = prev[event.category] || [];
      const isSelected = categoryEvents.some(e => e.id === event.id);
      
      if (event.category === 'Знакомство с программой АС' && event.id.startsWith('3b')) {
        if (isSelected) {
          return {
            ...prev,
            [event.category]: categoryEvents.filter(e => e.id !== event.id)
          };
        } else {
          return {
            ...prev,
            [event.category]: [...categoryEvents, event]
          };
        }
      } else {
        return {
          ...prev,
          [event.category]: isSelected ? [] : [event]
        };
      }
    });
  };

  const isEventSelected = (eventId: string) => {
    return Object.values(selectedEvents).flat().some(e => e.id === eventId);
  };

  const generateInitialSchedule = () => {
    const items: ScheduleItem[] = [];
    let currentTime = '09:00';

    categories.forEach(category => {
      const events = selectedEvents[category] || [];
      events.forEach(event => {
        items.push({
          id: `${Date.now()}-${Math.random()}`,
          event,
          startTime: currentTime,
          type: 'event'
        });
        currentTime = addMinutes(currentTime, event.duration);
      });
    });

    setSchedule(items);
    setStep('editing');
  };

  const addMinutes = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
  };

  const updateStartTime = (id: string, newTime: string) => {
    setSchedule(prev => prev.map(item => 
      item.id === id ? { ...item, startTime: newTime } : item
    ));
  };

  const removeItem = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
  };

  const addCustomItem = () => {
    const newItem: ScheduleItem = {
      id: `${Date.now()}-${Math.random()}`,
      event: {
        id: `custom-${Date.now()}`,
        title: addTitle || (addType === 'break' ? 'Перерыв' : addType === 'meal' ? 'Прием пищи' : 'Трансфер'),
        description: '',
        duration: addDuration,
        location: '',
        category: ''
      },
      startTime: '12:00',
      type: addType,
      customTitle: addTitle
    };
    
    setSchedule(prev => [...prev, newItem]);
    setAddDialog(false);
    setAddTitle('');
    setAddDuration(15);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSchedule = [...schedule];
    const draggedItem = newSchedule[draggedIndex];
    newSchedule.splice(draggedIndex, 1);
    newSchedule.splice(index, 0, draggedItem);
    
    setSchedule(newSchedule);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.addFileToVFS('Roboto-Regular.ttf', '');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(147, 51, 234);
    doc.text('Расписание форума', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Программа АС', 105, 28, { align: 'center' });
    
    const tableData = schedule.map(item => {
      const endTime = addMinutes(item.startTime, item.event.duration);
      return [
        `${item.startTime} - ${endTime}`,
        item.customTitle || item.event.title,
        item.event.category || '',
        `${item.event.duration} мин`,
        item.event.location || ''
      ];
    });
    
    autoTable(doc, {
      startY: 35,
      head: [['Время', 'Мероприятие', 'Раздел', 'Длительность', 'Место']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [147, 51, 234],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 60 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 }
      },
      alternateRowStyles: {
        fillColor: [245, 243, 255]
      },
      margin: { top: 35, left: 10, right: 10 }
    });
    
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Страница ${i} из ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    doc.save('schedule-forum.pdf');
  };

  const canGenerateSchedule = categories.every(cat => {
    if (cat === 'Знакомство с программой АС') {
      return (selectedEvents[cat] || []).length >= 1;
    }
    return (selectedEvents[cat] || []).length === 1;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Планировщик форума
          </h1>
          <p className="text-gray-600 text-lg">Создайте идеальное расписание для программы АС</p>
        </div>

        {step === 'selection' && (
          <div className="space-y-8 animate-fade-in">
            {categories.map((category) => (
              <div key={category} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-gray-800">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                  {category}
                  {selectedEvents[category] && selectedEvents[category].length > 0 && (
                    <Badge className="ml-2 bg-green-500">
                      <Icon name="Check" size={14} className="mr-1" />
                      {category === 'Знакомство с программой АС' 
                        ? `Выбрано: ${selectedEvents[category].length}`
                        : 'Выбрано'}
                    </Badge>
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockEvents
                    .filter(event => event.category === category)
                    .map(event => {
                      const selected = isEventSelected(event.id);
                      
                      return (
                        <Card
                          key={event.id}
                          className={`cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${
                            selected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleEventSelect(event)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-base leading-tight">{event.title}</CardTitle>
                              <Badge variant="secondary" className="shrink-0">
                                {event.duration} мин
                              </Badge>
                            </div>
                            <CardDescription className="text-sm line-clamp-2">{event.description}</CardDescription>
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
              </div>
            ))}

            {canGenerateSchedule && (
              <div className="flex justify-center pt-6 animate-scale-in">
                <Button
                  size="lg"
                  onClick={generateInitialSchedule}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6"
                >
                  Создать расписание
                  <Icon name="ArrowRight" size={22} />
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 'editing' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Редактирование расписания</CardTitle>
                    <CardDescription>Измените время, порядок или добавьте перерывы</CardDescription>
                  </div>
                  <Button onClick={() => setAddDialog(true)} className="gap-2">
                    <Icon name="Plus" size={18} />
                    Добавить элемент
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {schedule.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`p-4 rounded-xl border-2 cursor-move transition-all ${
                      item.type === 'event'
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:border-purple-400'
                        : item.type === 'meal'
                        ? 'bg-green-50 border-green-200 hover:border-green-400'
                        : item.type === 'break'
                        ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-400'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                    } ${draggedIndex === index ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon name="GripVertical" size={20} className="text-gray-400" />
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={item.startTime}
                          onChange={(e) => updateStartTime(item.id, e.target.value)}
                          className="w-32"
                        />
                        <span className="text-sm text-gray-500">—</span>
                        <span className="text-sm font-medium">
                          {addMinutes(item.startTime, item.event.duration)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.customTitle || item.event.title}</h3>
                        {item.event.category && (
                          <p className="text-xs text-gray-600">[{item.event.category}]</p>
                        )}
                      </div>
                      <Badge variant="outline">{item.event.duration} мин</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setStep('selection')}
                className="gap-2"
              >
                <Icon name="ArrowLeft" size={18} />
                Назад к выбору
              </Button>
              <Button
                onClick={() => setStep('final')}
                className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Сформировать расписание
                <Icon name="Sparkles" size={18} />
              </Button>
            </div>
          </div>
        )}

        {step === 'final' && (
          <div className="animate-fade-in">
            <Card className="bg-white shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl flex items-center gap-3">
                      <Icon name="CalendarCheck" size={32} className="text-purple-600" />
                      Финальное расписание
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      Готовое расписание форума программы АС
                    </CardDescription>
                  </div>
                  <Button onClick={exportToPDF} className="gap-2 bg-green-600 hover:bg-green-700">
                    <Icon name="Download" size={18} />
                    Скачать
                  </Button>
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
                            ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-500'
                            : item.type === 'meal'
                            ? 'bg-green-50 border-green-500'
                            : item.type === 'break'
                            ? 'bg-yellow-50 border-yellow-500'
                            : 'bg-gray-50 border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center bg-white rounded-lg px-3 py-2 shadow-sm">
                            <span className="text-sm font-bold text-purple-600">{item.startTime}</span>
                            <span className="text-xs text-gray-400">—</span>
                            <span className="text-sm font-bold text-blue-600">{endTime}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">
                              {item.customTitle || item.event.title}
                            </h3>
                            {item.event.category && (
                              <p className="text-sm text-purple-600 font-medium mt-1">
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
                          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                            {item.event.duration} мин
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between gap-4 pt-8 border-t mt-8">
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
        )}

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
      </div>
    </div>
  );
};

export default Index;