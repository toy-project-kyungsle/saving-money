import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User } from '~/types'

export function useAuth() {
  const { supabase } = useSupabase()

  const user = useState<User | null>('auth-user', () => null)
  const loading = useState<boolean>('auth-loading', () => false)
  const error = useState<Error | null>('auth-error', () => null)
  const initialized = useState<boolean>('auth-initialized', () => false)

  // Transform Supabase user to our User type
  function transformUser(supabaseUser: SupabaseUser | null): User | null {
    if (!supabaseUser) return null
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      created_at: supabaseUser.created_at,
    }
  }

  // Initialize auth state (중복 호출 방지)
  async function initAuth() {
    // 이미 초기화됐으면 스킵
    if (initialized.value) {
      return
    }

    try {
      loading.value = true
      const { data: { session } } = await supabase.auth.getSession()
      user.value = transformUser(session?.user || null)
      initialized.value = true
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  // Sign in with email and password
  async function signIn(email: string, password: string, captchaToken?: string) {
    try {
      loading.value = true
      error.value = null

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: captchaToken ? { captchaToken } : undefined,
      })

      if (signInError) throw signInError

      user.value = transformUser(data.user)
      return { success: true }
    } catch (err) {
      error.value = err as Error
      return { success: false, error: err as Error }
    } finally {
      loading.value = false
    }
  }

  // Sign up with email and password
  async function signUp(email: string, password: string, captchaToken?: string) {
    try {
      loading.value = true
      error.value = null

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: captchaToken ? { captchaToken } : undefined,
      })

      if (signUpError) throw signUpError

      // Supabase는 이미 존재하는 이메일로 signUp 시 에러를 던지지 않음
      // 대신 user.identities가 빈 배열로 반환됨
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error('이미 가입된 이메일입니다')
      }

      // 세션이 없으면 실제 로그인된 상태가 아님
      if (!data.session) {
        throw new Error('회원가입에 실패했습니다. 다시 시도해주세요.')
      }

      user.value = transformUser(data.user)
      return { success: true }
    } catch (err) {
      error.value = err as Error
      return { success: false, error: err as Error }
    } finally {
      loading.value = false
    }
  }

  // Sign out
  async function signOut() {
    try {
      loading.value = true
      error.value = null

      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError

      user.value = null
      return { success: true }
    } catch (err) {
      error.value = err as Error
      return { success: false, error: err as Error }
    } finally {
      loading.value = false
    }
  }

  // Listen for auth changes
  function onAuthStateChange() {
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = transformUser(session?.user || null)
    })
  }

  // Computed
  const isAuthenticated = computed(() => !!user.value)

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    initAuth,
    signIn,
    signUp,
    signOut,
    onAuthStateChange,
  }
}
