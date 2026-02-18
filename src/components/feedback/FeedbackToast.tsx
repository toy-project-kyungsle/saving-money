"use client";

import { useCallback, useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
	id: string;
	type: ToastType;
	message: string;
}

interface ToastItemProps {
	toast: ToastMessage;
	onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onDismiss(toast.id);
		}, 2000);
		return () => clearTimeout(timer);
	}, [toast.id, onDismiss]);

	const bgClass =
		toast.type === "success"
			? "bg-success-600"
			: toast.type === "error"
				? "bg-error-600"
				: "bg-primary";

	const iconPath =
		toast.type === "success"
			? "M5 13l4 4L19 7"
			: toast.type === "error"
				? "M6 18L18 6M6 6l12 12"
				: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";

	return (
		<div
			className={`${bgClass} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px] max-w-sm animate-slideUp`}
			role="status"
			aria-live="polite"
		>
			<svg
				className="w-5 h-5 shrink-0"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d={iconPath}
				/>
			</svg>
			<span className="text-sm font-medium">{toast.message}</span>
		</div>
	);
}

// --- Toast Context & Hook ---

import { createContext, useContext } from "react";

type ShowToastFn = (type: ToastType, message: string) => void;

const ToastContext = createContext<ShowToastFn | null>(null);

export function useToast(): ShowToastFn {
	const ctx = useContext(ToastContext);
	if (!ctx) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const showToast = useCallback<ShowToastFn>((type, message) => {
		const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
		setToasts((prev) => [...prev, { id, type, message }]);
	}, []);

	const dismissToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={showToast}>
			{children}
			{/* Toast container */}
			{toasts.length > 0 && (
				<div
					className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2"
					aria-label="알림"
				>
					{toasts.map((toast) => (
						<ToastItem
							key={toast.id}
							toast={toast}
							onDismiss={dismissToast}
						/>
					))}
				</div>
			)}
		</ToastContext.Provider>
	);
}
