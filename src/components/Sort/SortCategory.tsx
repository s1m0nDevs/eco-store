import React from 'react';

const categoryClasses =
  'py-2 px-4 cursor-pointer mr-4 text-base font-bold rounded-full bg-gray-200 hover:bg-gray-300';
const activeCategoryClasses =
  'py-2 px-4 cursor-pointer mr-4 text-base font-bold bg-black rounded-full text-white';

export const SortCategory = ({
  categories,
  activeCategory,
  categoryHandler,
}: {
  categories: string[];
  activeCategory: number;
  categoryHandler: (index: number) => void;
}) => {
  return (
    <div className="categories">
      <ul className="flex">
        {categories.map((category: string, index: number) => (
          <li
            key={category + index}
            className={activeCategory === index ? activeCategoryClasses : categoryClasses}
            onClick={categoryHandler.bind(null, index)}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};
