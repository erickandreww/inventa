import Link from "next/link";

type ProductFiltersProps = {
  categories: {
    id: string;
    name: string;
  }[];

  query: string;
  categoryId: string;
  status: string;
};

export function ProductFilters({
  categories,
  query,
  categoryId,
  status,
}: ProductFiltersProps) {
  return (
    <form 
      method="GET"
      className="mt-6 grid gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:grid-cols-[2fr_1fr_1fr_auto]"
    >
      <div>
        <label 
          htmlFor="query"
          className="block text-sm font-medium text-gray-700"
        >
          Search
        </label>
        <input 
          id="query"
          name="query" 
          type="search"
          defaultValue={query}
          placeholder="Search by name, SKU or description"
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-500" 
        />
      </div>

      <div>
        <label 
          htmlFor="categoryId"
          className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select 
          id="categoryId" 
          name="categoryId"
          defaultValue={categoryId}
          className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label 
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Stock status
        </label>
        <select 
          id="status" 
          name="status"
          defaultValue={status}
          className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
        >
          <option value="">All status</option>
          <option value="in">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
      </div>

      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Apply filters
        </button>
        <Link 
          href="/products"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear
        </Link>
      </div>
    </form>
  );
}