import { createContext, useEffect, useState } from "react";

const ThemeContext = createContext();

function ThemeProvider({children}) {
    const [theme, setTheme] = useState(() => {
      const data = localStorage.getItem("theme")
      return data ? data : '';
    });
    const themeContext = {
        theme,
        setTheme
    }
return (
    <ThemeContext.Provider value={themeContext}>
    {children}
    </ThemeContext.Provider>
)
}

export {ThemeContext, ThemeProvider}