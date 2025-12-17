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

interface SavedSchedule {
  id: string;
  name: string;
  selectedEvents: Record<string, Event[]>;
  schedule: ScheduleItem[];
  createdAt: string;
}

const mockEvents: Event[] = [
  { id: '1a', title: 'Обзорная экскурсия по Елабуге', description: 'Участницы направятся на обзорную экскурсию по достопримечательностям Елабуги. Маршрут: 1. «Чёртово» Городище; 2. Площадь Тысячелетия Елабуги; 3. Собор Спаса Нерукотворного Образа; 4. Музей И. И. Шишкина; 5. Шишкинские Пруды; 6. Памятник И. И. Шишкину; 7. Памятник Н. А. Дуровой; 8. Троицкое Кладбище; 9. Улица Казанская; 10. Памятник М. И. Цветаевой; 11. Дом Памяти М. И. Цветаевой.', duration: 75, location: 'город Елабуга', category: 'Утренние мероприятия' },
  { id: '1b', title: 'Обзорная экскурсия по "Алабуга Политех"', description: 'Участницам форума проведут лекцию о проекте "Алабуга Политех", а также подробно расскажут о каждом направлении обучения.', duration: 60, location: '"Алабуга Политех"', category: 'Утренние мероприятия' },
  { id: '1c', title: 'Обзорная экскурсия по территории ОЭЗ', description: 'Мероприятие проводится для ознакомления участниц с ОЭЗ и ее резидентами. Автобус провозит участниц по маршруту: выезд с Синергии 13.2 "Яковлев" - проезд мимо резидентов: Август-Алабуга, Trakya Glass Rus, Хаят Кимия, Кастамону, КНТ-Пласт, Драйлок - проезд мимо "Алабуга Политех" и АлДи - возвращение в Синергию 13.2 "Яковлев"', duration: 45, location: 'Территория ОЭЗ', category: 'Утренние мероприятия' },
  { id: '1d', title: 'Обзорная экскурсия по Международной Школе "Три Медведя"', description: 'Участницам форума проведут лекцию о проекте "Три медведя", а также подробно расскажут о процессе обучения.', duration: 60, location: 'Международная школа "Три медведя"', category: 'Утренние мероприятия' },
  { id: '1e', title: 'Обзорная экскурсия по Штаб-квартире "Алабуга Политех": Пирамида', description: 'Участницам форума подробно покажут и расскажут о месте проживания участниц программы АС.', duration: 60, location: 'Корп. хостел Пирамида', category: 'Утренние мероприятия' },
  { id: '1f', title: 'Утренняя зарядка (Йога)', description: 'Мероприятие направлено на развитие физических качеств участниц. Утренняя зарядка способствует быстрому пробуждению и хорошему самочувствию в течении всего дня.', duration: 60, location: 'Спортзал Пирамиды', category: 'Утренние мероприятия' },

  { id: '2a', title: 'Открытие (Начальное мероприятие)', description: 'Вступительное мероприятие, на котором участницы знакомятся с организаторами и ведущими, узнают вводную информацию о форуме', duration: 60, location: 'Конференц-зал Курчатов/Яковлев', category: 'Открывающие мероприятия' },
  { id: '2b', title: 'Открытие с интерактивом', description: 'Знакомство с организаторами и друг с другом + интерактив', duration: 60, location: 'Спортзал "Алабуга Политех"', category: 'Открывающие мероприятия' },
  { id: '2b1', title: 'Интерактив "Капсула времени"', description: 'Всех участниц собирают в круг. Каждой участнице выдаётся лист бумаги и ручка. Участницам необходимо полностью расписать ответ на вопрос «С какой целью я сюда приехала? Что я ожидаю от данного форума?». Организаторы собирают все письма и откладывают в шкатулку. По завершению форума организаторы выдают все письма обратно и проводят анализ.', duration: 15, location: 'Конференц-зал Курчатов/Яковлев; Спортзал "Алабуга Политех"', category: 'Открывающие мероприятия' },
  { id: '2b2', title: 'Интерактив "Круг доверия"', description: 'Участницы образуют команды по 5 человек и по очереди делятся 3 фактами о себе, 2 правдивых и 1 ложный. Другие участницы должны угадать 1 ложный факт.', duration: 20, location: 'Конференц-зал Курчатов/Яковлев; Спортзал "Алабуга Политех"', category: 'Открывающие мероприятия' },
  { id: '2b3', title: 'Интерактив "Время перемен"', description: 'Участницы пишут на бумажках одну привычку или установку, от которой они хотят избавиться, и затем обмениваются ими, обсуждая возможные пути изменения.', duration: 15, location: 'Конференц-зал Курчатов/Яковлев; Спортзал "Алабуга Политех"', category: 'Открывающие мероприятия' },

  { id: '3a', title: 'Презентация программы АС', description: 'Участницам полностью рассказывают о программе АС, знакомят с направлениями, карьерным треком, условиями проживания и т.д.', duration: 60, location: 'Конференц-зал Курчатов/Яковлев', category: 'Знакомство с программой АС' },
  { id: '3b1', title: 'МК: Сервис (Бариста, Официант, Шеф-повар)', description: 'Формат: мини-лекция/видео, Латте-арт, Декор маффина. Цель: показать современность профессий сферы гостеприимства, дать попробовать навыки, которые сразу дают эффект.', duration: 35, location: 'Спортзал "Алабуга Политех"', category: 'Знакомство с программой АС' },
  { id: '3b2', title: 'МК: Оператор производства композитных материалов', description: 'Формат: мини-лекция/видео, ассесмент производства. Цель: показать работу с высокими технологиями, доступными для новичков.', duration: 35, location: 'Спортзал "Алабуга Политех"', category: 'Знакомство с программой АС' },
  { id: '3b3', title: 'МК: Мастер мебели (Монтажные + отделочные работы)', description: 'Стройка — это красиво: Штукатур / Плиточник. Формат: мини лекция, DIY-практикум.', duration: 35, location: 'Спортзал "Алабуга Политех"', category: 'Знакомство с программой АС' },
  { id: '3b4', title: 'МК: Сервис и гостеприимство', description: 'Формат: мини-лекция/видео, логистика гостеприимства.', duration: 35, location: 'Спортзал "Алабуга Политех"', category: 'Знакомство с программой АС' },
  { id: '3b5', title: 'МК: Девушка за рулём (Профессия водитель)', description: 'Формат: лекция + игровая практика.', duration: 35, location: 'Спортзал "Алабуга Политех"', category: 'Знакомство с программой АС' },
  { id: '3b6', title: 'МК: Логистика', description: 'Формат: симулятор + командный челлендж.', duration: 40, location: 'Территория ОЭЗ', category: 'Знакомство с программой АС' },

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

const getDurationColor = (duration: number) => {
  if (duration > 0 && duration <= 60) return { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', badge: 'bg-green-500' };
  if (duration > 60 && duration <= 90) return { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700', badge: 'bg-yellow-500' };
  return { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-700', badge: 'bg-red-500' };
};

const Index = () => {
  const [selectedEvents, setSelectedEvents] = useState<Record<string, Event[]>>({});
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [step, setStep] = useState<'selection' | 'editing' | 'final'>('selection');
  const [addDialog, setAddDialog] = useState(false);
  const [addType, setAddType] = useState<'break' | 'meal' | 'transfer'>('break');
  const [addDuration, setAddDuration] = useState(15);
  const [addTitle, setAddTitle] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [viewEventDialog, setViewEventDialog] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [savedSchedules, setSavedSchedules] = useState<SavedSchedule[]>([]);
  const [currentScheduleId, setCurrentScheduleId] = useState<string | null>(null);
  const [saveDialog, setSaveDialog] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [manageDialog, setManageDialog] = useState(false);
  const [interactiveDialog, setInteractiveDialog] = useState(false);
  const [masterClassDialog, setMasterClassDialog] = useState(false);
  const [editingTime, setEditingTime] = useState<string | null>(null);
  const [tempTime, setTempTime] = useState('');

  const handleEventSelect = (event: Event) => {
    if (event.id === '2b') {
      const hasInteractives = (selectedEvents['Открывающие мероприятия'] || []).some(e => e.id.startsWith('2b') && e.id.length > 2);
      
      if (!hasInteractives) {
        setSelectedEvents(prev => ({
          ...prev,
          [event.category]: [event]
        }));
      }
      
      setInteractiveDialog(true);
      return;
    }

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
      } else if (event.id.startsWith('2b') && event.id.length > 2) {
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
    setSchedule(prev => {
      const newSchedule = [...prev];
      const changedIndex = newSchedule.findIndex(item => item.id === id);
      
      if (changedIndex === -1) return prev;
      
      newSchedule[changedIndex] = { ...newSchedule[changedIndex], startTime: newTime };
      
      for (let i = changedIndex + 1; i < newSchedule.length; i++) {
        const prevItem = newSchedule[i - 1];
        const autoStartTime = addMinutes(prevItem.startTime, prevItem.event.duration);
        newSchedule[i] = { ...newSchedule[i], startTime: autoStartTime };
      }
      
      return newSchedule;
    });
  };

  const removeItem = (id: string) => {
    setSchedule(prev => {
      const newSchedule = prev.filter(item => item.id !== id);
      
      for (let i = 1; i < newSchedule.length; i++) {
        const prevItem = newSchedule[i - 1];
        const autoStartTime = addMinutes(prevItem.startTime, prevItem.event.duration);
        newSchedule[i] = { ...newSchedule[i], startTime: autoStartTime };
      }
      
      return newSchedule;
    });
  };

  const addCustomItem = () => {
    const lastItem = schedule[schedule.length - 1];
    const autoStartTime = lastItem ? addMinutes(lastItem.startTime, lastItem.event.duration) : '12:00';
    
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
      startTime: autoStartTime,
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
    
    for (let i = 0; i < newSchedule.length; i++) {
      if (i === 0) continue;
      const prevItem = newSchedule[i - 1];
      const autoStartTime = addMinutes(prevItem.startTime, prevItem.event.duration);
      newSchedule[i] = { ...newSchedule[i], startTime: autoStartTime };
    }
    
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
    const events = selectedEvents[cat] || [];
    if (cat === 'Знакомство с программой АС') {
      return events.length >= 1;
    }
    if (cat === 'Открывающие мероприятия') {
      const hasOpening = events.some(e => e.id === '2a' || e.id === '2b');
      return hasOpening;
    }
    return events.length === 1;
  });

  const handleViewEvent = (event: Event) => {
    setViewingEvent(event);
    setViewEventDialog(true);
  };

  const saveCurrentSchedule = () => {
    if (!scheduleName.trim()) return;
    
    const newSchedule: SavedSchedule = {
      id: currentScheduleId || `schedule-${Date.now()}`,
      name: scheduleName,
      selectedEvents: { ...selectedEvents },
      schedule: [...schedule],
      createdAt: new Date().toISOString()
    };

    setSavedSchedules(prev => {
      const existing = prev.findIndex(s => s.id === newSchedule.id);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = newSchedule;
        return updated;
      }
      return [...prev, newSchedule];
    });

    setCurrentScheduleId(newSchedule.id);
    setSaveDialog(false);
    setScheduleName('');
  };

  const loadSchedule = (scheduleId: string) => {
    const schedule = savedSchedules.find(s => s.id === scheduleId);
    if (schedule) {
      setSelectedEvents(schedule.selectedEvents);
      setSchedule(schedule.schedule);
      setCurrentScheduleId(schedule.id);
      setStep('editing');
      setManageDialog(false);
    }
  };

  const deleteSchedule = (scheduleId: string) => {
    setSavedSchedules(prev => prev.filter(s => s.id !== scheduleId));
    if (currentScheduleId === scheduleId) {
      setCurrentScheduleId(null);
    }
  };

  const createNewSchedule = () => {
    setSelectedEvents({});
    setSchedule([]);
    setCurrentScheduleId(null);
    setStep('selection');
    setManageDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Планировщик форума
            </h1>
            <p className="text-gray-600 text-lg">Создайте идеальное расписание для форума</p>
          </div>
          
          <div className="flex justify-center gap-3 mt-6">
            <Button
              onClick={() => setManageDialog(true)}
              variant="outline"
              className="gap-2"
            >
              <Icon name="FolderOpen" size={18} />
              Мои расписания ({savedSchedules.length})
            </Button>
            {(step === 'editing' || step === 'final') && (
              <Button
                onClick={() => {
                  const currentSchedule = savedSchedules.find(s => s.id === currentScheduleId);
                  setScheduleName(currentSchedule?.name || '');
                  setSaveDialog(true);
                }}
                className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              >
                <Icon name="Save" size={18} />
                {currentScheduleId ? 'Обновить' : 'Сохранить'}
              </Button>
            )}
          </div>
        </div>

        {step === 'selection' && (
          <div className="space-y-8 animate-fade-in">
            {categories.map((category) => (
              <div key={category} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-gray-800">
                  <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
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
                    .filter(event => {
                      if (event.category === category) {
                        if (category === 'Знакомство с программой АС' && event.id.startsWith('3b')) {
                          return false;
                        }
                        if (category === 'Открывающие мероприятия' && event.id.length > 2 && event.id.startsWith('2b')) {
                          return false;
                        }
                        return true;
                      }
                      return false;
                    })
                    .map(event => {
                      const selected = isEventSelected(event.id);
                      const colorScheme = getDurationColor(event.duration);
                      
                      return (
                        <Card
                          key={event.id}
                          className={`cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 relative ${
                            selected ? 'ring-2 ring-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <CardHeader className="pb-3" onClick={() => handleEventSelect(event)}>
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-base leading-tight">{event.title}</CardTitle>
                              <Badge className={`${colorScheme.badge} text-white shrink-0`}>
                                {event.duration} мин
                              </Badge>
                            </div>
                            <CardDescription className="text-sm line-clamp-2">{event.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Icon name="MapPin" size={14} />
                                <span className="line-clamp-1">{event.location}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewEvent(event);
                                }}
                                className="h-8 text-cyan-600 hover:text-cyan-700"
                              >
                                <Icon name="Info" size={16} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  {category === 'Знакомство с программой АС' && (
                    <Card
                      className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-cyan-50"
                      onClick={() => setMasterClassDialog(true)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-100 rounded-xl">
                            <Icon name="GraduationCap" size={28} className="text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Мастер-классы</CardTitle>
                            <CardDescription>Выберите мастер-классы</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {(selectedEvents[category] || []).filter(e => e.id.startsWith('3b')).length > 0 && (
                          <Badge className="bg-green-500 text-white">
                            Выбрано: {(selectedEvents[category] || []).filter(e => e.id.startsWith('3b')).length}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ))}

            {canGenerateSchedule && (
              <div className="flex justify-center pt-6 animate-scale-in">
                <Button
                  size="lg"
                  onClick={generateInitialSchedule}
                  className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-lg px-8 py-6"
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
                        ? `${getDurationColor(item.event.duration).bg} ${getDurationColor(item.event.duration).border} hover:border-opacity-100`
                        : item.type === 'meal'
                        ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
                        : item.type === 'break'
                        ? 'bg-amber-50 border-amber-200 hover:border-amber-400'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                    } ${draggedIndex === index ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon name="GripVertical" size={20} className="text-gray-400" />
                      <div className="flex items-center gap-2">
                        {editingTime === item.id ? (
                          <>
                            <Input
                              type="time"
                              value={tempTime}
                              onChange={(e) => setTempTime(e.target.value)}
                              className="w-32"
                              autoFocus
                              onBlur={() => {
                                updateStartTime(item.id, tempTime);
                                setEditingTime(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateStartTime(item.id, tempTime);
                                  setEditingTime(null);
                                }
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingTime(item.id);
                                setTempTime(item.startTime);
                              }}
                              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                            >
                              {item.startTime}
                            </button>
                          </>
                        )}
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
                className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
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
                      <Icon name="CalendarCheck" size={32} className="text-cyan-600" />
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
      </div>
    </div>
  );
};

export default Index;