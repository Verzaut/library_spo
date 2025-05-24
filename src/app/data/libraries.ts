export type Library = {
  id: string;
  name: string;
  address: string;
  district: string;
  workingHours: string;
  phone: string;
};

export const libraries: Library[] = [
  {
    id: '1',
    name: 'Центральная городская библиотека',
    address: 'ул. Ленина, 15',
    district: 'Центральный',
    workingHours: '09:00 - 20:00',
    phone: '+7 (999) 123-45-67'
  },
  {
    id: '2',
    name: 'Библиотека им. Пушкина',
    address: 'пр. Мира, 45',
    district: 'Октябрьский',
    workingHours: '10:00 - 19:00',
    phone: '+7 (999) 234-56-78'
  },
  {
    id: '3',
    name: 'Детская библиотека №1',
    address: 'ул. Гагарина, 28',
    district: 'Ленинский',
    workingHours: '09:00 - 18:00',
    phone: '+7 (999) 345-67-89'
  },
  {
    id: '4',
    name: 'Научная библиотека',
    address: 'ул. Университетская, 5',
    district: 'Академический',
    workingHours: '09:00 - 21:00',
    phone: '+7 (999) 456-78-90'
  },
  {
    id: '5',
    name: 'Библиотека им. Горького',
    address: 'ул. Советская, 76',
    district: 'Железнодорожный',
    workingHours: '10:00 - 20:00',
    phone: '+7 (999) 567-89-01'
  },
  {
    id: '6',
    name: 'Молодежная библиотека',
    address: 'пр. Победы, 120',
    district: 'Калининский',
    workingHours: '11:00 - 22:00',
    phone: '+7 (999) 678-90-12'
  },
  {
    id: '7',
    name: 'Историческая библиотека',
    address: 'ул. Старая, 15',
    district: 'Исторический',
    workingHours: '09:00 - 19:00',
    phone: '+7 (999) 789-01-23'
  },
  {
    id: '8',
    name: 'Библиотека искусств',
    address: 'ул. Театральная, 42',
    district: 'Центральный',
    workingHours: '10:00 - 20:00',
    phone: '+7 (999) 890-12-34'
  },
  {
    id: '9',
    name: 'Районная библиотека №3',
    address: 'ул. Парковая, 89',
    district: 'Заречный',
    workingHours: '09:00 - 18:00',
    phone: '+7 (999) 901-23-45'
  },
  {
    id: '10',
    name: 'Техническая библиотека',
    address: 'пр. Науки, 31',
    district: 'Политехнический',
    workingHours: '09:00 - 20:00',
    phone: '+7 (999) 012-34-56'
  }
]; 