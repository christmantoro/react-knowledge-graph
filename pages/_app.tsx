import "../styles/globals.css";
import type { AppProps } from "next/app";
import "../KnowledgeGraph/index.css";
import { ToastProvider } from "../components/ui/toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  );
}

export default MyApp;