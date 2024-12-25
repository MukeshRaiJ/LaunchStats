import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "./ThemeContext";

export const ThemeSwitcher = () => {
  const { isDarkMode, setIsDarkMode, colors } = useTheme();

  return (
    <div
      className={`fixed top-4 right-4 flex items-center space-x-2 z-50 ${colors.glassBg} p-2 rounded-full border ${colors.border}`}
    >
      <Sun className={`h-4 w-4 ${colors.subText}`} />
      <Switch
        checked={isDarkMode}
        onCheckedChange={setIsDarkMode}
        className="data-[state=checked]:bg-blue-600"
      />
      <Moon className={`h-4 w-4 ${colors.subText}`} />
    </div>
  );
};
