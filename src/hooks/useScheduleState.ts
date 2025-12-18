import { useState } from 'react';
import { Event, ScheduleItem, SavedSchedule } from '@/components/schedule/types';

export const useScheduleState = () => {
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
  const [networkingDialog, setNetworkingDialog] = useState(false);
  const [masterClassDialog, setMasterClassDialog] = useState(false);
  const [editingTime, setEditingTime] = useState<string | null>(null);
  const [tempTime, setTempTime] = useState('');
  const [editingDuration, setEditingDuration] = useState<string | null>(null);
  const [tempDuration, setTempDuration] = useState(0);
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');

  return {
    selectedEvents,
    setSelectedEvents,
    schedule,
    setSchedule,
    step,
    setStep,
    addDialog,
    setAddDialog,
    addType,
    setAddType,
    addDuration,
    setAddDuration,
    addTitle,
    setAddTitle,
    draggedIndex,
    setDraggedIndex,
    viewEventDialog,
    setViewEventDialog,
    viewingEvent,
    setViewingEvent,
    savedSchedules,
    setSavedSchedules,
    currentScheduleId,
    setCurrentScheduleId,
    saveDialog,
    setSaveDialog,
    scheduleName,
    setScheduleName,
    manageDialog,
    setManageDialog,
    interactiveDialog,
    setInteractiveDialog,
    networkingDialog,
    setNetworkingDialog,
    masterClassDialog,
    setMasterClassDialog,
    editingTime,
    setEditingTime,
    tempTime,
    setTempTime,
    editingDuration,
    setEditingDuration,
    tempDuration,
    setTempDuration,
    durationFilter,
    setDurationFilter,
  };
};
