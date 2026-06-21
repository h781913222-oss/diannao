import React from 'react'
import { Metadata } from 'next'
import { SubmitForm } from './SubmitForm'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: `工具投稿 - ${siteConfig.name}`,
  description: '推荐好用的工具，让更多人发现优质资源。',
}

export default function SubmitPage() {
  return <SubmitForm />
}
