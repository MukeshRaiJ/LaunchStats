import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "./ThemeContext";

export const ThemeSwitcher: React.FC = () => {
  const { isDarkMode, setIsDarkMode, colors } = useTheme();

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-4 right-4 flex items-center space-x-2 z-50 ${colors.glassBg} p-2 rounded-full border ${colors.border}`}
    >
      <Sun className={`h-4 w-4 ${colors.subText}`} />
      <Switch
        checked={isDarkMode}
        onCheckedChange={setIsDarkMode}
        className="data-[state=checked]:bg-blue-600"
      />
      <Moon className={`h-4 w-4 ${colors.subText}`} />
    </motion.div>
  );
};
