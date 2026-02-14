"use client";

import { useId } from "react";

interface BaseInputProps {
	value: string | number;
	onChange: (value: string | number) => void;
	type?: "text" | "number" | "email" | "password" | "date";
	label?: string;
	placeholder?: string;
	error?: string;
	disabled?: boolean;
	required?: boolean;
	min?: string | number;
	max?: string | number;
	step?: string | number;
}

export default function BaseInput({
	value,
	onChange,
	type = "text",
	label,
	placeholder,
	error,
	disabled = false,
	required = false,
	min,
	max,
	step,
}: BaseInputProps) {
	const inputId = useId();

	function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
		const val =
			type === "number" ? Number(event.target.value) : event.target.value;
		onChange(val);
	}

	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={inputId}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{label}
					{required && <span className="text-red-500"> *</span>}
				</label>
			)}
			<input
				id={inputId}
				type={type}
				value={value}
				placeholder={placeholder}
				disabled={disabled}
				required={required}
				min={min}
				max={max}
				step={step}
				className={`w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
				onChange={handleInput}
			/>
			{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
		</div>
	);
}
