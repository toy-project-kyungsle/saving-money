"use client";

import { useId } from "react";

interface BaseSelectProps {
	value: string | number | null;
	onChange: (value: string | number | null) => void;
	label?: string;
	placeholder?: string;
	error?: string;
	disabled?: boolean;
	required?: boolean;
	children: React.ReactNode;
}

export default function BaseSelect({
	value,
	onChange,
	label,
	error,
	disabled = false,
	required = false,
	children,
}: BaseSelectProps) {
	const selectId = useId();
	const errorId = useId();

	function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
		const val = event.target.value;
		const numValue = Number(val);
		if (val !== "" && !Number.isNaN(numValue)) {
			onChange(numValue);
		} else {
			onChange(val === "" ? null : val);
		}
	}

	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={selectId}
					className="block text-sm font-medium text-secondary-700 mb-1.5"
				>
					{label}
					{required && <span className="text-error-500"> *</span>}
				</label>
			)}
			<div className="relative">
				<select
					id={selectId}
					value={value ?? ""}
					disabled={disabled}
					required={required}
					aria-describedby={error ? errorId : undefined}
					aria-invalid={error ? "true" : undefined}
					className={`w-full px-4 py-2.5 border rounded-xl transition-interactive focus:outline-none focus:ring-2 focus:border-transparent appearance-none bg-white pr-10 disabled:bg-secondary-50 disabled:text-secondary-400 disabled:cursor-not-allowed ${error ? "border-error-500 focus:ring-error-500 bg-error-50/50" : "border-secondary-200 focus:ring-primary-400 hover:border-secondary-300"}`}
					onChange={handleChange}
				>
					{children}
				</select>
				<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
					<svg
						className="h-4.5 w-4.5 text-secondary-400"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 20"
						aria-hidden="true"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
							d="M6 8l4 4 4-4"
						/>
					</svg>
				</div>
			</div>
			{error && (
				<p id={errorId} className="mt-1.5 text-sm text-error-600">
					{error}
				</p>
			)}
		</div>
	);
}
