'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CheckCircle, Home, Vote } from 'lucide-react'
import Image from 'next/image'

interface Candidate {
  name: string
  class: string
  description: string
  photoUrl: string
}

interface SessionData {
  id: number
  title: string
  description: string
  slug: string
  candidates: string | null
  options: string | null
  startDate: Date | null
  endDate: Date | null
}

interface VotingClientProps {
  sessionData: SessionData
  dict: {
    title: string
    loading: string
    form: {
      name: string
      namePlaceholder: string
      email: string
      emailPlaceholder: string
      selectCandidate: string
      selectOption: string
      required: string
      invalidEmail: string
      submitVote: string
      submitting: string
    }
    success: {
      title: string
      message: string
      redirecting: string
    }
    error: {
      alreadyVoted: string
      invalidSelection: string
      submitFailed: string
      tryAgain: string
    }
    navigation: {
      back: string
      next: string
      home: string
    }
    candidate: {
      class: string
      description: string
    }
  }
  currentLang: 'id' | 'en'
}

export function VotingClient({ sessionData, dict, currentLang }: VotingClientProps) {
  const [step, setStep] = useState<'vote' | 'success'>('vote')
  const [formData, setFormData] = useState({
    selectedCandidate: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(15)

  // Parse candidates or options
  const candidates: Candidate[] = sessionData.candidates 
    ? JSON.parse(sessionData.candidates) 
    : []
  const options: string[] = sessionData.options 
    ? JSON.parse(sessionData.options) 
    : []
  const hasCandidates = candidates.length > 0

  // Success page countdown
  useEffect(() => {
    if (step === 'success') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Reset to initial state instead of redirecting
            setStep('vote')
            setFormData({
              selectedCandidate: '',
            })
            setError(null)
            return 15 // Reset countdown
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [step])

  const playSuccessSound = () => {
    try {
      const audio = new Audio('/audio/ding-dong.mp3')
      // Browser limits volume to max 1.0, so use maximum allowed
      audio.volume = Math.min(1.5, 1.0) // Ensures we get max volume (1.0)
      audio.play().catch(console.error)
    } catch (error) {
      console.error('Failed to play success sound:', error)
    }
  }

  const handleSubmit = async () => {
    if (!formData.selectedCandidate) {
      setError(dict.error.invalidSelection)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/vote/${sessionData.slug}`, {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidate : formData.selectedCandidate,
          voterName : 'Anonymous', // Fixed name since no input
          voterEmail: `anonymous-${Date.now()}@voting.local`, // Generate unique email
        }),
      })

      const result = await response.json()

      if (result.success) {
        playSuccessSound()
        setStep('success')
      } else {
        setError(result.error || dict.error.submitFailed)
      }
    } catch (error) {
      console.error('Error submitting vote:', error)
      setError(dict.error.submitFailed)
    } finally {
      setSubmitting(false)
    }
  }

  const renderVoteStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="p-4 rounded-full bg-primary/10 w-16 h-16 mx-auto flex items-center justify-center">
          <Vote className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{sessionData.title}</h1>
          <p className="text-muted-foreground">{sessionData.description}</p>
          <h2 className="text-xl font-bold mt-4">
            {hasCandidates ? dict.form.selectCandidate : dict.form.selectOption}
          </h2>
        </div>
      </div>

      <RadioGroup
        value={formData.selectedCandidate}
        onValueChange={(value: string) => setFormData({ ...formData, selectedCandidate: value })}
        className="space-y-4"
      >
        {hasCandidates ? (
          candidates.map((candidate, index) => (
            <div key={index} className="space-y-0">
              <RadioGroupItem
                value={candidate.name}
                id={`candidate-${index}`}
                className="sr-only"
              />
              <Label
                htmlFor={`candidate-${index}`}
                className={`cursor-pointer block p-4 rounded-lg border-2 transition-all ${
                  formData.selectedCandidate === candidate.name
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {candidate.photoUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={candidate.photoUrl}
                        alt={candidate.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-lg">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {dict.candidate.class} {candidate.class}
                    </p>
                    {candidate.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {candidate.description}
                      </p>
                    )}
                  </div>
                  {formData.selectedCandidate === candidate.name && (
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  )}
                </div>
              </Label>
            </div>
          ))
        ) : (
          options.map((option, index) => (
            <div key={index} className="space-y-0">
              <RadioGroupItem
                value={option}
                id={`option-${index}`}
                className="sr-only"
              />
              <Label
                htmlFor={`option-${index}`}
                className={`cursor-pointer block p-4 rounded-lg border-2 transition-all ${
                  formData.selectedCandidate === option
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  {formData.selectedCandidate === option && (
                    <CheckCircle className="h-6 w-6 text-primary" />
                  )}
                </div>
              </Label>
            </div>
          ))
        )}
      </RadioGroup>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  )

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="p-6 rounded-full bg-green-100 w-24 h-24 mx-auto flex items-center justify-center">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-green-700">{dict.success.title}</h2>
        <p className="text-muted-foreground">{dict.success.message}</p>
      </div>

      <div className="p-4 rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">
          {dict.success.redirecting.replace('{seconds}', countdown.toString())}
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-muted-foreground">
              eMILKOI Voting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 'vote' && renderVoteStep()}
            {step === 'success' && renderSuccessStep()}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation - Only show during voting */}
      {step === 'vote' && (
        <div className="border-t bg-card/50 p-4">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => window.location.href = `/${currentLang}`}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              {dict.navigation.home}
            </Button>

            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2"
            >
              {submitting ? dict.form.submitting : dict.form.submitVote}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}