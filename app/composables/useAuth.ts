import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User } from '~/types'

export function useAuth() {
  const { supabase } = useSupabase()

  const user = useState<User | null>('auth-user', () => null)
  const loading = useState<boolean>('auth-loading', () => false)
  const error = useState<Error | null>('auth-error', () => null)
  const initialized = useState<boolean>('auth-initialized', () => false)
  const authListenerSetup = useState<boolean>('auth-listener-setup', () => false)

  // Transform Supabase user to our User type
  function transformUser(supabaseUser: SupabaseUser | null): User | null {
    if (!supabaseUser) return null
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      created_at: supabaseUser.created_at,
    }
  }

  // Refresh session if expired or about to expire
  async function refreshSession() {
    try {
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession()
      if (refreshError) throw refreshError
      user.value = transformUser(session?.user || null)
      return { success: true, session }
    } catch (err) {
      user.value = null
      return { success: false, error: err as Error }
    }
  }

  // Initialize auth state (중복 호출 방지)
  async function initAuth() {
    // 이미 초기화됐으면 세션 유효성 검증
    if (initialized.value) {
      // 세션이 있으면 유효성 확인
      if (user.value) {
        const { data: { session } } = await supabase.auth.getSession()
        // 세션이 만료됐으면 리프레시 시도
        if (!session) {
          await refreshSession()
        }
      }
      return
    }

    try {
      loading.value = true
      const { data: { session } } = await supabase.auth.getSession()

      // 세션이 있지만 만료됐을 수 있으니 리프레시 시도
      if (session) {
        const { data: { session: refreshedSession } } = await supabase.auth.refreshSession()
        user.value = transformUser(refreshedSession?.user || session?.user || null)
      } else {
        user.value = null
      }

      initialized.value = true

      // 인증 상태 리스너 설정
      setupAuthListener()
    } catch (err) {
      error.value = err as Error
      user.value = null
    } finally {
      loading.value = false
    }
  }

  // Setup auth state listener (한 번만 설정)
  function setupAuthListener() {
    if (authListenerSetup.value) return

    supabase.auth.onAuthStateChange((event, session) => {
      user.value = transformUser(session?.user || null)

      // 세션 만료 시 자동으로 리프레시 시도
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully')
      } else if (event === 'SIGNED_OUT') {
        user.value = null
      }
    })

    authListenerSetup.value = true
  }

  // Sign in with email and password
  async function signIn(email: string, password: string) {
    try {
      loading.value = true
      error.value = null

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
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
  async function signUp(email: string, password: string) {
    try {
      loading.value = true
      error.value = null

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

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
    refreshSession,
  }
}
