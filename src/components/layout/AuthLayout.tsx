interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-primary-50/60 via-surface-subtle to-surface-subtle flex flex-col items-center justify-center px-4">
			{/* Logo */}
			<div className="mb-10 text-center animate-fadeInUp">
				<div className="w-18 h-18 bg-gradient-to-br from-primary to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
					<svg
						className="w-10 h-10 text-white"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h1 className="text-2xl font-bold text-secondary-900 tracking-tight">
					저축 관리
				</h1>
				<p className="text-secondary-500 mt-1.5 text-sm">
					나의 자산을 한눈에
				</p>
			</div>

			{/* Content */}
			<div className="w-full max-w-sm animate-fadeInUp stagger-2">
				{children}
			</div>
		</div>
	);
}
