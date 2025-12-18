import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { SavedSchedule } from './types';

interface ScheduleHeaderProps {
  savedSchedules: SavedSchedule[];
  currentScheduleId: string | null;
  step: 'selection' | 'editing' | 'final';
  setManageDialog: (open: boolean) => void;
  setSaveDialog: (open: boolean) => void;
  setScheduleName: (name: string) => void;
}

const ScheduleHeader = ({
  savedSchedules,
  currentScheduleId,
  step,
  setManageDialog,
  setSaveDialog,
  setScheduleName,
}: ScheduleHeaderProps) => {
  return (
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
  );
};

export default ScheduleHeader;
