export interface MockFoodItem {
  id: string;
  name: string;
  calories: number;
  protein: string;
  fat: string;
  carbs: string;
  good: string;
  bad: string;
  imageUrl: string;
  fiber?: string;
}

export const mockFoodDatabase: MockFoodItem[] = [
  {
    id: 'food_pasta',
    name: 'Tomato Pasta',
    calories: 400,
    protein: '11g',
    fat: '8g',
    carbs: '74g',
    good: 'Lycopene & Low Saturated Fat',
    bad: 'High Carbs, Low Protein',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281781?auto=format&fit=crop&w=800&q=80',
    fiber: '4g',
  },
  {
    id: 'food_dosa',
    name: 'Masala Dosa',
    calories: 350,
    protein: '8g',
    fat: '12g',
    carbs: '52g',
    good: 'High Fiber',
    bad: 'Med Carbs',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    fiber: '7g',
  },
  {
    id: 'food_salad',
    name: 'Avocado Salad',
    calories: 250,
    protein: '5g',
    fat: '20g',
    carbs: '12g',
    good: 'Healthy Fats',
    bad: 'None',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    fiber: '8g',
  },
  {
    id: 'food_chicken',
    name: 'Chicken Breast',
    calories: 200,
    protein: '42g',
    fat: '3.6g',
    carbs: '0g',
    good: 'High Protein',
    bad: 'Low Micronutrient Diversity',
    imageUrl: '/src/assets/images/mediterranean_chicken_salad_1794213153567.jpg',
    fiber: '0g',
  },
];
