import Link from 'next/link';
import { ProtectedLink } from '@/components/protected-link';

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">KMU</span>
              </div>
              <span className="font-semibold text-foreground">복지관 공연장</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              국민대학교 복지관 공연장 대여 및<br />
              좌석 예매 플랫폼입니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">바로가기</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/performances" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  공연 목록
                </Link>
              </li>
              <li>
                <ProtectedLink href="/rental" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  대여 신청
                </ProtectedLink>
              </li>
              <li>
                <ProtectedLink href="/mypage" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  마이페이지
                </ProtectedLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">문의</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>국민대학교 학생처</li>
              <li>서울특별시 성북구 정릉로 77</li>
              <li>전화: 02-910-4114</li>
              <li>이메일: welfare@kookmin.ac.kr</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 국민대학교 복지관 공연장. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
