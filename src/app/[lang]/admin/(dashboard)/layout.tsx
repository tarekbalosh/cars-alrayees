import { ReactNode } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Car, Tags, Calendar, LogOut, Users, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const session = await getServerSession(authOptions);

  // Fallback protection if middleware misses it
  if (!session) {
    redirect(`/${lang}/admin/login`);
  }

  const navItems = [
    { name: 'Dashboard', href: `/${lang}/admin`, icon: LayoutDashboard },
    { name: 'Cars', href: `/${lang}/admin/cars`, icon: Car },
    { name: 'Categories', href: `/${lang}/admin/categories`, icon: Tags },
    { name: 'Bookings', href: `/${lang}/admin/bookings`, icon: Calendar },
    { name: 'Customers', href: `/${lang}/admin/customers`, icon: Users },
    { name: 'Payments', href: `/${lang}/admin/payments`, icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <form action="/api/auth/signout" method="POST">
            <input type="hidden" name="csrfToken" value="" />
            <Button type="submit" variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
