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
			className={`bg-white rounded-xl border border-gray-200 ${paddingClasses[padding]} ${shadow ? "shadow-sm" : ""} ${hover ? "transition-shadow hover:shadow-md cursor-pointer" : ""} ${className}`}
		>
			{children}
		</div>
	);
}
