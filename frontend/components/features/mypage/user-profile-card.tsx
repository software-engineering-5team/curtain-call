import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { UserDto } from '@/lib/api-types';

interface Props { user: UserDto }

export function UserProfileCard({ user }: Props) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-1">{user.name}</h1>
            <p className="text-muted-foreground mb-3">{user.email}</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge variant="outline">국민대학교</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
