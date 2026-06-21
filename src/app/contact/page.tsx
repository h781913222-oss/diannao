import React from 'react'
import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { ContactContent } from './ContactContent'

export const metadata: Metadata = {
  title: `联系我们 - ${siteConfig.name}`,
  description: '有装机需求、合作投稿、问题反馈均可联系。',
}

export default function ContactPage() {
  return <ContactContent />
}
