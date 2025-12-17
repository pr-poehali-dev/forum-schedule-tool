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
      <Card className="bg-white shadow-xl">
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
          {schedule.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`p-4 rounded-xl border-2 cursor-move transition-all ${
                item.type === 'event'
                  ? `${getDurationColor(item.event.duration).bg} ${getDurationColor(item.event.duration).border} hover:border-opacity-100`
                  : item.type === 'meal'
                  ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
                  : item.type === 'break'
                  ? 'bg-amber-50 border-amber-200 hover:border-amber-400'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-400'
              } ${draggedIndex === index ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <Icon name="GripVertical" size={20} className="text-gray-400" />
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
                        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                      >
                        {item.startTime}
                      </button>
                    </>
                  )}
                  <span className="text-sm text-gray-500">—</span>
                  <span className="text-sm font-medium">
                    {addMinutes(item.startTime, item.event.duration)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.customTitle || item.event.title}</h3>
                  {item.event.category && (
                    <p className="text-xs text-gray-600">[{item.event.category}]</p>
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
                    className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                  >
                    {item.event.duration} мин
                  </button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Icon name="Trash2" size={18} />
                </Button>
              </div>
            </div>
          ))}
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
          className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
        >
          Сформировать расписание
          <Icon name="Sparkles" size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ScheduleEditor;
