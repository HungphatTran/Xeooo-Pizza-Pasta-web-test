import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-white">Đã Xảy Ra Lỗi Bất Ngờ</h2>
              <p className="text-xs text-stone-400 leading-relaxed">
                Hệ thống Xéooo Pizza & Pasta đã ghi nhận sự cố này. Dữ liệu đặt bàn và hóa đơn của bạn vẫn được bảo toàn an toàn trong bộ nhớ máy.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-stone-900 rounded-lg text-left text-xs font-mono text-rose-300 max-h-32 overflow-y-auto border border-stone-800">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Thử Phục Hồi Lại</span>
              </button>
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-stone-300 hover:bg-stone-800 rounded-xl transition border border-stone-700 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Tải Lại Ứng Dụng</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
