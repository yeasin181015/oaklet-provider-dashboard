'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

interface SearchInputProps {
  queryKey: string;
  placeholder?: string;
}

export function SearchInput({ queryKey, placeholder = 'Search...' }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get(queryKey) ?? '');

  // Sync with URL when browser navigates back/forward
  useEffect(() => {
    setValue(searchParams.get(queryKey) ?? '');
  }, [searchParams, queryKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set(queryKey, value.trim());
      } else {
        params.delete(queryKey);
      }
      params.delete('page');
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className='relative'>
      <Search className={`absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 ${isPending ? 'text-blue-400' : 'text-slate-400'}`} />
      <Input
        type='search'
        className='pl-8'
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

export function SearchInputSkeleton() {
  return <div className='h-9 animate-pulse rounded-md bg-slate-100' />;
}
