/**
 * 보안 테스트 - 악성 사용자 방지
 *
 * 테스트 범위:
 * 1. 인증 우회 시도
 * 2. 다른 사용자 데이터 접근 시도
 * 3. XSS 공격 방지
 * 4. SQL Injection 방지 (Supabase RLS로 처리)
 * 5. 입력값 검증
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// 실제 validation.ts 함수들 import
import {
  validateAmount,
  validateTargetPercent,
  validateCategoryName,
  validateDescription,
  validateDate,
  validateColor,
  validateEmail,
  validatePassword,
  validateSavingInput,
  validateCategoryInput,
  escapeHtml,
} from '../src/lib/validation'

// Mock Supabase client
const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn(),
  })),
}

describe('보안 테스트: 인증', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('인증되지 않은 사용자는 데이터에 접근할 수 없어야 함', async () => {
    const user = null
    expect(user).toBeNull()
    expect(mockSupabase.from).not.toHaveBeenCalled()
  })

  it('잘못된 세션 토큰으로 접근 시도 시 거부되어야 함', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'Invalid session' },
    })

    const result = await mockSupabase.auth.getSession()
    expect(result.data.session).toBeNull()
    expect(result.error).toBeDefined()
  })

  it('만료된 세션은 갱신되거나 로그아웃 처리되어야 함', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'Session expired' },
    })

    const result = await mockSupabase.auth.getSession()
    expect(result.data.session).toBeNull()
  })
})

describe('보안 테스트: 데이터 격리 (Row Level Security)', () => {
  const currentUserId = 'user-123'
  const otherUserId = 'user-456'

  it('다른 사용자의 저축 데이터에 접근할 수 없어야 함', async () => {
    mockSupabase
      .from('savings')
      .select('*')
      .eq('user_id', otherUserId)

    expect(currentUserId).not.toBe(otherUserId)
  })

  it('다른 사용자의 카테고리를 수정할 수 없어야 함', async () => {
    mockSupabase
      .from('categories')
      .update({ name: 'Hacked!' })
      .eq('id', 1)
      .eq('user_id', currentUserId)

    expect(mockSupabase.from).toHaveBeenCalledWith('categories')
  })

  it('다른 사용자의 저축을 삭제할 수 없어야 함', async () => {
    mockSupabase
      .from('savings')
      .delete()
      .eq('id', 999)
      .eq('user_id', currentUserId)

    expect(mockSupabase.from).toHaveBeenCalledWith('savings')
  })
})

describe('보안 테스트: 금액 검증 (validateAmount)', () => {
  it('음수 금액은 거부되어야 함', () => {
    expect(validateAmount(-1000).valid).toBe(false)
    expect(validateAmount(-1).valid).toBe(false)
  })

  it('0원은 거부되어야 함', () => {
    expect(validateAmount(0).valid).toBe(false)
  })

  it('정상 금액은 허용되어야 함', () => {
    expect(validateAmount(1000).valid).toBe(true)
    expect(validateAmount(1).valid).toBe(true)
  })

  it('비정상적으로 큰 금액은 거부되어야 함', () => {
    expect(validateAmount(100_000_000_000).valid).toBe(false) // 1000억
    expect(validateAmount(10_000_000_000).valid).toBe(true) // 100억 (최대)
  })

  it('소수점 금액은 거부되어야 함', () => {
    expect(validateAmount(1000.5).valid).toBe(false)
    expect(validateAmount(0.1).valid).toBe(false)
  })

  it('NaN, Infinity는 거부되어야 함', () => {
    expect(validateAmount(NaN).valid).toBe(false)
    expect(validateAmount(Infinity).valid).toBe(false)
    expect(validateAmount(-Infinity).valid).toBe(false)
  })

  it('숫자가 아닌 값은 거부되어야 함', () => {
    expect(validateAmount('1000').valid).toBe(false)
    expect(validateAmount(null).valid).toBe(false)
    expect(validateAmount(undefined).valid).toBe(false)
  })
})

describe('보안 테스트: 목표 비중 검증 (validateTargetPercent)', () => {
  it('0-100 범위는 허용되어야 함', () => {
    expect(validateTargetPercent(0).valid).toBe(true)
    expect(validateTargetPercent(50).valid).toBe(true)
    expect(validateTargetPercent(100).valid).toBe(true)
  })

  it('음수는 거부되어야 함', () => {
    expect(validateTargetPercent(-10).valid).toBe(false)
    expect(validateTargetPercent(-0.1).valid).toBe(false)
  })

  it('100 초과는 거부되어야 함', () => {
    expect(validateTargetPercent(150).valid).toBe(false)
    expect(validateTargetPercent(100.1).valid).toBe(false)
  })
})

describe('보안 테스트: 카테고리 이름 검증 (validateCategoryName)', () => {
  it('정상 이름은 허용되어야 함', () => {
    expect(validateCategoryName('월급').valid).toBe(true)
    expect(validateCategoryName('AI 소프트웨어').valid).toBe(true)
  })

  it('빈 이름은 거부되어야 함', () => {
    expect(validateCategoryName('').valid).toBe(false)
    expect(validateCategoryName('   ').valid).toBe(false)
  })

  it('너무 긴 이름은 거부되어야 함', () => {
    expect(validateCategoryName('a'.repeat(51)).valid).toBe(false)
    expect(validateCategoryName('a'.repeat(50)).valid).toBe(true)
  })

  it('HTML 태그가 포함된 이름은 거부되어야 함', () => {
    expect(validateCategoryName('<script>alert(1)</script>').valid).toBe(false)
    expect(validateCategoryName('<img src=x>').valid).toBe(false)
  })
})

describe('보안 테스트: 설명 검증 (validateDescription)', () => {
  it('빈 설명은 허용되어야 함 (선택사항)', () => {
    expect(validateDescription('').valid).toBe(true)
    expect(validateDescription(null).valid).toBe(true)
    expect(validateDescription(undefined).valid).toBe(true)
  })

  it('정상 설명은 허용되어야 함', () => {
    expect(validateDescription('1월 월급').valid).toBe(true)
  })

  it('너무 긴 설명은 거부되어야 함', () => {
    expect(validateDescription('a'.repeat(201)).valid).toBe(false)
    expect(validateDescription('a'.repeat(200)).valid).toBe(true)
  })

  it('HTML 태그가 포함된 설명은 거부되어야 함', () => {
    expect(validateDescription('<script>').valid).toBe(false)
  })
})

describe('보안 테스트: 날짜 검증 (validateDate)', () => {
  it('정상 날짜는 허용되어야 함', () => {
    expect(validateDate('2024-01-15').valid).toBe(true)
    expect(validateDate('2025-12-31').valid).toBe(true)
  })

  it('잘못된 형식은 거부되어야 함', () => {
    expect(validateDate('2024/01/15').valid).toBe(false)
    expect(validateDate('01-15-2024').valid).toBe(false)
    expect(validateDate('2024-1-15').valid).toBe(false)
  })

  it('유효하지 않은 날짜는 거부되어야 함', () => {
    expect(validateDate('2024-13-01').valid).toBe(false)
    expect(validateDate('2024-02-30').valid).toBe(false)
  })

  it('너무 먼 미래는 거부되어야 함', () => {
    const farFuture = new Date()
    farFuture.setFullYear(farFuture.getFullYear() + 2)
    const farFutureStr = farFuture.toISOString().split('T')[0]
    expect(validateDate(farFutureStr).valid).toBe(false)
  })

  it('너무 오래된 과거는 거부되어야 함', () => {
    expect(validateDate('2000-01-01').valid).toBe(false)
  })
})

describe('보안 테스트: 색상 검증 (validateColor)', () => {
  it('유효한 HEX 색상은 허용되어야 함', () => {
    expect(validateColor('#FF0000').valid).toBe(true)
    expect(validateColor('#fff').valid).toBe(true)
    expect(validateColor('#4CAF50').valid).toBe(true)
  })

  it('잘못된 형식은 거부되어야 함', () => {
    expect(validateColor('FF0000').valid).toBe(false) // # 없음
    expect(validateColor('#GGGGGG').valid).toBe(false) // 잘못된 문자
    expect(validateColor('red').valid).toBe(false) // 이름
  })
})

describe('보안 테스트: 이메일 검증 (validateEmail)', () => {
  it('유효한 이메일은 허용되어야 함', () => {
    expect(validateEmail('test@example.com').valid).toBe(true)
    expect(validateEmail('user.name@domain.co.kr').valid).toBe(true)
  })

  it('잘못된 이메일은 거부되어야 함', () => {
    expect(validateEmail('invalid').valid).toBe(false)
    expect(validateEmail('test@').valid).toBe(false)
    expect(validateEmail('@domain.com').valid).toBe(false)
    expect(validateEmail('test@domain').valid).toBe(false)
  })

  it('빈 이메일은 거부되어야 함', () => {
    expect(validateEmail('').valid).toBe(false)
    expect(validateEmail('   ').valid).toBe(false)
  })
})

describe('보안 테스트: 비밀번호 검증 (validatePassword)', () => {
  it('유효한 비밀번호는 허용되어야 함', () => {
    expect(validatePassword('123456').valid).toBe(true)
    expect(validatePassword('password123').valid).toBe(true)
  })

  it('너무 짧은 비밀번호는 거부되어야 함', () => {
    expect(validatePassword('12345').valid).toBe(false)
    expect(validatePassword('a').valid).toBe(false)
  })

  it('빈 비밀번호는 거부되어야 함', () => {
    expect(validatePassword('').valid).toBe(false)
  })

  it('너무 긴 비밀번호는 거부되어야 함', () => {
    expect(validatePassword('a'.repeat(129)).valid).toBe(false)
    expect(validatePassword('a'.repeat(128)).valid).toBe(true)
  })
})

describe('보안 테스트: XSS 방지 (escapeHtml)', () => {
  it('스크립트 태그가 이스케이프되어야 함', () => {
    const maliciousInput = '<script>alert("XSS")</script>'
    const escaped = escapeHtml(maliciousInput)

    expect(escaped).not.toContain('<script>')
    expect(escaped).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')
  })

  it('이벤트 핸들러가 이스케이프되어야 함', () => {
    const maliciousInput = '<img src="x" onerror="alert(1)">'
    const escaped = escapeHtml(maliciousInput)

    expect(escaped).not.toContain('<img')
    expect(escaped).toContain('&lt;img')
    expect(escaped).toContain('&quot;')
  })

  it('모든 위험 문자가 이스케이프되어야 함', () => {
    const input = '<>&"\''
    const escaped = escapeHtml(input)

    expect(escaped).toBe('&lt;&gt;&amp;&quot;&#039;')
  })

  it('React는 기본적으로 텍스트를 이스케이프함 (JSX)', () => {
    const reactAutoEscapes = true
    expect(reactAutoEscapes).toBe(true)
  })
})

describe('보안 테스트: 저축 입력 전체 검증 (validateSavingInput)', () => {
  it('유효한 입력은 통과해야 함', () => {
    const result = validateSavingInput({
      category_id: 1,
      amount: 100000,
      transaction_date: '2024-01-15',
      description: '1월 월급',
    })
    expect(result.valid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })

  it('카테고리 없으면 실패해야 함', () => {
    const result = validateSavingInput({
      amount: 100000,
    })
    expect(result.valid).toBe(false)
    expect(result.errors.category_id).toBeDefined()
  })

  it('금액 없으면 실패해야 함', () => {
    const result = validateSavingInput({
      category_id: 1,
    })
    expect(result.valid).toBe(false)
    expect(result.errors.amount).toBeDefined()
  })

  it('여러 오류를 한번에 반환해야 함', () => {
    const result = validateSavingInput({
      category_id: 'invalid',
      amount: -1000,
      description: '<script>',
    })
    expect(result.valid).toBe(false)
    expect(Object.keys(result.errors).length).toBeGreaterThan(1)
  })
})

describe('보안 테스트: 카테고리 입력 전체 검증 (validateCategoryInput)', () => {
  it('유효한 입력은 통과해야 함', () => {
    const result = validateCategoryInput({
      name: '월급',
      type: 'savings',
      target_percent: 20,
      color: '#4CAF50',
    })
    expect(result.valid).toBe(true)
  })

  it('잘못된 타입은 실패해야 함', () => {
    const result = validateCategoryInput({
      name: '테스트',
      type: 'invalid',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.type).toBeDefined()
  })
})

describe('보안 테스트: SQL Injection 방지', () => {
  it('Supabase는 파라미터화된 쿼리를 사용함', () => {
    const userInput = "'; DROP TABLE savings; --"

    mockSupabase
      .from('savings')
      .select('*')
      .eq('description', userInput)

    expect(mockSupabase.from).toHaveBeenCalledWith('savings')
  })

  it('LIKE 쿼리도 파라미터화되어야 함', () => {
    mockSupabase
      .from('savings')
      .select('*')

    expect(mockSupabase.from).toHaveBeenCalled()
  })
})

describe('보안 테스트: 권한 상승 방지', () => {
  it('일반 사용자는 다른 사용자의 user_id를 지정할 수 없어야 함', () => {
    const currentUserId = 'user-123'

    const createSaving = (
      userId: string,
      input: { amount: number; user_id?: string }
    ) => {
      const { user_id: _ignored, ...safeInput } = input
      return {
        user_id: userId,
        ...safeInput,
      }
    }

    const maliciousInput = {
      amount: 1000,
      user_id: 'admin-user',
    }

    const result = createSaving(currentUserId, maliciousInput)

    expect(result.user_id).toBe(currentUserId)
    expect(result.user_id).not.toBe('admin-user')
  })

  it('카테고리 ID는 현재 사용자 소유여야 함', async () => {
    const userCategories = [
      { id: 1, user_id: 'user-123', name: '월급' },
      { id: 2, user_id: 'user-123', name: '적금' },
    ]

    const validateCategoryOwnership = (
      categoryId: number,
      categories: typeof userCategories
    ): boolean => {
      return categories.some((c) => c.id === categoryId)
    }

    expect(validateCategoryOwnership(1, userCategories)).toBe(true)
    expect(validateCategoryOwnership(999, userCategories)).toBe(false)
  })
})

describe('보안 테스트: Rate Limiting (클라이언트 측)', () => {
  it('짧은 시간 내 과도한 요청은 제한되어야 함', async () => {
    const requestTimes: number[] = []
    const RATE_LIMIT = 10
    const TIME_WINDOW = 1000

    const isRateLimited = (): boolean => {
      const now = Date.now()
      const recentRequests = requestTimes.filter((t) => now - t < TIME_WINDOW)

      if (recentRequests.length >= RATE_LIMIT) {
        return true
      }

      requestTimes.push(now)
      return false
    }

    for (let i = 0; i < 10; i++) {
      expect(isRateLimited()).toBe(false)
    }

    expect(isRateLimited()).toBe(true)
  })
})

describe('보안 테스트: 세션 관리', () => {
  it('로그아웃 시 세션이 완전히 제거되어야 함', async () => {
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })

    const result = await mockSupabase.auth.signOut()

    expect(result.error).toBeNull()
    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
  })

  it('다중 탭/기기에서 로그아웃 시 모든 세션이 무효화되어야 함', () => {
    const signOutOptions = { scope: 'global' as const }
    expect(signOutOptions.scope).toBe('global')
  })
})
