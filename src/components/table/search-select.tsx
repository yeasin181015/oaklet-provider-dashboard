'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchSelectProps {
  queryKey: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function SearchSelect({ queryKey, options, placeholder = 'All', className }: SearchSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const current = searchParams.get(queryKey) ?? 'all';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(queryKey);
    } else {
      params.set(queryKey, value);
    }
    params.delete('page');
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Select value={current} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>{placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SearchSelectSkeleton({ className }: { className?: string }) {
  return <div className={`h-9 animate-pulse rounded-md bg-slate-100 ${className ?? ''}`} />;
}
