import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { SavedSchedule } from '../types';

interface ManageSchedulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedSchedules: SavedSchedule[];
  createNewSchedule: () => void;
  loadSchedule: (id: string) => void;
  deleteSchedule: (id: string) => void;
}

const ManageSchedulesDialog = ({
  open,
  onOpenChange,
  savedSchedules,
  createNewSchedule,
  loadSchedule,
  deleteSchedule
}: ManageSchedulesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon name="FolderOpen" size={28} className="text-primary" />
            Мои расписания
          </DialogTitle>
          <DialogDescription>
            Управляйте сохранёнными расписаниями форума
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Button
            onClick={() => {
              createNewSchedule();
              onOpenChange(false);
            }}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Создать новое расписание
          </Button>

          {savedSchedules.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  У вас пока нет сохранённых расписаний
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {savedSchedules.map((schedule) => {
                const totalEvents = Object.values(schedule.selectedEvents).reduce((sum, events) => sum + events.length, 0);
                const totalDuration = schedule.schedule.reduce((sum, item) => sum + item.event.duration, 0);
                
                return (
                  <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{schedule.name}</CardTitle>
                          <CardDescription className="mt-1">
                            Создано: {new Date(schedule.createdAt).toLocaleString('ru-RU')}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              loadSchedule(schedule.id);
                              onOpenChange(false);
                            }}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <Icon name="Eye" size={18} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteSchedule(schedule.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Icon name="Trash2" size={18} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 flex-wrap">
                        <Badge variant="outline" className="gap-1">
                          <Icon name="Calendar" size={14} />
                          {totalEvents} мероприятий
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Icon name="Clock" size={14} />
                          {Math.floor(totalDuration / 60)}ч {totalDuration % 60}м
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Icon name="ListChecks" size={14} />
                          {schedule.schedule.length} элементов
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageSchedulesDialog;
