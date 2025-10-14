'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock, Mail, User } from 'lucide-react'

interface AuthFormsProps {
  dict: {
    tabs: {
      login: string
      register: string
    }
    login: {
      email: string
      password: string
      emailPlaceholder: string
      passwordPlaceholder: string
      button: string
      buttonLoading: string
      adminCredentials: string
      errorGeneric: string
    }
    register: {
      fullName: string
      email: string
      password: string
      confirmPassword: string
      namePlaceholder: string
      emailPlaceholder: string
      passwordPlaceholder: string
      passwordHint: string
      button: string
      buttonLoading: string
      successMessage: string
      errorGeneric: string
    }
  }
  currentLang: 'id' | 'en'
}

export function AuthForms({ dict, currentLang }: AuthFormsProps) {
  const router = useRouter()
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [loginFormData, setLoginFormData] = useState({
    email   : '',
    password: '',
  })
  const [registerFormData, setRegisterFormData] = useState({
    name           : '',
    email          : '',
    password       : '',
    confirmPassword: '',
  })

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(loginFormData),
      })

      const data = await res.json()

      if (data.success) {
        router.push(`/${currentLang}/dashboard`)
      } else {
        setLoginError(data.error || dict.login.errorGeneric)
      }
    } catch {
      setLoginError(dict.login.errorGeneric)
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault()
    setRegisterError('')
    setRegisterSuccess(false)
    setRegisterLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(registerFormData),
      })

      const data = await res.json()

      if (data.success) {
        setRegisterSuccess(true)
        // Reset form
        setRegisterFormData({
          name           : '',
          email          : '',
          password       : '',
          confirmPassword: '',
        })
        // Switch to login tab after 2 seconds
        setTimeout(() => {
          const loginTab = document.querySelector('[value="login"]') as HTMLButtonElement
          loginTab?.click()
          setRegisterSuccess(false)
        }, 2000)
      } else {
        setRegisterError(data.error || dict.register.errorGeneric)
      }
    } catch {
      setRegisterError(dict.register.errorGeneric)
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">{dict.tabs.login}</TabsTrigger>
        <TabsTrigger value="register">{dict.tabs.register}</TabsTrigger>
      </TabsList>

      {/* Login Tab */}
      <TabsContent value="login">
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">{dict.login.email}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="login-email"
                type="email"
                placeholder={dict.login.emailPlaceholder}
                className="pl-10"
                value={loginFormData.email}
                onChange={(e) =>
                  setLoginFormData({ ...loginFormData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">{dict.login.password}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="login-password"
                type="password"
                placeholder={dict.login.passwordPlaceholder}
                className="pl-10"
                value={loginFormData.password}
                onChange={(e) =>
                  setLoginFormData({ ...loginFormData, password: e.target.value })
                }
                required
              />
            </div>
          </div>

          {loginError && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {loginError}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loginLoading}>
            {loginLoading ? dict.login.buttonLoading : dict.login.button}
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-4 border-t">
            <p>{dict.login.adminCredentials}</p>
            <p className="font-mono mt-1">admin@admin.com / admin123</p>
          </div>
        </form>
      </TabsContent>

      {/* Register Tab */}
      <TabsContent value="register">
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-name">{dict.register.fullName}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="register-name"
                type="text"
                placeholder={dict.register.namePlaceholder}
                className="pl-10"
                value={registerFormData.name}
                onChange={(e) =>
                  setRegisterFormData({ ...registerFormData, name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">{dict.register.email}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="register-email"
                type="email"
                placeholder={dict.register.emailPlaceholder}
                className="pl-10"
                value={registerFormData.email}
                onChange={(e) =>
                  setRegisterFormData({ ...registerFormData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">{dict.register.password}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="register-password"
                type="password"
                placeholder={dict.register.passwordPlaceholder}
                className="pl-10"
                value={registerFormData.password}
                onChange={(e) =>
                  setRegisterFormData({ ...registerFormData, password: e.target.value })
                }
                required
                minLength={6}
              />
            </div>
            <p className="text-xs text-muted-foreground">{dict.register.passwordHint}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-confirm-password">{dict.register.confirmPassword}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="register-confirm-password"
                type="password"
                placeholder={dict.register.passwordPlaceholder}
                className="pl-10"
                value={registerFormData.confirmPassword}
                onChange={(e) =>
                  setRegisterFormData({
                    ...registerFormData,
                    confirmPassword: e.target.value,
                  })
                }
                required
                minLength={6}
              />
            </div>
          </div>

          {registerError && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {registerError}
            </div>
          )}

          {registerSuccess && (
            <div className="p-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
              {dict.register.successMessage}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={registerLoading || registerSuccess}
          >
            {registerLoading ? dict.register.buttonLoading : dict.register.button}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
