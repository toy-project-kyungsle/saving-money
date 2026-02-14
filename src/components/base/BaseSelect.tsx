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
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{label}
					{required && <span className="text-red-500"> *</span>}
				</label>
			)}
			<select
				id={selectId}
				value={value ?? ""}
				disabled={disabled}
				required={required}
				className={`w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white bg-[url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20fill='none'%20viewBox='0%200%2020%2020'%3e%3cpath%20stroke='%236b7280'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke-width='1.5'%20d='M6%208l4%204%204-4'/%3e%3c/svg%3e")] bg-[position:right_0.5rem_center] bg-[size:1.5em_1.5em] bg-no-repeat pr-10 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
				onChange={handleChange}
			>
				{children}
			</select>
			{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
		</div>
	);
}
