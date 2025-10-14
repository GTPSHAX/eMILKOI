import { getDictionary, type Locale } from '@/lib/dictionaries'
import { VotingClient } from '@/components/voting-client'
import { notFound } from 'next/navigation'

interface VotingPageProps {
  params: { lang: Locale; slug: string }
}

export default async function VotingPage({ params }: VotingPageProps) {
  const { lang, slug } = await params
  const dict = await getDictionary(lang)

  // Fetch voting session data server-side for better SEO and error handling
  let sessionData = null
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/vote/${slug}`, {
      cache: 'no-store', // Always fetch fresh data
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        sessionData = result.data
      }
    }
  } catch (error) {
    console.error('Error fetching session data:', error)
  }

  if (!sessionData) {
    notFound()
  }

  return (
    <VotingClient 
      sessionData={sessionData}
      dict={dict.voting}
      currentLang={lang}
    />
  )
}

export async function generateMetadata({ params }: VotingPageProps) {
  const { lang, slug } = await params
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/vote/${slug}`, {
      cache: 'no-store',
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        return {
          title: `${result.data.title} - eMILKOI Voting`,
          description: result.data.description,
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  return {
    title: 'Voting - eMILKOI',
    description: 'Online voting platform',
  }
}