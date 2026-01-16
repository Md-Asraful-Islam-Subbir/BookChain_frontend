'use client'

import React from 'react'
import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  url: string
  title: string
  text: string
}

export const ShareButton: React.FC<ShareButtonProps> = ({ url, title, text }) => {

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        })
        console.log('Shared successfully')
      } catch (err) {
        console.error('Share cancelled', err)
      }
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard')
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  )
}
