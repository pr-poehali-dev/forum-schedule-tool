import { useScheduleState } from '@/hooks/useScheduleState';
import { useScheduleHandlers } from '@/hooks/useScheduleHandlers';
import { mockEvents } from '@/components/schedule/types';
import EventSelection from '@/components/schedule/EventSelection';
import ScheduleEditor from '@/components/schedule/ScheduleEditor';
import FinalSchedule from '@/components/schedule/FinalSchedule';
import ScheduleDialogs from '@/components/schedule/ScheduleDialogs';
import ScheduleHeader from '@/components/schedule/ScheduleHeader';

const Index = () => {
  const state = useScheduleState();
  const handlers = useScheduleHandlers(state);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ScheduleHeader
          savedSchedules={state.savedSchedules}
          currentScheduleId={state.currentScheduleId}
          step={state.step}
          setManageDialog={state.setManageDialog}
          setSaveDialog={state.setSaveDialog}
          setScheduleName={state.setScheduleName}
        />

        {state.step === 'selection' && (
          <EventSelection
            selectedEvents={state.selectedEvents}
            durationFilter={state.durationFilter}
            setDurationFilter={state.setDurationFilter}
            handleEventSelect={handlers.handleEventSelect}
            handleEventRemoveOne={handlers.handleEventRemoveOne}
            isEventSelected={handlers.isEventSelected}
            handleViewEvent={(event) => {
              state.setViewingEvent(event);
              state.setViewEventDialog(true);
            }}
            setMasterClassDialog={state.setMasterClassDialog}
            canGenerateSchedule={handlers.canGenerateSchedule}
            generateInitialSchedule={handlers.generateInitialSchedule}
          />
        )}

        {state.step === 'editing' && (
          <ScheduleEditor
            schedule={state.schedule}
            editingTime={state.editingTime}
            tempTime={state.tempTime}
            editingDuration={state.editingDuration}
            tempDuration={state.tempDuration}
            draggedIndex={state.draggedIndex}
            setEditingTime={state.setEditingTime}
            setTempTime={state.setTempTime}
            setEditingDuration={state.setEditingDuration}
            setTempDuration={state.setTempDuration}
            updateStartTime={handlers.updateStartTime}
            updateDuration={handlers.updateDuration}
            updateLocation={handlers.updateLocation}
            removeItem={handlers.removeItem}
            handleDragStart={handlers.handleDragStart}
            handleDragOver={handlers.handleDragOver}
            handleDragEnd={handlers.handleDragEnd}
            setAddDialog={state.setAddDialog}
            setStep={state.setStep}
          />
        )}

        {state.step === 'final' && (
          <FinalSchedule
            schedule={state.schedule}
            exportToExcel={handlers.exportToExcel}
            exportToJPG={handlers.exportToJPG}
            exportToPDF={handlers.exportToPDF}
            setStep={state.setStep}
            setSelectedEvents={state.setSelectedEvents}
            setSchedule={state.setSchedule}
          />
        )}

        <ScheduleDialogs
          addDialog={state.addDialog}
          setAddDialog={state.setAddDialog}
          addType={state.addType}
          setAddType={state.setAddType}
          addDuration={state.addDuration}
          setAddDuration={state.setAddDuration}
          addTitle={state.addTitle}
          setAddTitle={state.setAddTitle}
          addCustomItem={handlers.addCustomItem}
          
          viewEventDialog={state.viewEventDialog}
          setViewEventDialog={state.setViewEventDialog}
          viewingEvent={state.viewingEvent}
          handleEventSelect={handlers.handleEventSelect}
          isEventSelected={handlers.isEventSelected}
          
          saveDialog={state.saveDialog}
          setSaveDialog={state.setSaveDialog}
          scheduleName={state.scheduleName}
          setScheduleName={state.setScheduleName}
          saveCurrentSchedule={handlers.saveCurrentSchedule}
          currentScheduleId={state.currentScheduleId}
          
          manageDialog={state.manageDialog}
          setManageDialog={state.setManageDialog}
          savedSchedules={state.savedSchedules}
          createNewSchedule={handlers.createNewSchedule}
          loadSchedule={handlers.loadSchedule}
          deleteSchedule={handlers.deleteSchedule}
          
          interactiveDialog={state.interactiveDialog}
          setInteractiveDialog={state.setInteractiveDialog}
          networkingDialog={state.networkingDialog}
          setNetworkingDialog={state.setNetworkingDialog}
          selectedEvents={state.selectedEvents}
          setSelectedEvents={state.setSelectedEvents}
          mockEvents={mockEvents}
          
          masterClassDialog={state.masterClassDialog}
          setMasterClassDialog={state.setMasterClassDialog}
        />
      </div>
    </div>
  );
};

export default Index;