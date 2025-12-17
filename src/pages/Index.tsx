import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';
import { Event, ScheduleItem, SavedSchedule, mockEvents, categories, addMinutes } from '@/components/schedule/types';
import EventSelection from '@/components/schedule/EventSelection';
import ScheduleEditor from '@/components/schedule/ScheduleEditor';
import FinalSchedule from '@/components/schedule/FinalSchedule';
import ScheduleDialogs from '@/components/schedule/ScheduleDialogs';

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
  const [editingDuration, setEditingDuration] = useState<string | null>(null);
  const [tempDuration, setTempDuration] = useState(0);
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');

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

  const exportToExcel = () => {
    const tableData = schedule.map(item => {
      const endTime = addMinutes(item.startTime, item.event.duration);
      return {
        'Время': `${item.startTime} - ${endTime}`,
        'Мероприятие': item.customTitle || item.event.title,
        'Место проведения': item.event.location || ''
      };
    });
    
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Расписание');
    
    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 50 },
      { wch: 40 }
    ];
    
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[headerCell]) continue;
      worksheet[headerCell].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "ADD8E6" } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }
    
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const timeCell = XLSX.utils.encode_cell({ r: R, c: 0 });
      if (worksheet[timeCell]) {
        worksheet[timeCell].s = {
          fill: { fgColor: { rgb: "E0F2F7" } },
          font: { italic: true },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }
      
      const locationCell = XLSX.utils.encode_cell({ r: R, c: 2 });
      if (worksheet[locationCell]) {
        worksheet[locationCell].s = {
          alignment: { wrapText: true, vertical: 'top' }
        };
      }
    }
    
    XLSX.writeFile(workbook, 'raspisanie-foruma.xlsx', { cellStyles: true });
  };

  const updateDuration = (id: string, newDuration: number) => {
    setSchedule(prev => {
      const newSchedule = [...prev];
      const changedIndex = newSchedule.findIndex(item => item.id === id);
      
      if (changedIndex === -1) return prev;
      
      newSchedule[changedIndex] = { 
        ...newSchedule[changedIndex], 
        event: { ...newSchedule[changedIndex].event, duration: newDuration }
      };
      
      for (let i = changedIndex + 1; i < newSchedule.length; i++) {
        const prevItem = newSchedule[i - 1];
        const autoStartTime = addMinutes(prevItem.startTime, prevItem.event.duration);
        newSchedule[i] = { ...newSchedule[i], startTime: autoStartTime };
      }
      
      return newSchedule;
    });
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
    return events.length >= 1;
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
        <div className="mb-8 animate-fade-in relative">
          <img 
            src="https://cdn.poehali.dev/files/Рисунок алабуга.png" 
            alt="Алабуга логотип" 
            className="absolute top-0 right-0 w-32 h-auto"
          />
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
          <EventSelection
            selectedEvents={selectedEvents}
            durationFilter={durationFilter}
            setDurationFilter={setDurationFilter}
            handleEventSelect={handleEventSelect}
            isEventSelected={isEventSelected}
            handleViewEvent={handleViewEvent}
            setMasterClassDialog={setMasterClassDialog}
            canGenerateSchedule={canGenerateSchedule}
            generateInitialSchedule={generateInitialSchedule}
          />
        )}

        {step === 'editing' && (
          <ScheduleEditor
            schedule={schedule}
            editingTime={editingTime}
            tempTime={tempTime}
            editingDuration={editingDuration}
            tempDuration={tempDuration}
            draggedIndex={draggedIndex}
            setEditingTime={setEditingTime}
            setTempTime={setTempTime}
            setEditingDuration={setEditingDuration}
            setTempDuration={setTempDuration}
            updateStartTime={updateStartTime}
            updateDuration={updateDuration}
            removeItem={removeItem}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragEnd={handleDragEnd}
            setAddDialog={setAddDialog}
            setStep={setStep}
          />
        )}

        {step === 'final' && (
          <FinalSchedule
            schedule={schedule}
            exportToExcel={exportToExcel}
            setStep={setStep}
            setSelectedEvents={setSelectedEvents}
            setSchedule={setSchedule}
          />
        )}

        <ScheduleDialogs
          addDialog={addDialog}
          setAddDialog={setAddDialog}
          addType={addType}
          setAddType={setAddType}
          addDuration={addDuration}
          setAddDuration={setAddDuration}
          addTitle={addTitle}
          setAddTitle={setAddTitle}
          addCustomItem={addCustomItem}
          
          viewEventDialog={viewEventDialog}
          setViewEventDialog={setViewEventDialog}
          viewingEvent={viewingEvent}
          handleEventSelect={handleEventSelect}
          isEventSelected={isEventSelected}
          
          saveDialog={saveDialog}
          setSaveDialog={setSaveDialog}
          scheduleName={scheduleName}
          setScheduleName={setScheduleName}
          saveCurrentSchedule={saveCurrentSchedule}
          currentScheduleId={currentScheduleId}
          
          manageDialog={manageDialog}
          setManageDialog={setManageDialog}
          savedSchedules={savedSchedules}
          createNewSchedule={createNewSchedule}
          loadSchedule={loadSchedule}
          deleteSchedule={deleteSchedule}
          
          interactiveDialog={interactiveDialog}
          setInteractiveDialog={setInteractiveDialog}
          selectedEvents={selectedEvents}
          setSelectedEvents={setSelectedEvents}
          mockEvents={mockEvents}
          
          masterClassDialog={masterClassDialog}
          setMasterClassDialog={setMasterClassDialog}
        />
      </div>
    </div>
  );
};

export default Index;