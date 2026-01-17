export default defineNuxtRouteMiddleware(async (to) => {
  // 서버에서는 미들웨어 스킵 (클라이언트에서 처리)
  if (import.meta.server) {
    return
  }

  const { isAuthenticated, initAuth } = useAuth()

  // auth 초기화 완료 대기
  await initAuth()

  // If not authenticated and trying to access protected route
  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If authenticated and trying to access login page
  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/')
  }
})
