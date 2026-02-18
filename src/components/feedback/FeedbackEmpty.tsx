interface FeedbackEmptyProps {
	title?: string;
	description?: string;
	icon?: "inbox" | "search" | "document";
	action?: React.ReactNode;
}

const icons = {
	inbox: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
	search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
	document:
		"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
};

export default function FeedbackEmpty({
	title = "아직 데이터가 없어요",
	description,
	icon = "inbox",
	action,
}: FeedbackEmptyProps) {
	return (
		<div className="flex flex-col items-center justify-center py-10 text-center">
			<div className="flex items-center justify-center w-14 h-14 mb-4 bg-secondary-50 rounded-full">
				<svg
					className="w-7 h-7 text-secondary-300"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d={icons[icon]}
					/>
				</svg>
			</div>
			<h3 className="text-lg font-semibold text-secondary-900 mb-1">{title}</h3>
			{description && (
				<p className="text-sm text-secondary-400">{description}</p>
			)}
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}
