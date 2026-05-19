'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useAuth } from '@/lib/auth-context';
import { showAuthRequiredToast } from '@/lib/auth-toast';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, loginWithGoogle, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const handleProtectedClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    if (user) return;
    e.preventDefault();
    setMobileMenuOpen(false);
    showAuthRequiredToast();
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">KMU</span>
            </div>
            <span className="font-semibold text-foreground hidden sm:block">복지관 공연장</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              홈
            </Link>
            <Link href="/performances" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              공연 목록
            </Link>
            <Link
              href="/rental"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleProtectedClick}
            >
              대여 신청
            </Link>
            <Link
              href="/mypage"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleProtectedClick}
            >
              마이페이지
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/mypage">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  로그아웃
                </Button>
              </div>
            ) : (
              <Button size="sm" className="gap-2" onClick={loginWithGoogle}>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                구글로 로그인
              </Button>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="flex flex-col p-4 gap-2">
            <Link href="/" className="px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
              홈
            </Link>
            <Link href="/performances" className="px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
              공연 목록
            </Link>
            <Link href="/rental" className="px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors" onClick={handleProtectedClick}>
              대여 신청
            </Link>
            <Link href="/mypage" className="px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors" onClick={handleProtectedClick}>
              마이페이지
            </Link>
            <div className="pt-2 border-t border-border mt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-4 py-2 text-sm text-muted-foreground">{user.name}님으로 로그인됨</div>
                  <Button size="sm" variant="outline" className="mx-4" onClick={handleLogout}>
                    로그아웃
                  </Button>
                </div>
              ) : (
                <Button size="sm" className="w-full gap-2" onClick={() => { loginWithGoogle(); setMobileMenuOpen(false); }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  구글로 로그인
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
