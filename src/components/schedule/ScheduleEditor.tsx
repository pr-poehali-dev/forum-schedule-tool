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
          {schedule.map((item, index) => {
            const isCustomItem = item.type !== 'event';
            const customStyle = isCustomItem
              ? item.type === 'meal'
                ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 border-l-8 border-l-emerald-500 shadow-md'
                : item.type === 'break'
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 border-l-8 border-l-amber-500 shadow-md'
                  : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 border-l-8 border-l-blue-500 shadow-md'
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
                  <Icon name="GripVertical" size={20} className="text-gray-400" />
                  {isCustomItem && (
                    <div className="text-2xl">
                      {item.type === 'meal' ? '🍽️' : item.type === 'break' ? '☕' : '🚌'}
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
                          className="px-3 py-1 rounded bg-white hover:bg-gray-50 text-sm font-medium shadow-sm border"
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
                    <h3 className={`font-semibold ${isCustomItem ? 'text-lg' : ''}`}>
                      {item.customTitle || item.event.title}
                    </h3>
                    {item.event.category && (
                      <p className="text-xs text-gray-600">[{item.event.category}]</p>
                    )}
                    {isCustomItem && (
                      <p className="text-xs font-medium mt-1 text-gray-500">
                        {item.type === 'meal' ? '🍴 Прием пищи' : item.type === 'break' ? '☕ Перерыв' : '🚌 Трансфер'}
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
                      className="px-3 py-1 rounded bg-white hover:bg-gray-50 text-sm font-medium shadow-sm border"
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