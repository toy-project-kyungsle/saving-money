interface BaseCardProps {
	padding?: "none" | "sm" | "md" | "lg";
	shadow?: boolean;
	hover?: boolean;
	className?: string;
	children: React.ReactNode;
}

const paddingClasses = {
	none: "",
	sm: "p-3",
	md: "p-4 sm:p-6",
	lg: "p-6 sm:p-8",
};

export default function BaseCard({
	padding = "md",
	shadow = true,
	hover = false,
	className = "",
	children,
}: BaseCardProps) {
	return (
		<div
			className={`bg-surface-raised rounded-2xl border border-secondary-100 ${paddingClasses[padding]} ${shadow ? "shadow-card" : ""} ${hover ? "hover-lift cursor-pointer" : ""} ${className}`}
		>
			{children}
		</div>
	);
}
