'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search,
  X,
  ArrowRight,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { ITool } from '@/types/index'
import { searchTools } from '@/lib/queries'
import { getFaviconUrl } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface ISearchBarProps {
  autoFocus?: boolean
  onClose?: () => void
  onSelect?: () => void
}

export const SearchBar = ({ autoFocus, onClose, onSelect }: ISearchBarProps) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ITool[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
      if (results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % results.length)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
          e.preventDefault()
          const tool = results[selectedIndex]
          if (tool) {
            window.open(tool.url, '_blank')
            if (onSelect) onSelect()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [results, selectedIndex, onClose, onSelect])

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }
    setIsLoading(true)
    try {
      const data = await searchTools(searchQuery)
      setResults(data)
      setSelectedIndex(-1)
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      performSearch(query)
    }, 300)
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, performSearch])

  return (
    <div className="relative">
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="flex items-center px-6 py-5">
          <Search className="w-5 h-5 text-on-surface-variant flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索工具、软件、AI..."
            className="flex-1 ml-4 bg-transparent text-on-surface placeholder-on-surface-variant/50 outline-none text-body-lg font-body-lg"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
              className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-3 text-on-surface-variant">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">搜索中...</span>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((tool, index) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onSelect && onSelect()}
                    className={cn(
                      'flex items-center gap-4 px-6 py-4 mx-2 rounded-xl transition-colors',
                      index === selectedIndex
                        ? 'bg-tertiary/10'
                        : 'hover:bg-white/5'
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/10">
                      <img
                        src={tool.icon_url || getFaviconUrl(tool.url)}
                        alt=""
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base text-on-surface truncate">
                          {tool.name}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-on-surface-variant flex-shrink-0" />
                      </div>
                      <p className="text-sm text-on-surface-variant truncate mt-1">
                        {tool.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 flex-shrink-0">
                      {tool.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="tag" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <ArrowRight className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-on-surface-variant">
                  未找到 "{query}" 相关结果
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar
