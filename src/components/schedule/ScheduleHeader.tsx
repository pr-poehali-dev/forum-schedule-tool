import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ThemeToggle from '@/components/ThemeToggle';
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
      <div className="absolute top-0 right-0 flex items-center gap-3">
        <ThemeToggle />
        <img 
          src="https://cdn.poehali.dev/files/Рисунок алабуга.png" 
          alt="Алабуга логотип" 
          className="w-32 h-auto"
        />
      </div>
      <div className="text-center">
        <h1 className="text-5xl font-bold text-foreground mb-3">
          Планировщик форума
        </h1>
        <p className="text-muted-foreground text-lg">Создайте идеальное расписание для форума</p>
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
            className="gap-2 bg-primary hover:bg-primary/90"
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