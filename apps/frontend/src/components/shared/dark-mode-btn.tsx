import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "../theme-provider";
import { Button } from "../ui/button";

export default function DarkModeBtn() {
    
  const { theme, setTheme } = useTheme()
    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")
    
  return (
    // Dark mode toggle 
      <Button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="relative flex cursor-pointer items-center justify-center bg-background hover:bg-secondary text-foreground"
      >
        <IconSun
          className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
          stroke={1.5}
          size={24}
        />
        <IconMoon
          className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
          stroke={1.5}
          size={24}
        />
      </Button>
  )
}
