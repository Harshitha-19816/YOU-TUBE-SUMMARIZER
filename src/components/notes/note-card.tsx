'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
}

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', mass: 1, stiffness: 120, damping: 20 }}
    >
      <div className="h-full frosted-crystal iridescent-border rounded-3xl p-6 group cursor-default">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white group-hover:text-white transition-colors line-clamp-1 italic tracking-tight uppercase">
              {note.title}
            </h3>
            <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">
              {new Date(note.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(note)}
              className="h-8 w-8 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(note.id)}
              className="h-8 w-8 rounded-xl text-white/20 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-white/60 text-sm line-clamp-4 leading-relaxed whitespace-pre-wrap font-medium">
          {note.content}
        </p>

        {/* Subtle Bottom Accent */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  )
}
