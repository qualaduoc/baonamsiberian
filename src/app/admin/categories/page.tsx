import CategoryManager from "@/components/admin/CategoryManager";
import { getCategories } from "@/services/categoryService";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold font-heading text-on-surface mb-8">Quản Lý Danh Mục</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
