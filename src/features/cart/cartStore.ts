import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => item.variantId === newItem.variantId);
          if (existingItemIndex > -1) {
            // Cập nhật số lượng nếu đã tồn tại nhưng không vượt quá tồn kho (stock)
            const updatedItems = [...state.items];
            const newQuantity = Math.min(updatedItems[existingItemIndex].quantity + newItem.quantity, newItem.stock);
            updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], quantity: newQuantity };
            return { items: updatedItems };
          }
          // Thêm mới nếu chưa có
          return { items: [...state.items, newItem] };
        });
      },
      
      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }));
      },
      
      updateQuantity: (variantId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.variantId === variantId) {
               // Số lượng tối thiểu là 1, tối đa là stock
               const validQuantity = Math.max(1, Math.min(quantity, item.stock));
               return { ...item, quantity: validQuantity };
            }
            return item;
          }),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'baonam-cart-storage', // Tên lưu trong LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
