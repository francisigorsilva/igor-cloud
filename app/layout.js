import "./globals.css";
import "highlight.js/styles/github-dark.css";
export const metadata = {
  title: "IGOR CLOUD",
  description: "Seu espaço pessoal de armazenamento em nuvem."
};
export default function RootLayout({ children }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}