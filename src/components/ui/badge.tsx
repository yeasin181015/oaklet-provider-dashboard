import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-slate-100 text-slate-700',
      outline: 'border border-slate-300 text-slate-700',
      // Status variants
      open: 'bg-blue-50 text-blue-700',
      in_progress: 'bg-yellow-50 text-yellow-700',
      pending_review: 'bg-purple-50 text-purple-700',
      resolved: 'bg-green-50 text-green-700',
      closed: 'bg-slate-100 text-slate-500',
      // Priority variants
      urgent: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      normal: 'bg-slate-100 text-slate-700',
      low: 'bg-slate-50 text-slate-500',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
