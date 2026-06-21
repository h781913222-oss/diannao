'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ICategory } from '@/types/index'

interface ICategoryIconProps {
  category: ICategory
  isActive?: boolean
}

export const CategoryIcon = ({ category, isActive }: ICategoryIconProps) => {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="block"
    >
      <motion.div
        className={`pill px-5 py-3 flex items-center gap-3 text-sm ${
          isActive 
            ? 'pill-active' 
            : 'text-text-secondary hover:text-text-primary'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-lg">{category.icon}</span>
        <span className="font-medium whitespace-nowrap">{category.name}</span>
      </motion.div>
    </Link>
  )
}

export default CategoryIcon
