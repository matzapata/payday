import { cn } from '@/lib/utils';

export function BrandLogo(props: { className?: string }) {
  return <h1 className={cn('font-bold', props.className)}>$ PayDay</h1>;
}
