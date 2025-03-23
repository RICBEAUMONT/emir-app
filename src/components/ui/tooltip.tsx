import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
}

export function Tooltip({ 
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 200
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={delayDuration}>
        <TooltipPrimitive.Trigger asChild>
          <span className="inline-block cursor-help">{children}</span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            className="
              z-50 
              overflow-hidden 
              rounded-md 
              border
              border-neutral-200
              dark:border-neutral-800
              bg-white 
              dark:bg-neutral-900 
              px-3 
              py-1.5 
              text-xs
              font-medium
              text-neutral-900
              dark:text-neutral-50
              shadow-md
              animate-in 
              fade-in-0 
              zoom-in-95 
              data-[state=closed]:animate-out 
              data-[state=closed]:fade-out-0 
              data-[state=closed]:zoom-out-95 
              data-[side=bottom]:slide-in-from-top-2 
              data-[side=left]:slide-in-from-right-2 
              data-[side=right]:slide-in-from-left-2 
              data-[side=top]:slide-in-from-bottom-2
            "
            sideOffset={5}
          >
            {content}
            <TooltipPrimitive.Arrow 
              className="fill-white dark:fill-neutral-900"
              width={11}
              height={5}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
} 