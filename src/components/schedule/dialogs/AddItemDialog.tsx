import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addType: 'break' | 'meal' | 'transfer';
  addDuration: number;
  setAddDuration: (duration: number) => void;
  addTitle: string;
  setAddTitle: (title: string) => void;
  addCustomItem: () => void;
}

const AddItemDialog = ({
  open,
  onOpenChange,
  addDuration,
  setAddDuration,
  addTitle,
  setAddTitle,
  addCustomItem
}: AddItemDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить элемент в расписание</DialogTitle>
          <DialogDescription>Укажите название и длительность элемента</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="custom-title">
              Описание
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="custom-title"
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
              placeholder="Дополнительный трансфер; Перерыв и т. д."
              required
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
          <Button 
            onClick={addCustomItem} 
            className="w-full"
            disabled={!addTitle.trim()}
          >
            Добавить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
