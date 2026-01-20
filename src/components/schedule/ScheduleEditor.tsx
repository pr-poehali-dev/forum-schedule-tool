import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { ScheduleItem, getDurationColor, addMinutes } from './types';

interface ScheduleEditorProps {
  schedule: ScheduleItem[];
  editingTime: string | null;
  tempTime: string;
  editingDuration: string | null;
  tempDuration: number;
  draggedIndex: number | null;
  setEditingTime: (id: string | null) => void;
  setTempTime: (time: string) => void;
  setEditingDuration: (id: string | null) => void;
  setTempDuration: (duration: number) => void;
  updateStartTime: (id: string, newTime: string) => void;
  updateDuration: (id: string, newDuration: number) => void;
  removeItem: (id: string) => void;
  handleDragStart: (index: number) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDragEnd: () => void;
  setAddDialog: (open: boolean) => void;
  setStep: (step: 'selection' | 'editing' | 'final') => void;
}

const ScheduleEditor = ({
  schedule,
  editingTime,
  tempTime,
  editingDuration,
  tempDuration,
  draggedIndex,
  setEditingTime,
  setTempTime,
  setEditingDuration,
  setTempDuration,
  updateStartTime,
  updateDuration,
  removeItem,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  setAddDialog,
  setStep
}: ScheduleEditorProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-card shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Редактирование расписания</CardTitle>
              <CardDescription>Измените время, порядок или добавьте перерывы</CardDescription>
            </div>
            <Button onClick={() => setAddDialog(true)} className="gap-2">
              <Icon name="Plus" size={18} />
              Добавить элемент
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {schedule.map((item, index) => {
            const isCustomItem = item.type !== 'event';
            const isMeal = item.type === 'meal';
            const customStyle = isCustomItem
              ? item.type === 'meal'
                ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/50 dark:border-emerald-400/50 border-2 shadow-lg ring-2 ring-emerald-500/20 dark:ring-emerald-400/20'
                : item.type === 'break'
                  ? 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/30 dark:border-purple-400/30 border-2 shadow-md'
                  : 'bg-primary/10 border-primary/30 border-l-8 border-l-primary shadow-md'
              : '';
            
            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-4 rounded-xl border-2 cursor-move transition-all ${
                  isCustomItem
                    ? customStyle
                    : `${getDurationColor(item.event.duration).bg} ${getDurationColor(item.event.duration).border} hover:border-opacity-100`
                } ${draggedIndex === index ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <Icon name="GripVertical" size={20} className="text-muted-foreground" />
                  {isCustomItem && (
                    <div className={`text-2xl ${isMeal ? 'text-3xl' : ''}`}>
                      {item.type === 'meal' ? '🍽️' : item.type === 'break' ? '⏸️' : '🚌'}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {editingTime === item.id ? (
                      <>
                        <Input
                          type="time"
                          value={tempTime}
                          onChange={(e) => setTempTime(e.target.value)}
                          className="w-32"
                          autoFocus
                          onBlur={() => {
                            updateStartTime(item.id, tempTime);
                            setEditingTime(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateStartTime(item.id, tempTime);
                              setEditingTime(null);
                            }
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingTime(item.id);
                            setTempTime(item.startTime);
                          }}
                          className="px-3 py-1 rounded bg-card hover:bg-muted text-sm font-medium shadow-sm border dark:bg-slate-700 dark:text-white dark:border-slate-600"
                        >
                          {item.startTime}
                        </button>
                      </>
                    )}
                    <span className="text-sm text-muted-foreground dark:text-slate-400">—</span>
                    <span className="text-sm font-medium dark:text-white">
                      {addMinutes(item.startTime, item.event.duration)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${isMeal ? 'text-xl text-emerald-600 dark:text-emerald-400' : isCustomItem ? 'text-lg dark:text-foreground' : 'dark:text-foreground'}`}>
                      {item.customTitle || item.event.title}
                    </h3>
                    {item.event.category && (
                      <p className="text-xs text-muted-foreground dark:text-slate-400">[{item.event.category}]</p>
                    )}
                    {isCustomItem && (
                      <p className={`text-xs font-medium mt-1 ${isMeal ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                        {item.type === 'meal' ? '🍴 Прием пищи' : item.type === 'break' ? '⏸️ Дополнительный элемент' : '🚌 Трансфер'}
                      </p>
                    )}
                  </div>
                  {editingDuration === item.id ? (
                    <Input
                      type="number"
                      value={tempDuration}
                      onChange={(e) => setTempDuration(Number(e.target.value))}
                      className="w-20"
                      min="1"
                      autoFocus
                      onBlur={() => {
                        updateDuration(item.id, tempDuration);
                        setEditingDuration(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateDuration(item.id, tempDuration);
                          setEditingDuration(null);
                        }
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setEditingDuration(item.id);
                        setTempDuration(item.event.duration);
                      }}
                      className="px-3 py-1 rounded bg-card hover:bg-muted text-sm font-medium shadow-sm border dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    >
                      {item.event.duration} мин
                    </button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Icon name="Trash2" size={18} />
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => setStep('selection')}
          className="gap-2"
        >
          <Icon name="ArrowLeft" size={18} />
          Назад к выбору
        </Button>
        <Button
          onClick={() => setStep('final')}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          Сформировать расписание
          <Icon name="Sparkles" size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ScheduleEditor;