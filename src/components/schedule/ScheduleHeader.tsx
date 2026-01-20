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
      <div className="absolute top-0 left-0">
        <ThemeToggle />
      </div>
      <div className="absolute top-0 right-0">
        <img 
          src="https://cdn.poehali.dev/files/Рисунок алабуга.png" 
          alt="Алабуга логотип" 
          className="w-32 h-auto dark:block hidden"
        />
        <img 
          src="https://cdn.poehali.dev/files/0c9cc9f80dee7e3af8109daf69f3c176.jpeg" 
          alt="Алабуга логотип" 
          className="w-32 h-auto dark:hidden block"
        />
      </div>
      <div className="text-center">
        <h1 className="text-5xl font-bold text-foreground mb-3">
          Планировщик форума
        </h1>
        <p className="text-muted-foreground text-lg">Создайте идеальное расписание для форума</p>
        <div className="flex justify-center gap-2 mt-4">
          <Button 
            onClick={() => window.open('https://team.alabuga.ru/~Dvzi6', '_blank')}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg"
            size="sm"
          >
            <Icon name="BookOpen" size={16} className="mr-2" />
            Материалы
          </Button>
          <Button 
            onClick={() => window.open('https://forumguidestart.ru/', '_blank')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
            size="sm"
          >
            <Icon name="Compass" size={16} className="mr-2" />
            Гайд по организации
          </Button>
        </div>
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