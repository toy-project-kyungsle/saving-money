/**
 * 입력값 검증 유틸리티
 * 악성 입력 방지 및 데이터 무결성 보장
 */

// 최대 금액 (100억)
const MAX_AMOUNT = 10_000_000_000;

// 카테고리 이름 최대 길이
const MAX_CATEGORY_NAME_LENGTH = 50;

// 설명 최대 길이
const MAX_DESCRIPTION_LENGTH = 200;

/**
 * 금액 검증
 */
export function validateAmount(
	amount: unknown,
): { valid: boolean; error?: string } {
	if (typeof amount !== "number") {
		return { valid: false, error: "금액은 숫자여야 해요" };
	}

	if (Number.isNaN(amount) || !Number.isFinite(amount)) {
		return { valid: false, error: "유효한 숫자가 아니에요" };
	}

	if (amount <= 0) {
		return { valid: false, error: "금액은 0보다 커야 해요" };
	}

	if (amount > MAX_AMOUNT) {
		return {
			valid: false,
			error: `금액은 ${MAX_AMOUNT.toLocaleString()}원을 초과할 수 없어요`,
		};
	}

	if (!Number.isInteger(amount)) {
		return { valid: false, error: "금액은 정수여야 해요" };
	}

	return { valid: true };
}

/**
 * 목표 비중 검증 (0-100%)
 */
export function validateTargetPercent(
	percent: unknown,
): { valid: boolean; error?: string } {
	if (typeof percent !== "number") {
		return { valid: false, error: "비중은 숫자여야 해요" };
	}

	if (Number.isNaN(percent) || !Number.isFinite(percent)) {
		return { valid: false, error: "유효한 숫자가 아니에요" };
	}

	if (percent < 0) {
		return { valid: false, error: "비중은 0% 이상이어야 해요" };
	}

	if (percent > 100) {
		return { valid: false, error: "비중은 100%를 초과할 수 없어요" };
	}

	return { valid: true };
}

/**
 * 카테고리 이름 검증
 */
export function validateCategoryName(
	name: unknown,
): { valid: boolean; error?: string } {
	if (typeof name !== "string") {
		return { valid: false, error: "카테고리 이름은 문자열이어야 해요" };
	}

	const trimmed = name.trim();

	if (trimmed.length === 0) {
		return { valid: false, error: "카테고리 이름을 입력해주세요" };
	}

	if (trimmed.length > MAX_CATEGORY_NAME_LENGTH) {
		return {
			valid: false,
			error: `카테고리 이름은 ${MAX_CATEGORY_NAME_LENGTH}자를 초과할 수 없어요`,
		};
	}

	// 위험한 문자 검사 (기본적인 sanitization)
	if (/<[^>]*>/.test(trimmed)) {
		return { valid: false, error: "HTML 태그는 허용되지 않아요" };
	}

	return { valid: true };
}

/**
 * 설명 검증
 */
export function validateDescription(
	description: unknown,
): { valid: boolean; error?: string } {
	if (
		description === null ||
		description === undefined ||
		description === ""
	) {
		return { valid: true }; // 설명은 선택사항
	}

	if (typeof description !== "string") {
		return { valid: false, error: "설명은 문자열이어야 해요" };
	}

	if (description.length > MAX_DESCRIPTION_LENGTH) {
		return {
			valid: false,
			error: `설명은 ${MAX_DESCRIPTION_LENGTH}자를 초과할 수 없어요`,
		};
	}

	// 위험한 문자 검사
	if (/<[^>]*>/.test(description)) {
		return { valid: false, error: "HTML 태그는 허용되지 않아요" };
	}

	return { valid: true };
}

/**
 * 날짜 검증
 */
export function validateDate(
	date: unknown,
): { valid: boolean; error?: string } {
	if (typeof date !== "string") {
		return { valid: false, error: "날짜는 문자열이어야 해요" };
	}

	// YYYY-MM-DD 형식 검증
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(date)) {
		return {
			valid: false,
			error: "날짜 형식이 올바르지 않아요 (YYYY-MM-DD)",
		};
	}

	// 입력된 년, 월, 일 파싱
	const parts = date.split("-");
	const year = parseInt(parts[0]!, 10);
	const month = parseInt(parts[1]!, 10);
	const day = parseInt(parts[2]!, 10);

	// 월 범위 검증 (1-12)
	if (month < 1 || month > 12) {
		return { valid: false, error: "유효하지 않은 월이에요" };
	}

	// 일 범위 검증 (각 월의 마지막 날 확인)
	const daysInMonth = new Date(year, month, 0).getDate();
	if (day < 1 || day > daysInMonth) {
		return { valid: false, error: "유효하지 않은 날짜예요" };
	}

	const parsedDate = new Date(year, month - 1, day);
	if (Number.isNaN(parsedDate.getTime())) {
		return { valid: false, error: "유효하지 않은 날짜예요" };
	}

	// 미래 날짜 제한 (1년 후까지만 허용)
	const maxDate = new Date();
	maxDate.setFullYear(maxDate.getFullYear() + 1);
	if (parsedDate > maxDate) {
		return { valid: false, error: "너무 먼 미래의 날짜예요" };
	}

	// 과거 날짜 제한 (10년 전까지만 허용)
	const minDate = new Date();
	minDate.setFullYear(minDate.getFullYear() - 10);
	if (parsedDate < minDate) {
		return { valid: false, error: "너무 오래된 날짜예요" };
	}

	return { valid: true };
}

/**
 * 색상 코드 검증
 */
export function validateColor(
	color: unknown,
): { valid: boolean; error?: string } {
	if (typeof color !== "string") {
		return { valid: false, error: "색상은 문자열이어야 해요" };
	}

	// HEX 색상 코드 검증 (#RGB 또는 #RRGGBB)
	const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
	if (!hexRegex.test(color)) {
		return {
			valid: false,
			error: "유효한 색상 코드가 아니에요 (예: #FF0000)",
		};
	}

	return { valid: true };
}

/**
 * 이메일 검증
 */
export function validateEmail(
	email: unknown,
): { valid: boolean; error?: string } {
	if (typeof email !== "string") {
		return { valid: false, error: "이메일은 문자열이어야 해요" };
	}

	const trimmed = email.trim();

	if (trimmed.length === 0) {
		return { valid: false, error: "이메일을 입력해주세요" };
	}

	// 기본적인 이메일 형식 검증
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(trimmed)) {
		return { valid: false, error: "유효한 이메일 형식이 아니에요" };
	}

	if (trimmed.length > 254) {
		return { valid: false, error: "이메일이 너무 길어요" };
	}

	return { valid: true };
}

/**
 * 비밀번호 검증
 */
export function validatePassword(
	password: unknown,
): { valid: boolean; error?: string } {
	if (typeof password !== "string") {
		return { valid: false, error: "비밀번호는 문자열이어야 해요" };
	}

	if (password.length === 0) {
		return { valid: false, error: "비밀번호를 입력해주세요" };
	}

	if (password.length < 6) {
		return { valid: false, error: "비밀번호는 6자 이상이어야 해요" };
	}

	if (password.length > 128) {
		return { valid: false, error: "비밀번호가 너무 길어요" };
	}

	return { valid: true };
}

/**
 * HTML 이스케이프 (XSS 방지)
 */
export function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * 저축 입력 전체 검증
 */
export function validateSavingInput(input: {
	category_id?: unknown;
	amount?: unknown;
	transaction_date?: unknown;
	description?: unknown;
}): { valid: boolean; errors: Record<string, string> } {
	const errors: Record<string, string> = {};

	if (input.category_id === undefined || input.category_id === null) {
		errors.category_id = "카테고리를 선택해주세요";
	} else if (
		typeof input.category_id !== "number" ||
		!Number.isInteger(input.category_id)
	) {
		errors.category_id = "유효하지 않은 카테고리예요";
	}

	const amountResult = validateAmount(input.amount);
	if (!amountResult.valid) {
		errors.amount = amountResult.error!;
	}

	if (input.transaction_date) {
		const dateResult = validateDate(input.transaction_date);
		if (!dateResult.valid) {
			errors.transaction_date = dateResult.error!;
		}
	}

	if (input.description) {
		const descResult = validateDescription(input.description);
		if (!descResult.valid) {
			errors.description = descResult.error!;
		}
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors,
	};
}

/**
 * 카테고리 입력 전체 검증
 */
export function validateCategoryInput(input: {
	name?: unknown;
	type?: unknown;
	target_percent?: unknown;
	color?: unknown;
}): { valid: boolean; errors: Record<string, string> } {
	const errors: Record<string, string> = {};

	const nameResult = validateCategoryName(input.name);
	if (!nameResult.valid) {
		errors.name = nameResult.error!;
	}

	if (input.type !== "savings" && input.type !== "investment") {
		errors.type = "유효하지 않은 카테고리 타입이에요";
	}

	if (input.target_percent !== undefined) {
		const percentResult = validateTargetPercent(input.target_percent);
		if (!percentResult.valid) {
			errors.target_percent = percentResult.error!;
		}
	}

	if (input.color) {
		const colorResult = validateColor(input.color);
		if (!colorResult.valid) {
			errors.color = colorResult.error!;
		}
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors,
	};
}
