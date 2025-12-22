import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
      title={theme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
    >
      {theme === 'light' ? (
        <Icon name="Moon" size={20} />
      ) : (
        <Icon name="Sun" size={20} />
      )}
    </Button>
  );
};

export default ThemeToggle;
