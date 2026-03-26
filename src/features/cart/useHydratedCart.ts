import { useState, useEffect } from 'react';
import { useCartStore } from './cartStore';

// Hook để xử lý tình trạng SSR mismatch khi Next.js render lần đầu (hydrate)
// Khi isHydrated = true thì mới cho hiển thị phần Giỏ hàng lấy từ LocalStorage
export const useHydratedCart = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useCartStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    ...store,
    isHydrated,
  };
};
