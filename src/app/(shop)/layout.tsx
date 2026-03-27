import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingZalo from '@/components/common/FloatingZalo';
import { getNavbarSettings } from '@/services/navbarService';

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const navItems = await getNavbarSettings();

  return (
    <>
      <Header initialNav={navItems} />
      <main className="flex-1 flex flex-col w-full relative">{children}</main>
      <Footer />
      <FloatingZalo />
    </>
  );
}
