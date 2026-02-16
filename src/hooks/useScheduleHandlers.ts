import { Event, ScheduleItem, SavedSchedule, categories, addMinutes } from '@/components/schedule/types';
import * as XLSX from 'xlsx-js-style';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ScheduleState {
  selectedEvents: Record<string, Event[]>;
  setSelectedEvents: React.Dispatch<React.SetStateAction<Record<string, Event[]>>>;
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  setStep: (step: 'selection' | 'editing' | 'final') => void;
  addDuration: number;
  addTitle: string;
  setAddDialog: (open: boolean) => void;
  setAddTitle: (title: string) => void;
  setAddDuration: (duration: number) => void;
  setDraggedIndex: (index: number | null) => void;
  draggedIndex: number | null;
  setInteractiveDialog: (open: boolean) => void;
  setNetworkingDialog: (open: boolean) => void;
  setSavedSchedules: React.Dispatch<React.SetStateAction<SavedSchedule[]>>;
  savedSchedules: SavedSchedule[];
  currentScheduleId: string | null;
  setCurrentScheduleId: (id: string | null) => void;
  setSaveDialog: (open: boolean) => void;
  scheduleName: string;
  setScheduleName: (name: string) => void;
  setManageDialog: (open: boolean) => void;
}

export const useScheduleHandlers = (state: ScheduleState) => {
  const handleEventSelect = (event: Event) => {
    if (event.id === '2b') {
      const hasInteractives = (state.selectedEvents['Открывающие мероприятия'] || []).some(e => e.id.startsWith('2b') && e.id.length > 2);
      
      if (!hasInteractives) {
        state.setSelectedEvents(prev => ({
          ...prev,
          [event.category]: [event]
        }));
      }
      
      state.setInteractiveDialog(true);
      return;
    }

    if (event.id === '4c') {
      const hasNetworkingGames = (state.selectedEvents['Развлекательные мероприятия'] || []).some(e => e.id.startsWith('4c') && e.id.length > 2);
      
      if (!hasNetworkingGames) {
        state.setSelectedEvents(prev => ({
          ...prev,
          [event.category]: [...(prev[event.category] || []).filter(e => e.id !== '4c'), event]
        }));
      }
      
      state.setNetworkingDialog(true);
      return;
    }

    if (event.id === '2a') {
      const has2b = (state.selectedEvents['Открывающие мероприятия'] || []).some(e => e.id === '2b');
      if (has2b) {
        return;
      }
    }

    state.setSelectedEvents(prev => {
      const categoryEvents = prev[event.category] || [];
      const isSelected = categoryEvents.some(e => e.id === event.id);
      
      if (event.category === 'Дополнительно' && event.id.startsWith('transfer_')) {
        return {
          ...prev,
          [event.category]: [...categoryEvents, event]
        };
      } else if (event.category === 'Знакомство с программой АС' && event.id.startsWith('3b')) {
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
      } else if (event.id.startsWith('4c') && event.id.length > 2) {
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
    return Object.values(state.selectedEvents).flat().some(e => e.id === eventId);
  };

  const handleEventRemoveOne = (event: Event) => {
    state.setSelectedEvents(prev => {
      const categoryEvents = prev[event.category] || [];
      const index = categoryEvents.findIndex(e => e.id === event.id);
      
      if (index === -1) return prev;
      
      const newEvents = [...categoryEvents];
      newEvents.splice(index, 1);
      
      return {
        ...prev,
        [event.category]: newEvents
      };
    });
  };

  const generateInitialSchedule = () => {
    const items: ScheduleItem[] = [];
    let currentTime = '09:00';

    const additionalCategory = state.selectedEvents['Дополнительно'] || [];
    const breakfast = additionalCategory.find(e => e.id === 'meal_breakfast');
    const lunch = additionalCategory.find(e => e.id === 'meal_lunch');
    const dinner = additionalCategory.find(e => e.id === 'meal_dinner');
    const transfers = additionalCategory.filter(e => e.id.startsWith('transfer_'));

    const regularEvents: ScheduleItem[] = [];
    categories.forEach(category => {
      if (category === 'Дополнительно') return;
      const events = state.selectedEvents[category] || [];
      events.forEach(event => {
        regularEvents.push({
          id: `${Date.now()}-${Math.random()}`,
          event,
          startTime: currentTime,
          type: 'event'
        });
        currentTime = addMinutes(currentTime, event.duration);
      });
    });

    if (breakfast) {
      items.push({
        id: `${Date.now()}-${Math.random()}`,
        event: breakfast,
        startTime: '09:00',
        type: 'meal'
      });
      currentTime = addMinutes('09:00', breakfast.duration);
    } else {
      currentTime = '09:00';
    }

    const midPoint = Math.floor(regularEvents.length / 2);
    
    for (let i = 0; i < regularEvents.length; i++) {
      if (lunch && i === midPoint) {
        items.push({
          id: `${Date.now()}-${Math.random()}`,
          event: lunch,
          startTime: currentTime,
          type: 'meal'
        });
        currentTime = addMinutes(currentTime, lunch.duration);
      }
      
      items.push({
        ...regularEvents[i],
        startTime: currentTime
      });
      currentTime = addMinutes(currentTime, regularEvents[i].event.duration);
    }

    if (dinner) {
      items.push({
        id: `${Date.now()}-${Math.random()}`,
        event: dinner,
        startTime: currentTime,
        type: 'meal'
      });
      currentTime = addMinutes(currentTime, dinner.duration);
    }

    transfers.forEach(transfer => {
      items.push({
        id: `${Date.now()}-${Math.random()}`,
        event: transfer,
        startTime: currentTime,
        type: 'transfer'
      });
      currentTime = addMinutes(currentTime, transfer.duration);
    });

    state.setSchedule(items);
    state.setStep('editing');
  };

  const updateStartTime = (id: string, newTime: string) => {
    state.setSchedule(prev => {
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
    state.setSchedule(prev => {
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
    const lastItem = state.schedule[state.schedule.length - 1];
    const autoStartTime = lastItem ? addMinutes(lastItem.startTime, lastItem.event.duration) : '12:00';
    
    const newItem: ScheduleItem = {
      id: `${Date.now()}-${Math.random()}`,
      event: {
        id: `custom-${Date.now()}`,
        title: state.addTitle || 'Дополнительный элемент',
        description: '',
        duration: state.addDuration,
        location: '',
        category: ''
      },
      startTime: autoStartTime,
      type: 'break',
      customTitle: state.addTitle
    };
    
    state.setSchedule(prev => [...prev, newItem]);
    state.setAddDialog(false);
    state.setAddTitle('');
    state.setAddDuration(15);
  };

  const handleDragStart = (index: number) => {
    state.setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (state.draggedIndex === null || state.draggedIndex === index) return;

    const newSchedule = [...state.schedule];
    const draggedItem = newSchedule[state.draggedIndex];
    newSchedule.splice(state.draggedIndex, 1);
    newSchedule.splice(index, 0, draggedItem);
    
    for (let i = 0; i < newSchedule.length; i++) {
      if (i === 0) continue;
      const prevItem = newSchedule[i - 1];
      const autoStartTime = addMinutes(prevItem.startTime, prevItem.event.duration);
      newSchedule[i] = { ...newSchedule[i], startTime: autoStartTime };
    }
    
    state.setSchedule(newSchedule);
    state.setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    state.setDraggedIndex(null);
  };

  const exportToJPG = async () => {
    const scheduleElement = document.querySelector('[data-schedule-export]');
    if (!scheduleElement) return;

    const canvas = await html2canvas(scheduleElement as HTMLElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
      ignoreElements: (element) => {
        return element.hasAttribute('data-no-export');
      }
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'raspisanie-foruma.jpg';
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/jpeg', 0.95);
  };

  const exportToExcel = () => {
    const tableData = state.schedule.map(item => {
      const endTime = addMinutes(item.startTime, item.event.duration);
      return [
        `${item.startTime} - ${endTime}`,
        item.customTitle || item.event.title
      ];
    });
    
    const data = [
      ['Время', 'Мероприятие'],
      ...tableData
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Расписание');
    
    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 50 }
    ];
    
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[headerCell]) continue;
      worksheet[headerCell].s = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: "4A90E2" } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        }
      };
    }
    
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;
        
        worksheet[cellAddress].s = {
          alignment: { 
            wrapText: true, 
            vertical: 'center',
            horizontal: 'center'
          },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          }
        };
      }
    }
    
    XLSX.writeFile(workbook, 'raspisanie-foruma.xlsx');
  };

  const exportToPDF = async () => {
    const scheduleElement = document.querySelector('[data-schedule-export]');
    if (!scheduleElement) return;

    const canvas = await html2canvas(scheduleElement as HTMLElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
      ignoreElements: (element) => {
        return element.hasAttribute('data-no-export');
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgScaledWidth = imgWidth * ratio;
    const imgScaledHeight = imgHeight * ratio;
    
    const marginX = (pdfWidth - imgScaledWidth) / 2;
    const marginY = 0;

    if (imgScaledHeight > pdfHeight) {
      const totalPages = Math.ceil(imgScaledHeight / pdfHeight);
      
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        const sourceY = i * pdfHeight / ratio;
        const sourceHeight = Math.min(pdfHeight / ratio, imgHeight - sourceY);
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imgWidth;
        tempCanvas.height = sourceHeight;
        const ctx = tempCanvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
          const pageImgData = tempCanvas.toDataURL('image/jpeg', 1.0);
          pdf.addImage(pageImgData, 'JPEG', marginX, marginY, imgScaledWidth, sourceHeight * ratio);
        }
      }
    } else {
      pdf.addImage(imgData, 'JPEG', marginX, marginY, imgScaledWidth, imgScaledHeight);
    }

    pdf.save('raspisanie-foruma.pdf');
  };

  const updateDuration = (id: string, newDuration: number) => {
    state.setSchedule(prev => {
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

  const canGenerateSchedule = Object.values(state.selectedEvents).some(events => events.length > 0);

  const saveCurrentSchedule = () => {
    if (!state.scheduleName.trim()) return;
    
    const newSchedule: SavedSchedule = {
      id: state.currentScheduleId || `schedule-${Date.now()}`,
      name: state.scheduleName,
      selectedEvents: { ...state.selectedEvents },
      schedule: [...state.schedule],
      createdAt: new Date().toISOString()
    };

    state.setSavedSchedules(prev => {
      const existing = prev.findIndex(s => s.id === newSchedule.id);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = newSchedule;
        return updated;
      }
      return [...prev, newSchedule];
    });

    state.setCurrentScheduleId(newSchedule.id);
    state.setSaveDialog(false);
    state.setScheduleName('');
  };

  const loadSchedule = (scheduleId: string) => {
    const schedule = state.savedSchedules.find(s => s.id === scheduleId);
    if (schedule) {
      state.setSelectedEvents(schedule.selectedEvents);
      state.setSchedule(schedule.schedule);
      state.setCurrentScheduleId(schedule.id);
      state.setStep('editing');
      state.setManageDialog(false);
    }
  };

  const deleteSchedule = (scheduleId: string) => {
    state.setSavedSchedules(prev => prev.filter(s => s.id !== scheduleId));
    if (state.currentScheduleId === scheduleId) {
      state.setCurrentScheduleId(null);
    }
  };

  const createNewSchedule = () => {
    state.setSelectedEvents({});
    state.setSchedule([]);
    state.setCurrentScheduleId(null);
    state.setStep('selection');
    state.setManageDialog(false);
  };

  return {
    handleEventSelect,
    isEventSelected,
    handleEventRemoveOne,
    generateInitialSchedule,
    updateStartTime,
    removeItem,
    addCustomItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    exportToJPG,
    exportToExcel,
    exportToPDF,
    updateDuration,
    canGenerateSchedule,
    saveCurrentSchedule,
    loadSchedule,
    deleteSchedule,
    createNewSchedule,
  };
};