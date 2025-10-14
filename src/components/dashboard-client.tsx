'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageUpload } from '@/components/image-upload'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Plus,
  X,
  UserCircle,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'

interface DashboardStats {
  totalSessions: number
  activeSessions: number
  pendingSessions: number
  completedSessions: number
  totalVotes: number
}

interface SessionData {
  userId: number
  email: string
  name: string
  role: 'admin' | 'voter'
  isLoggedIn: boolean
}

interface Candidate {
  name: string
  class: string
  description: string
  photoUrl: string
}

interface VotingSession {
  id: number
  title: string
  description: string | null
  slug: string
  status: 'pending' | 'active' | 'completed'
  options: string
  candidates: string | null
  startDate: Date | null
  endDate: Date | null
  createdBy: number
  createdAt: Date
  updatedAt: Date
}

interface DashboardClientProps {
  dict: {
    title: string
    welcome: string
    logout: string
    loading: string
    stats: {
      totalVotes: string
      totalVotesDesc: string
      activeSessions: string
      activeSessionsDesc: string
      pendingSessions: string
      pendingSessionsDesc: string
      completedSessions: string
      completedSessionsDesc: string
      totalSessions: string
      totalSessionsDesc: string
      quickAction: string
    }
    overview: {
      title: string
      description: string
      running: string
      runningDesc: string
      waiting: string
      waitingDesc: string
      finished: string
      finishedDesc: string
    }
    sessions: {
      title: string
      description: string
      empty: string
      emptyDesc: string
      status: {
        pending: string
        active: string
        completed: string
      }
      actions: {
        start: string
        complete: string
        view: string
        delete: string
      }
      viewDetails: {
        sessionInfo: string
        status: string
        startDate: string
        endDate: string
        votingUrl: string
        copyUrl: string
        urlCopied: string
        candidates: string
        options: string
        noValidCandidates: string
        candidateClass: string
      }
      deleteConfirm: {
        title: string
        description: string
        cancel: string
        confirm: string
        deleting: string
        success: string
        votesDeleted: string
        imagesDeleted: string
      }
    }
    createSession: {
      button: string
      title: string
      description: string
      form: {
        title: string
        titlePlaceholder: string
        description: string
        descriptionPlaceholder: string
        startDate: string
        endDate: string
        candidates: string
        candidateName: string
        candidateNamePlaceholder: string
        candidateClass: string
        candidateClassPlaceholder: string
        candidateDescription: string
        candidateDescriptionPlaceholder: string
        candidatePhoto: string
        candidatePhotoHint: string
        addCandidate: string
        removeCandidate: string
        minCandidates: string
        options: string
        optionsPlaceholder: string
        addOption: string
        removeOption: string
        minOptions: string
      }
      buttons: {
        cancel: string
        create: string
        creating: string
      }
      success: string
      error: string
    }
  }
  currentLang: 'id' | 'en'
}

export function DashboardClient({ dict, currentLang }: DashboardClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [user, setUser] = useState<SessionData | null>(null)
  const [sessions, setSessions] = useState<VotingSession[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [isPolling, setIsPolling] = useState(true)
  const [formData, setFormData] = useState({
    title      : '',
    description: '',
    slug       : '',
    startDate  : '',
    endDate    : '',
    options    : ['', ''],
  })
  const [useCandidates, setUseCandidates] = useState(true)
  const [candidates, setCandidates] = useState<Candidate[]>([
    { name: '', class: '', description: '', photoUrl: '' },
    { name: '', class: '', description: '', photoUrl: '' },
  ])

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Realtime updates with polling
  useEffect(() => {
    if (!isPolling || !user) return

    const interval = setInterval(async () => {
      try {
        // Only fetch stats and sessions data, don't refetch auth
        const [statsRes, sessionsRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/voting/sessions')
        ])

        const [statsData, sessionsData] = await Promise.all([
          statsRes.json(),
          sessionsRes.json()
        ])

        if (statsData.success) {
          setStats(statsData.data)
        }

        if (sessionsData.success) {
          setSessions(sessionsData.data)
        }
      } catch (error) {
        console.warn('Polling error:', error)
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [isPolling, user])

  // Stop polling when user is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPolling(!document.hidden)
    }

    const handleFocus = () => setIsPolling(true)
    const handleBlur = () => setIsPolling(false)

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  async function checkAuth() {
    try {
      // Check authentication
      const authRes = await fetch('/api/auth/me')
      const authData = await authRes.json()

      if (!authData.user || !authData.user.isLoggedIn) {
        router.push(`/${currentLang}/login`)
        return
      }

      if (authData.user.role !== 'admin') {
        router.push(`/${currentLang}`)
        return
      }

      setUser(authData.user)

      // Fetch dashboard stats
      const statsRes = await fetch('/api/dashboard/stats')
      const statsData = await statsRes.json()

      if (statsData.success) {
        setStats(statsData.data)
      }

      // Fetch voting sessions
      const sessionsRes = await fetch('/api/voting/sessions')
      const sessionsData = await sessionsRes.json()

      if (sessionsData.success) {
        setSessions(sessionsData.data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push(`/${currentLang}/login`)
  }

  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)

    try {
      const payload: Record<string, unknown> = {
        ...formData,
      }

      if (useCandidates) {
        // Filter out empty candidates
        const validCandidates = candidates.filter((c) => c.name.trim() !== '' && c.class.trim() !== '')
        if (validCandidates.length < 2) {
          alert(dict.createSession.form.minCandidates)
          setCreating(false)
          return
        }
        payload.candidates = validCandidates
      } else {
        payload.options = formData.options.filter((o) => o.trim() !== '')
      }

      const res = await fetch('/api/voting/sessions', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        // Reset form
        setFormData({
          title      : '',
          description: '',
          slug       : '',
          startDate  : '',
          endDate    : '',
          options    : ['', ''],
        })
        setCandidates([
          { name: '', class: '', description: '', photoUrl: '' },
          { name: '', class: '', description: '', photoUrl: '' },
        ])
        setDialogOpen(false)
        // Refresh sessions
        checkAuth()
      } else {
        alert(data.error || dict.createSession.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert(dict.createSession.error)
    } finally {
      setCreating(false)
    }
  }

  async function handleUpdateStatus(sessionId: number, status: 'pending' | 'active' | 'completed') {
    try {
      const res = await fetch(`/api/voting/sessions/${sessionId}`, {
        method : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ status }),
      })

      const data = await res.json()

      if (data.success) {
        // Refresh sessions
        checkAuth()
      } else {
        alert(data.error || 'Failed to update session')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to update session')
    }
  }

  async function handleDeleteSession(sessionId: number) {
    setSessionToDelete(sessionId)
    setDeleteConfirmOpen(true)
  }

  async function confirmDeleteSession() {
    if (!sessionToDelete) return
    
    setDeleting(true)
    try {
      const res = await fetch(`/api/voting/sessions/${sessionToDelete}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        // Show success message with details
        const { deletedVotes, deletedImages } = data.data
        let message = dict.sessions.deleteConfirm.success
        if (deletedVotes > 0) {
          message += ` ${deletedVotes} ${dict.sessions.deleteConfirm.votesDeleted}.`
        }
        if (deletedImages.length > 0) {
          message += ` ${deletedImages.length} ${dict.sessions.deleteConfirm.imagesDeleted}.`
        }
        alert(message)
        
        // Refresh sessions and stats
        checkAuth()
      } else {
        alert(data.error || 'Failed to delete session')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to delete session')
    } finally {
      setDeleting(false)
      setDeleteConfirmOpen(false)
      setSessionToDelete(null)
    }
  }

  function addOption() {
    setFormData({ ...formData, options: [...formData.options, ''] })
  }

  function removeOption(index: number) {
    const newOptions = formData.options.filter((_, i) => i !== index)
    setFormData({ ...formData, options: newOptions })
  }

  function updateOption(index: number, value: string) {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  function addCandidate() {
    setCandidates([...candidates, { name: '', class: '', description: '', photoUrl: '' }])
  }

  function removeCandidate(index: number) {
    const newCandidates = candidates.filter((_, i) => i !== index)
    setCandidates(newCandidates)
  }

  function updateCandidate(index: number, field: keyof Candidate, value: string) {
    const newCandidates = [...candidates]
    newCandidates[index][field] = value
    setCandidates(newCandidates)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{dict.title}</h1>
            <p className="text-sm text-muted-foreground">
              {dict.welcome}, {user?.name}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            {dict.logout}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Votes */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{dict.stats.totalVotes}</CardTitle>
              <BarChart3 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalVotes || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">{dict.stats.totalVotesDesc}</p>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="hover:shadow-lg transition-shadow border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{dict.stats.activeSessions}</CardTitle>
              <PlayCircle className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats?.activeSessions || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {dict.stats.activeSessionsDesc}
              </p>
            </CardContent>
          </Card>

          {/* Pending Sessions */}
          <Card className="hover:shadow-lg transition-shadow border-chart-4/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{dict.stats.pendingSessions}</CardTitle>
              <Clock className="h-5 w-5 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-4">
                {stats?.pendingSessions || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {dict.stats.pendingSessionsDesc}
              </p>
            </CardContent>
          </Card>

          {/* Completed Sessions */}
          <Card className="hover:shadow-lg transition-shadow border-chart-2/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {dict.stats.completedSessions}
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-2">
                {stats?.completedSessions || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {dict.stats.completedSessionsDesc}
              </p>
            </CardContent>
          </Card>

          {/* Total Sessions */}
          <Card className="hover:shadow-lg transition-shadow border-chart-5/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{dict.stats.totalSessions}</CardTitle>
              <Users className="h-5 w-5 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-5">
                {stats?.totalSessions || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {dict.stats.totalSessionsDesc}
              </p>
            </CardContent>
          </Card>

          {/* Quick Action Card */}
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/10 to-chart-2/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium">{dict.stats.quickAction}</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    {dict.createSession.button}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{dict.createSession.title}</DialogTitle>
                    <DialogDescription>{dict.createSession.description}</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateSession} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">{dict.createSession.form.title}</Label>
                      <Input
                        id="title"
                        placeholder={dict.createSession.form.titlePlaceholder}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">{dict.createSession.form.description}</Label>
                      <Textarea
                        id="description"
                        placeholder={dict.createSession.form.descriptionPlaceholder}
                        value={formData.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">{(dict.createSession.form as any).slug}</Label>
                      <Input
                        id="slug"
                        placeholder={(dict.createSession.form as any).slugPlaceholder}
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        {(dict.createSession.form as any).slugHint.replace('[slug]', formData.slug || 'your-url')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">{dict.createSession.form.startDate}</Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({ ...formData, startDate: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDate">{dict.createSession.form.endDate}</Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Tabs for Simple Options or Detailed Candidates */}
                    <Tabs value={useCandidates ? 'candidates' : 'options'} onValueChange={(v) => setUseCandidates(v === 'candidates')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="candidates">{dict.createSession.form.candidates}</TabsTrigger>
                        <TabsTrigger value="options">{dict.createSession.form.options}</TabsTrigger>
                      </TabsList>

                      {/* Detailed Candidates Tab */}
                      <TabsContent value="candidates" className="space-y-4 mt-4">
                        {candidates.map((candidate, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <UserCircle className="h-5 w-5" />
                                  Kandidat {index + 1}
                                </h4>
                                {candidates.length > 2 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCandidate(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>{dict.createSession.form.candidateName}</Label>
                                  <Input
                                    placeholder={dict.createSession.form.candidateNamePlaceholder}
                                    value={candidate.name}
                                    onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>{dict.createSession.form.candidateClass}</Label>
                                  <Input
                                    placeholder={dict.createSession.form.candidateClassPlaceholder}
                                    value={candidate.class}
                                    onChange={(e) => updateCandidate(index, 'class', e.target.value)}
                                    required
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>{dict.createSession.form.candidateDescription}</Label>
                                <Textarea
                                  placeholder={dict.createSession.form.candidateDescriptionPlaceholder}
                                  value={candidate.description}
                                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    updateCandidate(index, 'description', e.target.value)
                                  }
                                  rows={3}
                                />
                              </div>

                              <ImageUpload
                                label={dict.createSession.form.candidatePhoto}
                                hint={dict.createSession.form.candidatePhotoHint}
                                value={candidate.photoUrl}
                                onChange={(url) => updateCandidate(index, 'photoUrl', url)}
                              />
                            </div>
                          </Card>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={addCandidate}
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {dict.createSession.form.addCandidate}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          {dict.createSession.form.minCandidates}
                        </p>
                      </TabsContent>

                      {/* Simple Options Tab */}
                      <TabsContent value="options" className="space-y-4 mt-4">
                        {formData.options.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder={`${dict.createSession.form.optionsPlaceholder} ${index + 1}`}
                              value={option}
                              onChange={(e) => updateOption(index, e.target.value)}
                              required
                            />
                            {formData.options.length > 2 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeOption(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addOption}
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {dict.createSession.form.addOption}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          {dict.createSession.form.minOptions}
                        </p>
                      </TabsContent>
                    </Tabs>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                        disabled={creating}
                      >
                        {dict.createSession.buttons.cancel}
                      </Button>
                      <Button type="submit" disabled={creating}>
                        {creating
                          ? dict.createSession.buttons.creating
                          : dict.createSession.buttons.create}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{dict.sessions.title}</CardTitle>
            <CardDescription>{dict.sessions.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{dict.sessions.empty}</h3>
                <p className="text-sm text-muted-foreground">{dict.sessions.emptyDesc}</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {sessions.map((session) => {
                  // Parse candidates if available
                  let candidates: Candidate[] = []
                  let options: string[] = []
                  
                  try {
                    if (session.candidates) {
                      candidates = JSON.parse(session.candidates)
                    }
                  } catch (e) {
                    console.error('Failed to parse candidates:', e)
                  }

                  try {
                    if (session.options) {
                      options = JSON.parse(session.options)
                    }
                  } catch (e) {
                    console.error('Failed to parse options:', e)
                  }

                  // Filter valid candidates (with name and class)
                  const validCandidates = candidates.filter((c) => c.name.trim() !== '' && c.class.trim() !== '')
                  const hasCandidates = validCandidates.length > 0

                  // Check if session should auto-start or auto-complete
                  const now = Date.now()
                  const startTime = session.startDate ? new Date(session.startDate).getTime() : 0
                  const endTime = session.endDate ? new Date(session.endDate).getTime() : 0
                  const shouldStart = session.status === 'pending' && startTime <= now
                  const shouldComplete = session.status === 'active' && endTime <= now

                  return (
                    <AccordionItem key={session.id} value={session.id.toString()} className="border rounded-lg">
                      <div className="flex items-center justify-between p-4 bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{session.title}</h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                session.status === 'active'
                                  ? 'bg-primary/10 text-primary'
                                  : session.status === 'pending'
                                    ? 'bg-chart-4/10 text-chart-4'
                                    : 'bg-chart-2/10 text-chart-2'
                              }`}
                            >
                              {dict.sessions.status[session.status]}
                            </span>
                            {shouldStart && (
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary animate-pulse">
                                Auto-starting...
                              </span>
                            )}
                            {shouldComplete && (
                              <span className="text-xs px-2 py-1 rounded-full bg-chart-2/20 text-chart-2 animate-pulse">
                                Auto-completing...
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{session.description}</p>
                          <div className="text-xs text-muted-foreground mt-2">
                            {session.startDate &&
                              new Date(session.startDate).toLocaleString(currentLang)}{' '}
                            -{' '}
                            {session.endDate && new Date(session.endDate).toLocaleString(currentLang)}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          {session.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(session.id, 'active')}
                            >
                              <PlayCircle className="mr-2 h-4 w-4" />
                              {dict.sessions.actions.start}
                            </Button>
                          )}
                          {session.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(session.id, 'completed')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {dict.sessions.actions.complete}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {dict.sessions.actions.delete}
                          </Button>
                          <AccordionTrigger className="hover:no-underline text-sm px-3 py-1.5 rounded-md hover:bg-accent">
                            {dict.sessions.actions.view}
                          </AccordionTrigger>
                        </div>
                      </div>

                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-6">
                          {/* Session Info */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                            <div>
                              <h6 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{dict.sessions.viewDetails.status}</h6>
                              <p className="text-lg font-semibold">{dict.sessions.status[session.status]}</p>
                            </div>
                            <div>
                              <h6 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{dict.sessions.viewDetails.startDate}</h6>
                              <p className="text-sm">{session.startDate ? new Date(session.startDate).toLocaleString(currentLang) : '-'}</p>
                            </div>
                            <div>
                              <h6 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{dict.sessions.viewDetails.endDate}</h6>
                              <p className="text-sm">{session.endDate ? new Date(session.endDate).toLocaleString(currentLang) : '-'}</p>
                            </div>
                          </div>

                          {/* Voting URL */}
                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <h6 className="font-semibold text-sm text-primary uppercase tracking-wide mb-2">{dict.sessions.viewDetails.votingUrl}</h6>
                            <div className="flex items-center gap-2">
                              <code className="text-sm bg-background px-2 py-1 rounded border flex-1">
                                {typeof window !== 'undefined' ? `${window.location.origin}/${currentLang}/vote/${session.slug}` : `/vote/${session.slug}`}
                              </code>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const url = `${window.location.origin}/${currentLang}/vote/${session.slug}`
                                  navigator.clipboard.writeText(url)
                                  alert(dict.sessions.viewDetails.urlCopied)
                                }}
                              >
                                {dict.sessions.viewDetails.copyUrl}
                              </Button>
                            </div>
                          </div>

                          {/* Candidates or Options */}
                          {hasCandidates ? (
                            <div>
                              <h5 className="font-semibold mb-4 text-lg">{dict.sessions.viewDetails.candidates} ({validCandidates.length})</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {validCandidates.map((candidate, idx) => (
                                  <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-square relative bg-muted">
                                      {candidate.photoUrl ? (
                                        <Image
                                          src={candidate.photoUrl}
                                          alt={candidate.name}
                                          fill
                                          className="object-cover"
                                        />
                                      ) : (
                                        <div className="flex items-center justify-center h-full">
                                          <UserCircle className="h-20 w-20 text-muted-foreground" />
                                        </div>
                                      )}
                                    </div>
                                    <CardContent className="p-4">
                                      <h6 className="font-semibold text-lg mb-1">{candidate.name}</h6>
                                      <p className="text-sm text-primary font-medium mb-2">{dict.sessions.viewDetails.candidateClass} {candidate.class}</p>
                                      {candidate.description && candidate.description.trim() && (
                                        <p className="text-xs text-muted-foreground line-clamp-3">{candidate.description}</p>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          ) : session.candidates ? (
                            <div className="text-center py-8">
                              <UserCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                              <p className="text-sm text-muted-foreground">{dict.sessions.viewDetails.noValidCandidates}</p>
                            </div>
                          ) : (
                            <div>
                              <h5 className="font-semibold mb-4 text-lg">{dict.sessions.viewDetails.options} ({options.length})</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {options.map((option, idx) => (
                                  <div key={idx} className="p-4 bg-card border rounded-lg hover:shadow-sm transition-shadow">
                                    <span className="font-medium">{option}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle>{dict.overview.title}</CardTitle>
            <CardDescription>{dict.overview.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <PlayCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{dict.overview.running}</p>
                    <p className="text-sm text-muted-foreground">{dict.overview.runningDesc}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {stats?.activeSessions || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-chart-4/10">
                    <Clock className="h-5 w-5 text-chart-4" />
                  </div>
                  <div>
                    <p className="font-medium">{dict.overview.waiting}</p>
                    <p className="text-sm text-muted-foreground">{dict.overview.waitingDesc}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-chart-4">
                  {stats?.pendingSessions || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-chart-2/10">
                    <CheckCircle className="h-5 w-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="font-medium">{dict.overview.finished}</p>
                    <p className="text-sm text-muted-foreground">{dict.overview.finishedDesc}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-chart-2">
                  {stats?.completedSessions || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dict.sessions.deleteConfirm.title}</DialogTitle>
            <DialogDescription>
              {dict.sessions.deleteConfirm.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={deleting}
            >
              {dict.sessions.deleteConfirm.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteSession}
              disabled={deleting}
            >
              {deleting ? dict.sessions.deleteConfirm.deleting : dict.sessions.deleteConfirm.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
