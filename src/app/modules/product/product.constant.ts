export type sizes = 'SM' | 'M' | 'L' | 'XL' | 'XXL' | '6mL' | '10mL' | '25mL';

export const sizesList: sizes[] = [
  'SM',
  'M',
  'L',
  'XL',
  'XXL',
  '6mL',
  '10mL',
  '25mL',
];
export type categories =
  | 'Jacket'
  | 'Hoodie'
  | 'Jersey'
  | 'Panjabi'
  | 'T-shirt'
  | 'Food'
  | 'Attar';

export const categoriesList: categories[] = [
  'Jacket',
  'Hoodie',
  'Jersey',
  'Panjabi',
  'T-shirt',
  'Attar',
  'Food',
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
