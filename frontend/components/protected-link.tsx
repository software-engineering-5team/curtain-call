'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { useAuth } from '@/lib/auth-context';
import { showAuthRequiredToast } from '@/lib/auth-toast';

type ProtectedLinkProps = ComponentProps<typeof Link>;

export function ProtectedLink({ children, className, onClick, ...props }: ProtectedLinkProps) {
  const { user, loading } = useAuth();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    if (!user) {
      event.preventDefault();
      showAuthRequiredToast();
      return;
    }
    onClick?.(event);
  };

  return (
    <Link {...props} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
