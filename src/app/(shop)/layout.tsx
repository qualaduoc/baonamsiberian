import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingZalo from '@/components/common/FloatingZalo';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col w-full relative">{children}</main>
      <Footer />
      <FloatingZalo />
    </>
  );
}
