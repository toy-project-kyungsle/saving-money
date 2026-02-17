"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

interface BaseModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	size?: "sm" | "md" | "lg";
	children: React.ReactNode;
	footer?: React.ReactNode;
}

const sizeClasses = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
};

export default function BaseModal({
	open,
	onClose,
	title,
	size = "md",
	children,
	footer,
}: BaseModalProps) {
	const handleKeydown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Escape" && open) {
				onClose();
			}
		},
		[open, onClose],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeydown);
		return () => {
			document.removeEventListener("keydown", handleKeydown);
		};
	}, [handleKeydown]);

	function handleBackdropClick(event: React.MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	if (!open) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/60 backdrop-blur-sm animate-fadeIn"
			onClick={handleBackdropClick}
		>
			<div
				className={`relative w-full bg-surface-raised rounded-2xl shadow-modal animate-slideUp ${sizeClasses[size]}`}
			>
				{/* Header */}
				{title && (
					<div className="flex items-center justify-between px-6 py-4 border-b border-secondary-100">
						<h3 className="text-lg font-semibold text-gray-900">
							{title}
						</h3>
						<button
							type="button"
							className="p-1.5 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 transition-interactive focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
							aria-label="닫기"
							onClick={onClose}
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				)}

				{/* Body */}
				<div className="px-6 py-4">{children}</div>

				{/* Footer */}
				{footer && (
					<div className="px-6 py-4 border-t border-secondary-100 bg-surface-subtle rounded-b-2xl">
						{footer}
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
}
