import { AuthProvider } from "../context/AuthContext";
import { MessageProvider } from "../context/MessageContext";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <MessageProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </MessageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
