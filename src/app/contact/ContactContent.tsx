'use client'

import React from 'react'
import { EnvelopeSimple, ChatCircle, MusicNote, MapPin, Clock } from '@phosphor-icons/react'
import { siteConfig } from '@/lib/config'

export const ContactContent = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
          联系我们
        </h1>
        <p className="text-text-secondary">
          有装机需求、合作投稿、问题反馈，随时联系
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <a
          href={`mailto:${siteConfig.email}`}
          className="group card p-6 flex items-center gap-5"
        >
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <EnvelopeSimple weight="bold" className="w-6 h-6 text-accent" />
          </div>
          <div>
            <div className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
              邮箱
            </div>
            <div className="text-sm text-text-secondary mt-1">
              {siteConfig.email}
            </div>
          </div>
        </a>

        <div className="card p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-surface-overlay border border-border flex items-center justify-center flex-shrink-0">
            <ChatCircle weight="bold" className="w-6 h-6 text-text-muted" />
          </div>
          <div>
            <div className="text-base font-semibold text-text-primary">
              微信
            </div>
            <div className="text-sm text-text-secondary mt-1">
              {siteConfig.wechat}
            </div>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-surface-overlay border border-border flex items-center justify-center flex-shrink-0">
            <MusicNote weight="bold" className="w-6 h-6 text-text-muted" />
          </div>
          <div>
            <div className="text-base font-semibold text-text-primary">
              抖音
            </div>
            <div className="text-sm text-text-secondary mt-1">
              {siteConfig.douyin}
            </div>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-surface-overlay border border-border flex items-center justify-center flex-shrink-0">
            <Clock weight="bold" className="w-6 h-6 text-text-muted" />
          </div>
          <div>
            <div className="text-base font-semibold text-text-primary">
              回复时间
            </div>
            <div className="text-sm text-text-secondary mt-1">
              工作日 9:00 - 21:00
            </div>
          </div>
        </div>
      </div>

      <div className="card p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <MapPin weight="bold" className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold text-text-primary">
            欢迎到店体验
          </h3>
        </div>
        <p className="text-text-secondary mb-6 max-w-xl mx-auto">
          我们有实体店面，可以现场看配置、试装机、面对面交流。装机需求直接到店更放心。
        </p>
        <a
          href={`mailto:${siteConfig.email}?subject=预约到店咨询`}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-colors glow-hover"
        >
          <EnvelopeSimple weight="bold" className="w-5 h-5" />
          预约到店咨询
        </a>
      </div>
    </div>
  )
}
