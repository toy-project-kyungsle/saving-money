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
