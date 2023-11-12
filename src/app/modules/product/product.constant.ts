export type categories =
  | 'Jacket'
  | 'Hoodie'
  | 'Jersey'
  | 'Panjabi'
  | 'T-shirt'
  | 'Borka'
  | 'Attar';

export const categoriesList: categories[] = [
  'Jacket',
  'Hoodie',
  'Jersey',
  'Panjabi',
  'T-shirt',
  'Borka',
  'Attar',
];

export const productFilterableField = [
  'searchTerm',
  'name',
  'availability',
  'category',
  'lowestPrice',
  'highestPrice',
  'description',
];
export const productSearchableField = ['description', 'name', 'category'];
