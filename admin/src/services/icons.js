// src/services/icons.js
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io5';
import * as HiIcons from 'react-icons/hi';
import * as FiIcons from 'react-icons/fi';
import * as GiIcons from 'react-icons/gi';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as CgIcons from 'react-icons/cg';
import * as DiIcons from 'react-icons/di';
import * as FcIcons from 'react-icons/fc';
import * as ImIcons from 'react-icons/im';
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import * as TbIcons from 'react-icons/tb';
import * as TfiIcons from 'react-icons/tfi';
import * as WiIcons from 'react-icons/wi';

// Combine all icon libraries
export const iconLibraries = {
  fa: FaIcons,
  md: MdIcons,
  io: IoIcons,
  hi: HiIcons,
  fi: FiIcons,
  gi: GiIcons,
  ai: AiIcons,
  bi: BiIcons,
  bs: BsIcons,
  cg: CgIcons,
  di: DiIcons,
  fc: FcIcons,
  im: ImIcons,
  ri: RiIcons,
  si: SiIcons,
  tb: TbIcons,
  tfi: TfiIcons,
  wi: WiIcons,
};

// Common categories icons mapping for e-commerce
export const categoryIcons = [
  // ========== FASHION & APPAREL ==========
  { value: 'FaTshirt', label: 'T-Shirt', library: 'fa' },
  { value: 'FaShoePrints', label: 'Shoes', library: 'fa' },
  { value: 'FaShoppingBag', label: 'Handbag', library: 'fa' },
  { value: 'FaHatCowboy', label: 'Hat', library: 'fa' },
  { value: 'FaGlasses', label: 'Glasses', library: 'fa' },
  { value: 'FaRing', label: 'Jewelry', library: 'fa' },
  { value: 'FaGem', label: 'Gem', library: 'fa' },
  { value: 'FaUserTie', label: 'Suits', library: 'fa' },
  { value: 'FaTshirt', label: 'Clothing', library: 'fa' },
  { value: 'FaSocks', label: 'Socks', library: 'fa' },
  { value: 'FaScarf', label: 'Scarf', library: 'fa' },
  { value: 'FaBelt', label: 'Belt', library: 'fa' },
  { value: 'FaNeckTie', label: 'Tie', library: 'fa' },
  { value: 'FaFemale', label: 'Women', library: 'fa' },
  { value: 'FaMale', label: 'Men', library: 'fa' },
  { value: 'FaChild', label: 'Kids', library: 'fa' },
  { value: 'FaBaby', label: 'Baby', library: 'fa' },
  { value: 'MdWatch', label: 'Watch', library: 'md' },
  { value: 'MdDiamond', label: 'Diamond', library: 'md' },
  { value: 'GiConverseShoe', label: 'Sneakers', library: 'gi' },
  { value: 'GiHighHeel', label: 'High Heels', library: 'gi' },
  { value: 'GiRunningShoe', label: 'Running Shoes', library: 'gi' },
  { value: 'GiArmor', label: 'Accessories', library: 'gi' },
  { value: 'GiMonclerJacket', label: 'Jacket', library: 'gi' },
  { value: 'GiLargeDress', label: 'Dress', library: 'gi' },
  { value: 'GiShirt', label: 'Shirt', library: 'gi' },
  { value: 'GiJeans', label: 'Jeans', library: 'gi' },
  { value: 'GiUnderwearShorts', label: 'Underwear', library: 'gi' },
  { value: 'GiBallerinaShoes', label: 'Ballet Shoes', library: 'gi' },

  // ========== ELECTRONICS ==========
  { value: 'FaLaptop', label: 'Laptop', library: 'fa' },
  { value: 'FaMobileAlt', label: 'Smartphone', library: 'fa' },
  { value: 'FaTabletAlt', label: 'Tablet', library: 'fa' },
  { value: 'FaHeadphones', label: 'Headphones', library: 'fa' },
  { value: 'FaGamepad', label: 'Gaming', library: 'fa' },
  { value: 'FaCamera', label: 'Camera', library: 'fa' },
  { value: 'FaTv', label: 'TV', library: 'fa' },
  { value: 'FaDesktop', label: 'Desktop', library: 'fa' },
  { value: 'FaKeyboard', label: 'Keyboard', library: 'fa' },
  { value: 'FaMouse', label: 'Mouse', library: 'fa' },
  { value: 'FaMicrochip', label: 'CPU', library: 'fa' },
  { value: 'FaServer', label: 'Server', library: 'fa' },
  { value: 'FaPlug', label: 'Charger', library: 'fa' },
  { value: 'FaBatteryFull', label: 'Battery', library: 'fa' },
  { value: 'MdComputer', label: 'Computer', library: 'md' },
  { value: 'MdPhoneIphone', label: 'iPhone', library: 'md' },
  { value: 'MdSmartphone', label: 'Smartphone', library: 'md' },
  { value: 'MdHeadset', label: 'Headset', library: 'md' },
  { value: 'MdSpeaker', label: 'Speaker', library: 'md' },
  { value: 'MdVideogameAsset', label: 'Console', library: 'md' },
  { value: 'MdMemory', label: 'Memory', library: 'md' },
  { value: 'MdSmartDisplay', label: 'Smart Display', library: 'md' },
  { value: 'IoGameController', label: 'Game Controller', library: 'io' },
  { value: 'IoWatch', label: 'Smart Watch', library: 'io' },
  { value: 'IoTabletPortrait', label: 'Tablet', library: 'io' },
  { value: 'GiConsoleController', label: 'Controller', library: 'gi' },
  { value: 'GiPc', label: 'PC', library: 'gi' },
  { value: 'GiSmartphone', label: 'Smartphone', library: 'gi' },

  // ========== HOME & LIVING ==========
  { value: 'FaCouch', label: 'Sofa', library: 'fa' },
  { value: 'FaBed', label: 'Bed', library: 'fa' },
  { value: 'FaLightbulb', label: 'Lighting', library: 'fa' },
  { value: 'FaBath', label: 'Bath', library: 'fa' },
  { value: 'FaChair', label: 'Chair', library: 'fa' },
  { value: 'FaTable', label: 'Table', library: 'fa' },
  { value: 'FaWarehouse', label: 'Storage', library: 'fa' },
  { value: 'FaHome', label: 'Home', library: 'fa' },
  { value: 'MdKitchen', label: 'Kitchen', library: 'md' },
  { value: 'MdBathtub', label: 'Bathtub', library: 'md' },
  { value: 'MdKingBed', label: 'Bed', library: 'md' },
  { value: 'MdLiving', label: 'Living Room', library: 'md' },
  { value: 'MdBalcony', label: 'Balcony', library: 'md' },
  { value: 'MdYard', label: 'Garden', library: 'md' },
  { value: 'MdBlender', label: 'Blender', library: 'md' },
  { value: 'MdMicrowave', label: 'Microwave', library: 'md' },
  { value: 'MdCoffee', label: 'Coffee Maker', library: 'md' },
  { value: 'MdLocalLaundryService', label: 'Laundry', library: 'md' },
  { value: 'GiSofa', label: 'Sofa', library: 'gi' },
  { value: 'GiBed', label: 'Bed', library: 'gi' },
  { value: 'GiOfficeChair', label: 'Office Chair', library: 'gi' },
  { value: 'GiCookingPot', label: 'Cookware', library: 'gi' },
  { value: 'GiFridge', label: 'Refrigerator', library: 'gi' },
  { value: 'GiWashingMachine', label: 'Washing Machine', library: 'gi' },
  { value: 'GiVacuumCleaner', label: 'Vacuum', library: 'gi' },
  { value: 'GiCurtains', label: 'Curtains', library: 'gi' },
  { value: 'GiCandelabra', label: 'Lamp', library: 'gi' },

  // ========== BEAUTY & PERSONAL CARE ==========
  { value: 'FaSprayCan', label: 'Perfume', library: 'fa' },
  { value: 'FaPumpMedical', label: 'Health', library: 'fa' },
  { value: 'FaHeartbeat', label: 'Wellness', library: 'fa' },
  { value: 'FaPills', label: 'Medicine', library: 'fa' },
  { value: 'FaHandSparkles', label: 'Sanitizer', library: 'fa' },
  { value: 'MdFaceRetouchingNatural', label: 'Skincare', library: 'md' },
  { value: 'MdHealthAndSafety', label: 'Safety', library: 'md' },
  { value: 'MdSpa', label: 'Spa', library: 'md' },
  { value: 'MdShower', label: 'Shower', library: 'md' },
  { value: 'MdSoap', label: 'Soap', library: 'md' },
  { value: 'MdSmokingRooms', label: 'Cosmetics', library: 'md' },
  { value: 'GiLipstick', label: 'Makeup', library: 'gi' },
  { value: 'GiPowder', label: 'Powder', library: 'gi' },
  { value: 'GiSoap', label: 'Soap', library: 'gi' },
  { value: 'GiShampoo', label: 'Shampoo', library: 'gi' },
  { value: 'GiPerfumeBottle', label: 'Perfume', library: 'gi' },
  { value: 'GiRazor', label: 'Razor', library: 'gi' },
  { value: 'GiHairStrands', label: 'Hair Care', library: 'gi' },
  { value: 'GiTooth', label: 'Oral Care', library: 'gi' },

  // ========== SPORTS & OUTDOORS ==========
  { value: 'FaRunning', label: 'Running', library: 'fa' },
  { value: 'FaBasketballBall', label: 'Basketball', library: 'fa' },
  { value: 'FaFutbol', label: 'Football', library: 'fa' },
  { value: 'FaBaseballBall', label: 'Baseball', library: 'fa' },
  { value: 'FaBicycle', label: 'Cycling', library: 'fa' },
  { value: 'FaSwimmingPool', label: 'Swimming', library: 'fa' },
  { value: 'FaHiking', label: 'Hiking', library: 'fa' },
  { value: 'FaCampground', label: 'Camping', library: 'fa' },
  { value: 'MdSportsBasketball', label: 'Basketball', library: 'md' },
  { value: 'MdSportsTennis', label: 'Tennis', library: 'md' },
  { value: 'MdSportsHandball', label: 'Handball', library: 'md' },
  { value: 'MdFitnessCenter', label: 'Fitness', library: 'md' },
  { value: 'MdPool', label: 'Pool', library: 'md' },
  { value: 'MdSurfing', label: 'Surfing', library: 'md' },
  { value: 'GiSoccerBall', label: 'Soccer', library: 'gi' },
  { value: 'GiTennisBall', label: 'Tennis', library: 'gi' },
  { value: 'GiWeightLiftingUp', label: 'Gym', library: 'gi' },
  { value: 'GiBoxingGlove', label: 'Boxing', library: 'gi' },
  { value: 'GiBasketballBall', label: 'Basketball', library: 'gi' },
  { value: 'GiGolfFlag', label: 'Golf', library: 'gi' },
  { value: 'GiAmericanFootballPlayer', label: 'Football', library: 'gi' },
  { value: 'GiFishingPole', label: 'Fishing', library: 'gi' },
  { value: 'GiTent', label: 'Camping', library: 'gi' },

  // ========== BOOKS & STATIONERY ==========
  { value: 'FaBook', label: 'Book', library: 'fa' },
  { value: 'FaPen', label: 'Pen', library: 'fa' },
  { value: 'FaPencilAlt', label: 'Pencil', library: 'fa' },
  { value: 'FaHighlighter', label: 'Highlighter', library: 'fa' },
  { value: 'FaMarker', label: 'Marker', library: 'fa' },
  { value: 'MdMenuBook', label: 'Book', library: 'md' },
  { value: 'MdDraw', label: 'Art', library: 'md' },
  { value: 'MdSchool', label: 'Education', library: 'md' },
  { value: 'MdCreate', label: 'Create', library: 'md' },
  { value: 'MdNoteAdd', label: 'Notebook', library: 'md' },
  { value: 'GiNotebook', label: 'Notebook', library: 'gi' },
  { value: 'GiPencil', label: 'Pencil', library: 'gi' },
  { value: 'GiPen', label: 'Pen', library: 'gi' },
  { value: 'GiBookCover', label: 'Book Cover', library: 'gi' },

  // ========== FOOD & DRINK ==========
  { value: 'FaUtensils', label: 'Restaurant', library: 'fa' },
  { value: 'FaHamburger', label: 'Fast Food', library: 'fa' },
  { value: 'FaPizzaSlice', label: 'Pizza', library: 'fa' },
  { value: 'FaCoffee', label: 'Coffee', library: 'fa' },
  { value: 'FaWineBottle', label: 'Wine', library: 'fa' },
  { value: 'FaBeer', label: 'Beer', library: 'fa' },
  { value: 'FaCarrot', label: 'Vegetables', library: 'fa' },
  { value: 'FaAppleAlt', label: 'Fruits', library: 'fa' },
  { value: 'MdLocalPizza', label: 'Pizza', library: 'md' },
  { value: 'MdLocalDining', label: 'Dining', library: 'md' },
  { value: 'MdLocalCafe', label: 'Cafe', library: 'md' },
  { value: 'MdLocalBar', label: 'Bar', library: 'md' },
  { value: 'MdBakeryDining', label: 'Bakery', library: 'md' },
  { value: 'MdIcecream', label: 'Ice Cream', library: 'md' },
  { value: 'GiWineBottle', label: 'Wine', library: 'gi' },
  { value: 'GiFruitBowl', label: 'Fruits', library: 'gi' },
  { value: 'GiMeat', label: 'Meat', library: 'gi' },
  { value: 'GiFish', label: 'Fish', library: 'gi' },
  { value: 'GiBread', label: 'Bread', library: 'gi' },
  { value: 'GiCakeSlice', label: 'Cake', library: 'gi' },
  { value: 'GiCoffeeCup', label: 'Coffee', library: 'gi' },

  // ========== AUTOMOTIVE & VEHICLES ==========
  { value: 'FaCar', label: 'Car', library: 'fa' },
  { value: 'FaMotorcycle', label: 'Motorcycle', library: 'fa' },
  { value: 'FaTruck', label: 'Truck', library: 'fa' },
  { value: 'FaGasPump', label: 'Fuel', library: 'fa' },
  { value: 'FaTools', label: 'Tools', library: 'fa' },
  { value: 'MdDirectionsCar', label: 'Car', library: 'md' },
  { value: 'MdDirectionsBike', label: 'Bike', library: 'md' },
  { value: 'MdDirectionsBus', label: 'Bus', library: 'md' },
  { value: 'MdAirportShuttle', label: 'Shuttle', library: 'md' },
  { value: 'MdCarRepair', label: 'Repair', library: 'md' },
  { value: 'MdLocalGasStation', label: 'Gas Station', library: 'md' },
  { value: 'GiHelicopter', label: 'Helicopter', library: 'gi' },
  { value: 'GiCarKey', label: 'Car Key', library: 'gi' },
  { value: 'GiCarWheel', label: 'Wheel', library: 'gi' },
  { value: 'GiMotorcycle', label: 'Motorcycle', library: 'gi' },
  { value: 'GiBicycle', label: 'Bicycle', library: 'gi' },

  // ========== PET SUPPLIES ==========
  { value: 'FaPaw', label: 'Pets', library: 'fa' },
  { value: 'FaDog', label: 'Dog', library: 'fa' },
  { value: 'FaCat', label: 'Cat', library: 'fa' },
  { value: 'FaFish', label: 'Fish', library: 'fa' },
  { value: 'MdPets', label: 'Pets', library: 'md' },
  { value: 'GiDogHouse', label: 'Dog House', library: 'gi' },
  { value: 'GiCat', label: 'Cat', library: 'gi' },
  { value: 'GiDogBowl', label: 'Pet Food', library: 'gi' },

  // ========== TOYS & GAMES ==========
  { value: 'FaGamepad', label: 'Video Games', library: 'fa' },
  { value: 'FaDice', label: 'Board Games', library: 'fa' },
  { value: 'FaChess', label: 'Chess', library: 'fa' },
  { value: 'FaPuzzlePiece', label: 'Puzzle', library: 'fa' },
  { value: 'MdToys', label: 'Toys', library: 'md' },
  { value: 'GiCardboardBox', label: 'Toys', library: 'gi' },
  { value: 'GiTeddyBear', label: 'Teddy Bear', library: 'gi' },
  { value: 'GiPuzzle', label: 'Puzzle', library: 'gi' },

  // ========== OFFICE & BUSINESS ==========
  { value: 'FaBriefcase', label: 'Business', library: 'fa' },
  { value: 'FaCalculator', label: 'Calculator', library: 'fa' },
  { value: 'FaFileInvoice', label: 'Documents', library: 'fa' },
  { value: 'MdBusinessCenter', label: 'Business', library: 'md' },
  { value: 'MdPrint', label: 'Printer', library: 'md' },
  { value: 'MdScanner', label: 'Scanner', library: 'md' },
  { value: 'GiOfficeChair', label: 'Office', library: 'gi' },
  { value: 'GiDesk', label: 'Desk', library: 'gi' },

  // ========== JEWELRY & WATCHES ==========
  { value: 'FaGem', label: 'Jewelry', library: 'fa' },
  { value: 'FaRing', label: 'Ring', library: 'fa' },
  { value: 'FaNeckTie', label: 'Necklace', library: 'fa' },
  { value: 'MdWatch', label: 'Watch', library: 'md' },
  { value: 'MdDiamond', label: 'Diamond', library: 'md' },
  { value: 'GiBigDiamondRing', label: 'Diamond Ring', library: 'gi' },
  { value: 'GiNecklace', label: 'Necklace', library: 'gi' },
  { value: 'GiBracelet', label: 'Bracelet', library: 'gi' },

  // ========== HEALTH & FITNESS ==========
  { value: 'FaHeartbeat', label: 'Health', library: 'fa' },
  { value: 'FaRunning', label: 'Fitness', library: 'fa' },
  { value: 'FaDumbbell', label: 'Gym', library: 'fa' },
  { value: 'MdFitnessCenter', label: 'Fitness', library: 'md' },
  { value: 'GiWeightScale', label: 'Scale', library: 'gi' },
  { value: 'GiMedicines', label: 'Medicines', library: 'gi' },

  // ========== BABY & KIDS ==========
  { value: 'FaBaby', label: 'Baby', library: 'fa' },
  { value: 'FaChild', label: 'Kids', library: 'fa' },
  { value: 'MdChildCare', label: 'Child Care', library: 'md' },
  { value: 'GiBabyBottle', label: 'Baby Bottle', library: 'gi' },
  { value: 'GiBabyClothes', label: 'Baby Clothes', library: 'gi' },
  { value: 'GiStroller', label: 'Stroller', library: 'gi' },

  // ========== MUSIC & INSTRUMENTS ==========
  { value: 'FaGuitar', label: 'Guitar', library: 'fa' },
  { value: 'FaMusic', label: 'Music', library: 'fa' },
  { value: 'MdPiano', label: 'Piano', library: 'md' },
  { value: 'MdHeadphones', label: 'Headphones', library: 'md' },
  { value: 'GiGuitar', label: 'Guitar', library: 'gi' },
  { value: 'GiDrum', label: 'Drum', library: 'gi' },

  // ========== GARDEN & OUTDOORS ==========
  { value: 'FaSeedling', label: 'Gardening', library: 'fa' },
  { value: 'FaTree', label: 'Tree', library: 'fa' },
  { value: 'MdYard', label: 'Yard', library: 'md' },
  { value: 'GiGrass', label: 'Lawn', library: 'gi' },
  { value: 'GiFlowers', label: 'Flowers', library: 'gi' },

  // ========== TRAVEL & LUGGAGE ==========
  { value: 'FaSuitcase', label: 'Luggage', library: 'fa' },
  { value: 'FaPlane', label: 'Travel', library: 'fa' },
  { value: 'MdFlight', label: 'Flight', library: 'md' },
  { value: 'GiSuitcase', label: 'Suitcase', library: 'gi' },
  { value: 'GiLuggage', label: 'Luggage', library: 'gi' },

  // ========== DEFAULT / GENERAL ==========
  { value: 'FaTag', label: 'Tag', library: 'fa' },
  { value: 'MdCategory', label: 'Category', library: 'md' },
  { value: 'FaFolder', label: 'Folder', library: 'fa' },
  { value: 'FaBox', label: 'Package', library: 'fa' },
  { value: 'FaShoppingCart', label: 'Shopping Cart', library: 'fa' },
  { value: 'FaStore', label: 'Store', library: 'fa' },
  { value: 'FaGift', label: 'Gift', library: 'fa' },
  { value: 'FaStar', label: 'Star', library: 'fa' },
  { value: 'FaFire', label: 'Hot', library: 'fa' },
  { value: 'FaPercent', label: 'Sale', library: 'fa' },
  { value: 'FaTruck', label: 'Shipping', library: 'fa' },
  { value: 'MdLocalOffer', label: 'Offer', library: 'md' },
  { value: 'MdStorefront', label: 'Storefront', library: 'md' },
  { value: 'MdLocalShipping', label: 'Shipping', library: 'md' },
  { value: 'MdDiscount', label: 'Discount', library: 'md' },
  { value: 'GiPresent', label: 'Present', library: 'gi' },
  { value: 'GiPriceTag', label: 'Price Tag', library: 'gi' },
  { value: 'GiShoppingCart', label: 'Cart', library: 'gi' },
];

// Get icon component function (returns component, not JSX)
export const getIconComponent = (iconValue) => {
  if (!iconValue) return iconLibraries.fa.FaTag;
  
  // Check if it's emoji (starts with emoji)
  if (/^\p{Emoji}/u.test(iconValue)) {
    return null; // Return null for emojis
  }
  
  const icon = categoryIcons.find(i => i.value === iconValue);
  if (!icon) return iconLibraries.fa.FaTag;
  
  // Try to get the icon from the specified library
  const library = iconLibraries[icon.library];
  if (!library) return iconLibraries.fa.FaTag;
  
  return library[icon.value] || iconLibraries.fa.FaTag;
};

// Get icon info (no JSX here)
export const getIconInfo = (iconValue) => {
  if (!iconValue) return { label: 'Tag', library: 'fa', value: 'FaTag' };
  
  // Check if it's emoji
  if (/^\p{Emoji}/u.test(iconValue)) {
    return { 
      isEmoji: true, 
      value: iconValue, 
      label: 'Emoji', 
      library: null 
    };
  }
  
  const icon = categoryIcons.find(i => i.value === iconValue);
  return icon || { label: 'Tag', library: 'fa', value: 'FaTag' };
};

// Get icons by category (optional helper function)
export const getIconsByCategory = (category) => {
  // You can organize icons by category if needed
  const categories = {
    fashion: categoryIcons.filter(icon => 
      ['FaTshirt', 'FaShoePrints', 'FaShoppingBag', 'FaHatCowboy', 'FaGlasses', 'FaRing', 'FaGem', 'FaUserTie'].includes(icon.value)
    ),
    electronics: categoryIcons.filter(icon => 
      ['FaLaptop', 'FaMobileAlt', 'FaTabletAlt', 'FaHeadphones', 'FaGamepad', 'FaCamera', 'FaTv'].includes(icon.value)
    ),
    // Add more categories as needed
  };
  
  return categories[category] || [];
};

// Search icons by keyword
export const searchIcons = (keyword) => {
  return categoryIcons.filter(icon => 
    icon.label.toLowerCase().includes(keyword.toLowerCase()) ||
    icon.value.toLowerCase().includes(keyword.toLowerCase())
  );
};