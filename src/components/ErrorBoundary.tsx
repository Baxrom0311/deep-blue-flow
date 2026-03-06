import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 text-red-500">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-foreground mb-3 font-display">Tizimda xatolik yuz berdi</h2>
                    <p className="text-muted-foreground mb-8 max-w-md">
                        Iltimos, sahifani yangilang yoki xatolik haqida bizga xabar bering. Noqulaylik uchun uzr so'raymiz.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
                    >
                        <RefreshCcw size={18} />
                        Sahifani yangilash
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
