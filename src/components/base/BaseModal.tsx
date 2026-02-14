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
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn"
			onClick={handleBackdropClick}
		>
			<div
				className={`relative w-full bg-white rounded-xl shadow-xl animate-scaleIn ${sizeClasses[size]}`}
			>
				{/* Header */}
				{title && (
					<div className="flex items-center justify-between px-6 py-4 border-b">
						<h3 className="text-lg font-semibold text-gray-900">
							{title}
						</h3>
						<button
							type="button"
							className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
							aria-label="닫기"
							onClick={onClose}
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
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
					<div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">
						{footer}
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
}
