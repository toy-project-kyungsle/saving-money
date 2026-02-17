"use client";

interface BaseButtonProps {
	variant?: "primary" | "secondary" | "danger" | "ghost";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	loading?: boolean;
	type?: "button" | "submit" | "reset";
	className?: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	children: React.ReactNode;
}

const variantClasses = {
	primary:
		"bg-primary text-white hover:bg-primary-700 focus:ring-primary-400 shadow-sm hover:shadow-md",
	secondary:
		"bg-secondary-100 text-secondary-800 hover:bg-secondary-200 focus:ring-secondary-300",
	danger:
		"bg-error-600 text-white hover:bg-error-700 focus:ring-error-500",
	ghost:
		"bg-transparent text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-300",
};

const sizeClasses = {
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-2 text-base",
	lg: "px-6 py-3 text-lg",
};

export default function BaseButton({
	variant = "primary",
	size = "md",
	disabled = false,
	loading = false,
	type = "button",
	className = "",
	onClick,
	children,
}: BaseButtonProps) {
	function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
		if (!disabled && !loading && onClick) {
			onClick(event);
		}
	}

	return (
		<button
			type={type}
			disabled={disabled || loading}
			className={`inline-flex items-center justify-center font-medium rounded-xl transition-interactive focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
			onClick={handleClick}
		>
			{loading && (
				<svg
					className="animate-spin -ml-1 mr-2 h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<circle
						className="opacity-20"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-80"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			)}
			{children}
		</button>
	);
}
