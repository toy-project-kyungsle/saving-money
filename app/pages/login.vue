<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'auth',
})

const { signIn, signUp, loading, error } = useAuth()

const isSignUp = ref(false)
const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const formError = ref('')
const captchaToken = ref('')

function onCaptchaVerify(token: string) {
  captchaToken.value = token
}

async function handleSubmit() {
  formError.value = ''

  if (!form.email || !form.password) {
    formError.value = '이메일과 비밀번호를 입력해주세요'
    return
  }

  if (!captchaToken.value) {
    formError.value = '캡차 인증을 완료해주세요'
    return
  }

  if (isSignUp.value) {
    if (form.password !== form.confirmPassword) {
      formError.value = '비밀번호가 일치하지 않습니다'
      return
    }

    if (form.password.length < 6) {
      formError.value = '비밀번호는 6자 이상이어야 합니다'
      return
    }

    const result = await signUp(form.email, form.password, captchaToken.value)
    if (result.success) {
      navigateTo('/')
    } else {
      formError.value = result.error?.message || '회원가입에 실패했습니다'
    }
  } else {
    const result = await signIn(form.email, form.password, captchaToken.value)
    if (result.success) {
      navigateTo('/')
    } else {
      formError.value = result.error?.message || '로그인에 실패했습니다'
    }
  }
}

function toggleMode() {
  isSignUp.value = !isSignUp.value
  formError.value = ''
  form.confirmPassword = ''
  captchaToken.value = ''
}
</script>

<template>
  <BaseCard>
    <h2 class="text-xl font-semibold text-gray-900 mb-6 text-center">
      {{ isSignUp ? '회원가입' : '로그인' }}
    </h2>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <BaseInput
        v-model="form.email"
        type="email"
        label="이메일"
        placeholder="email@example.com"
        required
      />

      <BaseInput
        v-model="form.password"
        type="password"
        label="비밀번호"
        placeholder="••••••••"
        required
      />

      <BaseInput
        v-if="isSignUp"
        v-model="form.confirmPassword"
        type="password"
        label="비밀번호 확인"
        placeholder="••••••••"
        required
      />

      <NuxtTurnstile :key="isSignUp ? 'signup' : 'signin'" v-model="captchaToken" />

      <p v-if="formError" class="text-sm text-red-500">
        {{ formError }}
      </p>

      <BaseButton
        type="submit"
        class="w-full"
        :loading="loading"
      >
        {{ isSignUp ? '회원가입' : '로그인' }}
      </BaseButton>
    </form>

    <div class="mt-6 text-center">
      <button
        type="button"
        class="text-sm text-blue-600 hover:text-blue-800"
        @click="toggleMode"
      >
        {{ isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입' }}
      </button>
    </div>
  </BaseCard>
</template>
