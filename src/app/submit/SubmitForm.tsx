'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { PaperPlaneTilt, Check, Warning, LinkSimple, FileText, Tag, ChatCircle, User } from '@phosphor-icons/react'
import { CATEGORIES } from '@/constants/index'
import { createSubmission } from '@/lib/queries'

export const SubmitForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    category: '',
    reason: '',
    contact: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!formData.name || !formData.url || !formData.description || !formData.category) {
      setError('请填写必填项')
      setIsSubmitting(false)
      return
    }

    try {
      await createSubmission(formData)
      setIsSubmitted(true)
      setFormData({ name: '', url: '', description: '', category: '', reason: '', contact: '' })
    } catch (err) {
      console.error('Submission error:', err)
      setError('提交失败，请稍后重试。如果问题持续，请直接发送邮件。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
          <PaperPlaneTilt weight="bold" className="w-7 h-7 text-accent" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
          工具投稿
        </h1>
        <p className="text-text-secondary">
          推荐你发现的优质工具，审核通过后会上线展示
        </p>
      </div>

      {isSubmitted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-10 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Check weight="bold" className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            提交成功！
          </h2>
          <p className="text-text-secondary mb-8">
            感谢你的推荐，我们会尽快审核。
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-3 rounded-xl bg-surface-overlay border border-border text-text-secondary text-sm font-medium hover:text-text-primary hover:border-border-hover transition-all"
          >
            继续投稿
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"
            >
              <Warning weight="bold" className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-3">
              <FileText weight="bold" className="w-4 h-4 text-text-muted" />
              网站名称 <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="例如：ChatGPT"
              className="w-full px-5 py-4 bg-surface-overlay rounded-xl border border-border text-text-primary placeholder-text-muted outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-3">
              <LinkSimple weight="bold" className="w-4 h-4 text-text-muted" />
              网站链接 <span className="text-accent">*</span>
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://example.com"
              className="w-full px-5 py-4 bg-surface-overlay rounded-xl border border-border text-text-primary placeholder-text-muted outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-3">
              <FileText weight="bold" className="w-4 h-4 text-text-muted" />
              网站简介 <span className="text-accent">*</span>
              <span className="text-xs text-text-muted font-normal">（限50字）</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              maxLength={50}
              rows={3}
              placeholder="一句话介绍这个工具是做什么的"
              className="w-full px-5 py-4 bg-surface-overlay rounded-xl border border-border text-text-primary placeholder-text-muted outline-none focus:border-accent/50 transition-colors resize-none"
            />
            <div className="text-right text-xs text-text-muted mt-2">
              {formData.description.length}/50
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-3">
              <Tag weight="bold" className="w-4 h-4 text-text-muted" />
              推荐分类 <span className="text-accent">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-5 py-4 bg-surface-overlay rounded-xl border border-border text-text-primary outline-none focus:border-accent/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="" className="bg-surface-elevated">请选择分类</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug} className="bg-surface-elevated">
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-3">
              <ChatCircle weight="bold" className="w-4 h-4 text-text-muted" />
              推荐理由
              <span className="text-xs text-text-muted font-normal">（选填）</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              rows={3}
              placeholder="为什么推荐这个工具？有什么特别之处？"
              className="w-full px-5 py-4 bg-surface-overlay rounded-xl border border-border text-text-primary placeholder-text-muted outline-none focus:border-accent/50 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-3">
              <User weight="bold" className="w-4 h-4 text-text-muted" />
              联系方式
              <span className="text-xs text-text-muted font-normal">（选填）</span>
            </label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              placeholder="邮箱或微信"
              className="w-full px-5 py-4 bg-surface-overlay rounded-xl border border-border text-text-primary placeholder-text-muted outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed glow-hover"
          >
            <PaperPlaneTilt weight="bold" className="w-5 h-5" />
            {isSubmitting ? '提交中...' : '提交推荐'}
          </button>
        </form>
      )}
    </div>
  )
}

export default SubmitForm
