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
	const errorId = useId();

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
					className="block text-sm font-medium text-secondary-700 mb-1.5"
				>
					{label}
					{required && <span className="text-error-500"> *</span>}
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
				aria-describedby={error ? errorId : undefined}
				aria-invalid={error ? "true" : undefined}
				className={`w-full px-4 py-2.5 border rounded-xl transition-interactive focus:outline-none focus:ring-2 focus:border-transparent focus:bg-surface disabled:bg-secondary-50 disabled:text-secondary-400 disabled:cursor-not-allowed ${error ? "border-error-500 focus:ring-error-500 bg-error-50/50" : "border-secondary-200 focus:ring-primary-400 hover:border-secondary-300"}`}
				onChange={handleInput}
			/>
			{error && (
				<p id={errorId} className="mt-1.5 text-sm text-error-600">
					{error}
				</p>
			)}
		</div>
	);
}
