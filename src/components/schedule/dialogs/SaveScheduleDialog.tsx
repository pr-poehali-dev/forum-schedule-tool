import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface SaveScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleName: string;
  setScheduleName: (name: string) => void;
  saveCurrentSchedule: () => void;
  currentScheduleId: string | null;
}

const SaveScheduleDialog = ({
  open,
  onOpenChange,
  scheduleName,
  setScheduleName,
  saveCurrentSchedule,
  currentScheduleId
}: SaveScheduleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Save" size={24} className="text-primary" />
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
              placeholder="Мое расписание форума"
            />
          </div>
          <Button 
            onClick={saveCurrentSchedule} 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={!scheduleName.trim()}
          >
            <Icon name="Save" size={18} className="mr-2" />
            {currentScheduleId ? 'Обновить' : 'Сохранить'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveScheduleDialog;
