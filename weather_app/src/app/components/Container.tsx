import React from 'react'
import { cn } from '@/utils/cn';

// as here props will come in div.
export default function Container(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props} className={cn('w-full bg-white border-rounded-xl flex py-4 shadow-sm',props.className)}

    />
  );
}