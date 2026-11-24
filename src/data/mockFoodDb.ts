import avocadoEggImg from '../assets/images/avocado_poached_egg_1794213153783.jpg';
import berryParfaitImg from '../assets/images/berry_yogurt_parfait_1794213153370.jpg';
import chickenSaladImg from '../assets/images/mediterranean_chicken_salad_1794213153567.jpg';
import salmonBowlImg from '../assets/images/salmon_grain_bowl_1794213151942.jpg';

export interface MockFoodItem {
  id: string;
  name: string;
  calories: number;
  protein: string;
  fat: string;
  carbs: string;
  good: string;
  bad: string;
  imageUrl?: string;
  fiber?: string;
  glycemicIndex?: number;
  sugarSpikeLevel?: string;
  advice?: string;
}

export const mockFoodDatabase: MockFoodItem[] = [
  {
    id: 'food_salmon',
    name: 'Salmon Grain Bowl',
    calories: 560,
    protein: '44g',
    fat: '23g',
    carbs: '36g',
    good: 'Omega-3 EPA/DHA & Complete Protein',
    bad: 'None',
    imageUrl: salmonBowlImg,
    fiber: '11g',
    glycemicIndex: 22,
    sugarSpikeLevel: 'Low',
  },
  {
    id: 'food_parfait',
    name: 'Berry Yogurt Parfait',
    calories: 310,
    protein: '28g',
    fat: '7g',
    carbs: '28g',
    good: 'Anthocyanins & Micellar Casein',
    bad: 'Natural Fruit Fructose',
    imageUrl: berryParfaitImg,
    fiber: '9g',
    glycemicIndex: 26,
    sugarSpikeLevel: 'Low',
  },
  {
    id: 'food_salad',
    name: 'Avocado Egg Toast',
    calories: 395,
    protein: '19g',
    fat: '21g',
    carbs: '33g',
    good: 'Healthy Monounsaturated Fats & Choline',
    bad: 'None',
    imageUrl: avocadoEggImg,
    fiber: '9g',
    glycemicIndex: 30,
    sugarSpikeLevel: 'Low',
  },
  {
    id: 'food_chicken',
    name: 'Mediterranean Chicken Salad',
    calories: 380,
    protein: '42g',
    fat: '14g',
    carbs: '16g',
    good: 'High Bioavailable Protein & Polyphenols',
    bad: 'None',
    imageUrl: chickenSaladImg,
    fiber: '7g',
    glycemicIndex: 18,
    sugarSpikeLevel: 'Low',
  },
];
