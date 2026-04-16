import { ProductDefinition } from './types';

export const PRODUCT_DEFINITIONS: ProductDefinition[] = [
  {
    type: 'RAM',
    attributes: [
      { id: 'brand', label: 'Marke', type: 'text', placeholder: 'z.B. Samsung, SK Hynix' },
      { id: 'capacity', label: 'Kapazität', type: 'text', placeholder: 'z.B. 8GB, 16GB' },
      { id: 'ramType', label: 'RAM Typ', type: 'select', options: ['Non-ECC', 'ECC'] },
      { id: 'memoryType', label: 'Speichertyp', type: 'select', options: ['UDIMM', 'RDIMM', 'LRDIMM', 'SO-DIMM'] },
      { id: 'frequency', label: 'Frequenz', type: 'text', placeholder: 'z.B. 2666, 3200' },
      { id: 'rank', label: 'Rank', type: 'text', placeholder: 'z.B. 1Rx8, 2Rx4' },
      { id: 'model', label: 'Modell', type: 'text', placeholder: 'z.B. M393A2K40BB1-CRC' },
    ],
  },
  {
    type: 'SSD',
    attributes: [
      { id: 'brand', label: 'Marke', type: 'text', placeholder: 'z.B. Samsung, WD' },
      { id: 'capacity', label: 'Kapazität', type: 'text', placeholder: 'z.B. 500GB, 1TB, 2TB' },
      { id: 'type', label: 'Typ', type: 'select', options: ['SATA', 'NVMe Gen3', 'NVMe Gen4', 'NVMe Gen5'] },
    ],
  },
  {
    type: 'CPU',
    attributes: [
      { id: 'brand', label: 'Marke', type: 'select', options: ['Intel', 'AMD'] },
      { id: 'socket', label: 'Sockel', type: 'text', placeholder: 'z.B. LGA 3647, SP3' },
      { id: 'generation', label: 'Generation', type: 'text', placeholder: 'z.B. v4, 2nd Gen' },
      { id: 'ramType', label: 'RAM Support', type: 'text', placeholder: 'z.B. DDR4 ECC' },
      { id: 'model', label: 'Modell', type: 'text', placeholder: 'z.B. Xeon Gold 6230' },
    ],
  },
  {
    type: 'GPU',
    attributes: [
      { id: 'brand', label: 'Marke', type: 'text', placeholder: 'z.B. ASUS, MSI, EVGA' },
      { id: 'chipset', label: 'Chipsatz', type: 'text', placeholder: 'z.B. RTX 4080, RX 7900 XTX' },
      { id: 'vram', label: 'VRAM', type: 'text', placeholder: 'z.B. 12GB, 16GB, 24GB' },
    ],
  },
];

export const MAINBOARD_DATA = {
  brands: ['ASUS', 'MSI', 'Gigabyte', 'ASRock', 'Supermicro', 'Dell', 'HP'],
  sockets: ['LGA 1700', 'LGA 1200', 'LGA 1151', 'AM4', 'AM5', 'LGA 2011-3', 'LGA 3647', 'SP3'],
  chipsets: {
    'LGA 1700': ['Z790', 'Z690', 'H610', 'B660', 'W680'],
    'AM5': ['X670E', 'X670', 'B650E', 'B650'],
    'LGA 3647': ['C621', 'C622'],
    'SP3': ['AMD 7001', 'AMD 7002', 'AMD 7003'],
  },
  formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX', 'Proprietary'],
};

export const RAM_DATA = {
  brands: ['Samsung', 'SK Hynix', 'Micron', 'Kingston', 'Crucial', 'Corsair', 'G.Skill'],
  frequencies: ['1600', '1866', '2133', '2400', '2666', '2933', '3200', '3600', '4800', '5200', '5600', '6000'],
  capacities: ['2GB', '4GB', '8GB', '16GB', '32GB', '64GB', '128GB', '256GB'],
  ranks: ['1Rx4', '1Rx8', '1Rx16', '2Rx4', '2Rx8', '4Rx4'],
  memoryTypes: {
    'ECC': ['UDIMM', 'RDIMM', 'LRDIMM'],
    'Non-ECC': ['UDIMM', 'SO-DIMM']
  },
  // Mock models for demonstration
  models: [
    // Samsung DDR4 Series (8GB)
    { brand: 'Samsung', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2400', model: 'M378A1K43CB2', rank: '1Rx8', capacity: '8GB' },
    { brand: 'Samsung', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2666', model: 'M378A1K43CB2-CTD', rank: '1Rx8', capacity: '8GB' },
    { brand: 'Samsung', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '3200', model: 'M378A1K43DB2-CWE', rank: '1Rx8', capacity: '8GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'UDIMM', frequency: '2400', model: 'M391A1K43BB1-CRC', rank: '1Rx8', capacity: '8GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'UDIMM', frequency: '2666', model: 'M391A1K43BB2-CTD', rank: '1Rx8', capacity: '8GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '2400', model: 'M393A1G40DB1-CRC', rank: '1Rx8', capacity: '8GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '2666', model: 'M393A1G40DB2-CTD', rank: '1Rx8', capacity: '8GB' },
    // Samsung DDR4 Series (16GB)
    { brand: 'Samsung', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2400', model: 'M378A2K43CB1', rank: '2Rx8', capacity: '16GB' },
    { brand: 'Samsung', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2666', model: 'M378A2K43CB1-CTD', rank: '2Rx8', capacity: '16GB' },
    { brand: 'Samsung', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '3200', model: 'M378A2K43DB1-CWE', rank: '2Rx8', capacity: '16GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'UDIMM', frequency: '2400', model: 'M391A2K43BB1-CRC', rank: '2Rx8', capacity: '16GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'UDIMM', frequency: '2666', model: 'M391A2K43BB2-CTD', rank: '2Rx8', capacity: '16GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '2400', model: 'M393A2K40BB1-CRC', rank: '2Rx8', capacity: '16GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '2666', model: 'M393A2K40BB2-CTD', rank: '2Rx8', capacity: '16GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '2933', model: 'M393A2K40DB3-CVF', rank: '2Rx8', capacity: '16GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '3200', model: 'M393A2K40DB3-CWE', rank: '2Rx8', capacity: '16GB' },
    // Samsung DDR4 Series (32GB)
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '2400', model: 'M393A4K40BB1-CRC', rank: '2Rx4', capacity: '32GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '2666', model: 'M393A4K40BB2-CTD', rank: '2Rx4', capacity: '32GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '2933', model: 'M393A4K40DB3-CVF', rank: '2Rx4', capacity: '32GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '3200', model: 'M393A4K40DB3-CWE', rank: '2Rx4', capacity: '32GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'LRDIMM', frequency: '2666', model: 'M386A4G40DM0-CPB', rank: '4Rx4', capacity: '32GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'LRDIMM', frequency: '2933', model: 'M386A4G40DM0-CVF', rank: '4Rx4', capacity: '32GB' },
    // Samsung DDR4 Series (64GB)
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '2666', model: 'M393A8G40MB2-CTD', rank: '2Rx4', capacity: '64GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '2933', model: 'M393A8G40MB2-CVF', rank: '2Rx4', capacity: '64GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'RDIMM', frequency: '3200', model: 'M393A8G40MB3-CWE', rank: '2Rx4', capacity: '64GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'LRDIMM', frequency: '2666', model: 'M386A8K40BM2-CPB', rank: '4Rx4', capacity: '64GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'LRDIMM', frequency: '2933', model: 'M386A8K40BM2-CVF', rank: '4Rx4', capacity: '64GB' },
    // Samsung DDR4 Series (128GB)
    { brand: 'Samsung', type: 'ECC', memoryType: 'LRDIMM', frequency: '2933', model: 'M386AAG40M32-CVF', rank: '4Rx4', capacity: '128GB' },
    { brand: 'Samsung', type: 'ECC', memoryType: 'LRDIMM', frequency: '3200', model: 'M386AAG40M32-CWE', rank: '4Rx4', capacity: '128GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '3200', model: 'HMA84GR7CJR4N', rank: '2Rx4', capacity: '32GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2666', model: 'HMA82GR7AFR8N', rank: '1Rx8', capacity: '16GB' },
    // SK Hynix DDR4 Series (4GB)
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2133', model: 'HMA451S6AFR8N-TF', rank: '1Rx8', capacity: '4GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2133', model: 'HMA451U6AFR8N-TF', rank: '1Rx8', capacity: '4GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2666', model: 'HMA851S6AFR6N-VK', rank: '1Rx16', capacity: '4GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2666', model: 'HMA851U6CJR6N-VK', rank: '1Rx16', capacity: '4GB' },
    // SK Hynix DDR4 Series (8GB)
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2133', model: 'HMA41GS6AFR8N-TF', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2133', model: 'HMA41GU6AFR8N-TF', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2133', model: 'HMA41GR7AFR4N-TF', rank: '2Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2400', model: 'HMA81GS6AFR8N-UH', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2400', model: 'HMA81GU6AFR8N-UH', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2400', model: 'HMA81GR7AFR8N-UH', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2666', model: 'HMA81GS6CJR8N-VK', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2666', model: 'HMA81GU6CJR8N-VK', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2666', model: 'HMA81GR7CJR8N-VK', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '3200', model: 'HMAA1GS6CJR6N-XN', rank: '1Rx16', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '3200', model: 'HMAA1GU6CJR6N-XN', rank: '1Rx16', capacity: '8GB' },
    // SK Hynix DDR4 Series (16GB)
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2133', model: 'HMA42GS6AFR4N-TF', rank: '2Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2133', model: 'HMA42GU6AFR4N-TF', rank: '2Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2133', model: 'HMA42GR7AFR4N-TF', rank: '2Rx4', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2400', model: 'HMA82GS6AFR8N-UH', rank: '2Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2400', model: 'HMA82GU6AFR8N-UH', rank: '2Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2400', model: 'HMA82GR7AFR8N-UH', rank: '2Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2666', model: 'HMA82GS6CJR8N-VK', rank: '2Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2666', model: 'HMA82GU6CJR8N-VK', rank: '2Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2666', model: 'HMA82GR7CJR4N-VK', rank: '2Rx4', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '3200', model: 'HMAA2GS6AJR8N-XN', rank: '1Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '3200', model: 'HMAA2GU6AJR8N-XN', rank: '1Rx8', capacity: '16GB' },
    // SK Hynix DDR4 Series (32GB)
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2400', model: 'HMA84GR7AFR4N-UH', rank: '2Rx4', capacity: '32GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2400', model: 'HMA84GU6AFR8N-UH', rank: '2Rx8', capacity: '32GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2666', model: 'HMA84GR7AFR4N-VK', rank: '2Rx4', capacity: '32GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2666', model: 'HMA84GS6AFR8N-VK', rank: '2Rx8', capacity: '32GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2933', model: 'HMA84GR7CJR4N-WM', rank: '2Rx4', capacity: '32GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '3200', model: 'HMAA4GR7AJR4N-XN', rank: '2Rx4', capacity: '32GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '3200', model: 'HMAA4GS6AJR8N-XN', rank: '2Rx8', capacity: '32GB' },
    // SK Hynix DDR4 Series (64GB)
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'LRDIMM', frequency: '2133', model: 'HMAA8GL7MFR4N-TF', rank: '4Rx4', capacity: '64GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'LRDIMM', frequency: '2400', model: 'HMAA8GL7AMR4N-UH', rank: '4Rx4', capacity: '64GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2666', model: 'HMAA8GR7AJR4N-VK', rank: '2Rx4', capacity: '64GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'LRDIMM', frequency: '2666', model: 'HMAA8GL7AMR4N-VK', rank: '4Rx4', capacity: '64GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2933', model: 'HMAA8GR7AJR4N-WM', rank: '2Rx4', capacity: '64GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '3200', model: 'HMAA8GR7AJR4N-XN', rank: '2Rx4', capacity: '64GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'LRDIMM', frequency: '3200', model: 'HMAA8GL7AJR4N-XN', rank: '4Rx4', capacity: '64GB' },
    // SK Hynix DDR4 Series (128GB)
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'LRDIMM', frequency: '2400', model: 'HMABAGL7MFR4N-UH', rank: '4Rx4', capacity: '128GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'LRDIMM', frequency: '2666', model: 'HMABAGL7MFR4N-VK', rank: '4Rx4', capacity: '128GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'LRDIMM', frequency: '2933', model: 'HMABAGL7AJR4N-WM', rank: '4Rx4', capacity: '128GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'LRDIMM', frequency: '3200', model: 'HMABAGL7AJR4N-XN', rank: '4Rx4', capacity: '128GB' },
    // SK Hynix DDR3 Series
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '1600', model: 'HMT325U6CFR8C-PB', rank: '1Rx8', capacity: '2GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '1600', model: 'HMT351U6CFR8C-PB', rank: '1Rx8', capacity: '4GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '1600', model: 'HMT41GU6MFR8C-PB', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '1866', model: 'HMT41GU6AFR8C-RD', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '1600', model: 'HMT325S6CFR8C-PB', rank: '1Rx8', capacity: '2GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '1600', model: 'HMT351S6CFR8C-PB', rank: '1Rx8', capacity: '4GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '1600', model: 'HMT451S6BFR8A-PB', rank: '1Rx8', capacity: '4GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '1600', model: 'HMT41GS6BFR8A-PB', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '1600', model: 'HMT31GR7CFR4C-PB', rank: '2Rx4', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '1866', model: 'HMT41GR7AFR8C-RD', rank: '2Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'LRDIMM', frequency: '1866', model: 'HMT84GL7AMR4C-RD', rank: '4Rx4', capacity: '32GB' },
    // SK Hynix 2400T Series
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2400', model: 'HMA851S6AFR6N-UH', rank: '1Rx16', capacity: '4GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2400', model: 'HMA851S6CJR6N-UH', rank: '1Rx16', capacity: '4GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2400', model: 'HMA81GS6AFR8N-UH', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2400', model: 'HMA81GS6MFR8N-UH', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2400', model: 'HMA82GS6AFR8N-UH', rank: '2Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '2400', model: 'HMA84GS6AFR8N-UH', rank: '2Rx8', capacity: '32GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2400', model: 'HMA851U6AFR6N-UH', rank: '1Rx16', capacity: '4GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2400', model: 'HMA81GU6AFR8N-UH', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2400', model: 'HMA81GU6MFR8N-UH', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2400', model: 'HMA82GU6AFR8N-UH', rank: '2Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2400', model: 'HMA82GU6MFR8N-UH', rank: '2Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2400', model: 'HMA81GR7AFR8N-UH', rank: '1Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2400', model: 'HMA41GR7AFR8N-UH', rank: '2Rx8', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2400', model: 'HMA82GR7AFR8N-UH', rank: '2Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '2400', model: 'HMA84GR7AFR4N-UH', rank: '2Rx4', capacity: '32GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'LRDIMM', frequency: '2400', model: 'HMAA8GL7AMR4N-UH', rank: '4Rx4', capacity: '64GB' },
    // SK Hynix DDR5 Series
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '4800', model: 'HMCG66AGBUA081N', rank: '1Rx16', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '4800', model: 'HMCG78AGBUA081N', rank: '1Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '4800', model: 'HMCG84AGBUA081N', rank: '2Rx8', capacity: '32GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '5600', model: 'HMCG78AGBJR084N', rank: '1Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '4800', model: 'HMCG66AGBSA092N', rank: '1Rx16', capacity: '8GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '4800', model: 'HMCG78AGBSA092N', rank: '1Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '4800', model: 'HMCG84AGBSA092N', rank: '2Rx8', capacity: '32GB' },
    { brand: 'SK Hynix', type: 'Non-ECC', memoryType: 'SO-DIMM', frequency: '5600', model: 'HMCG78AGBJR095N', rank: '1Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '4800', model: 'HMCG78AEBRA102N', rank: '1Rx8', capacity: '16GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '4800', model: 'HMCG84AEBRA102N', rank: '2Rx8', capacity: '32GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '4800', model: 'HMCG94MEBRA109N', rank: '2Rx4', capacity: '64GB' },
    { brand: 'SK Hynix', type: 'ECC', memoryType: 'RDIMM', frequency: '5600', model: 'HMCG94AGBRA177N', rank: '2Rx4', capacity: '64GB' },
    
    { brand: 'Micron', type: 'ECC', memoryType: 'LRDIMM', frequency: '3200', model: 'MTA72ASS8G72LZ', rank: '4Rx4', capacity: '64GB' },
    { brand: 'Micron', type: 'ECC', memoryType: 'RDIMM', frequency: '3200', model: 'MTA18ASF2G72PDZ', rank: '1Rx8', capacity: '16GB' },
    { brand: 'Kingston', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '3200', model: 'KVR32N22S8/8', rank: '1Rx8', capacity: '8GB' },
    { brand: 'Kingston', type: 'ECC', memoryType: 'UDIMM', frequency: '3200', model: 'KSM32ES8/8ME', rank: '1Rx8', capacity: '8GB' },
    { brand: 'Crucial', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '3200', model: 'CT8G4DFRA32A', rank: '1Rx8', capacity: '8GB' },
    { brand: 'Crucial', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '2666', model: 'CT16G4DFD8266', rank: '2Rx8', capacity: '16GB' },
    { brand: 'Corsair', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '3600', model: 'CMK16GX4M2D3600C18', rank: '1Rx8', capacity: '16GB' },
    { brand: 'Corsair', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '3200', model: 'CMK32GX4M2E3200C16', rank: '1Rx8', capacity: '32GB' },
    { brand: 'G.Skill', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '6000', model: 'F5-6000J3038F16GX2', rank: '1Rx8', capacity: '32GB' },
    { brand: 'G.Skill', type: 'Non-ECC', memoryType: 'UDIMM', frequency: '3200', model: 'F4-3200C16D-16GIS', rank: '1Rx8', capacity: '16GB' },
  ]
};

export const CPU_DATA = {
  brands: ['Intel', 'AMD'],
  sockets: ['LGA 2011', 'LGA 2011-3', 'LGA 3647', 'LGA 4677', 'SP3', 'SP5'],
  models: [
    // Intel Xeon E5 v1 / v2 (DDR3)
    { brand: 'Intel', model: 'Xeon E5-2620', socket: 'LGA 2011', generation: 'v1', ram: 'DDR3 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2630', socket: 'LGA 2011', generation: 'v1', ram: 'DDR3 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2650', socket: 'LGA 2011', generation: 'v1', ram: 'DDR3 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2670', socket: 'LGA 2011', generation: 'v1', ram: 'DDR3 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2680', socket: 'LGA 2011', generation: 'v1', ram: 'DDR3 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2690', socket: 'LGA 2011', generation: 'v1', ram: 'DDR3 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2620 v2', socket: 'LGA 2011', generation: 'v2', ram: 'DDR3 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2630 v2', socket: 'LGA 2011', generation: 'v2', ram: 'DDR3 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2650 v2', socket: 'LGA 2011', generation: 'v2', ram: 'DDR3 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2670 v2', socket: 'LGA 2011', generation: 'v2', ram: 'DDR3 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2680 v2', socket: 'LGA 2011', generation: 'v2', ram: 'DDR3 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2690 v2', socket: 'LGA 2011', generation: 'v2', ram: 'DDR3 ECC' },
    
    // Intel Xeon E5 v3 / v4 (DDR4)
    { brand: 'Intel', model: 'Xeon E5-2620 v3', socket: 'LGA 2011-3', generation: 'v3', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2630 v3', socket: 'LGA 2011-3', generation: 'v3', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2640 v3', socket: 'LGA 2011-3', generation: 'v3', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2650 v3', socket: 'LGA 2011-3', generation: 'v3', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2660 v3', socket: 'LGA 2011-3', generation: 'v3', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2670 v3', socket: 'LGA 2011-3', generation: 'v3', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2680 v3', socket: 'LGA 2011-3', generation: 'v3', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2690 v3', socket: 'LGA 2011-3', generation: 'v3', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2620 v4', socket: 'LGA 2011-3', generation: 'v4', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2630 v4', socket: 'LGA 2011-3', generation: 'v4', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2640 v4', socket: 'LGA 2011-3', generation: 'v4', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2650 v4', socket: 'LGA 2011-3', generation: 'v4', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2660 v4', socket: 'LGA 2011-3', generation: 'v4', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2670 v4', socket: 'LGA 2011-3', generation: 'v4', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2680 v4', socket: 'LGA 2011-3', generation: 'v4', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon E5-2690 v4', socket: 'LGA 2011-3', generation: 'v4', ram: 'DDR4 ECC' },

    // Intel Xeon Scalable (1st & 2nd Gen)
    { brand: 'Intel', model: 'Xeon Bronze 3104', socket: 'LGA 3647', generation: '1st Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Bronze 3106', socket: 'LGA 3647', generation: '1st Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Silver 4110', socket: 'LGA 3647', generation: '1st Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Silver 4210', socket: 'LGA 3647', generation: '2nd Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Gold 5118', socket: 'LGA 3647', generation: '1st Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Gold 5218', socket: 'LGA 3647', generation: '2nd Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Gold 6130', socket: 'LGA 3647', generation: '1st Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Gold 6230', socket: 'LGA 3647', generation: '2nd Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Platinum 8160', socket: 'LGA 3647', generation: '1st Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Platinum 8260', socket: 'LGA 3647', generation: '2nd Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Silver 4214', socket: 'LGA 3647', generation: '2nd Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Gold 5220', socket: 'LGA 3647', generation: '2nd Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Gold 6248', socket: 'LGA 3647', generation: '2nd Gen', ram: 'DDR4 ECC' },
    { brand: 'Intel', model: 'Xeon Platinum 8280', socket: 'LGA 3647', generation: '2nd Gen', ram: 'DDR4 ECC' },

    // Intel Xeon Scalable (4th Gen - Sapphire Rapids)
    { brand: 'Intel', model: 'Xeon Silver 4410Y', socket: 'LGA 4677', generation: '4th Gen', ram: 'DDR5 ECC' },
    { brand: 'Intel', model: 'Xeon Silver 4416+', socket: 'LGA 4677', generation: '4th Gen', ram: 'DDR5 ECC' },
    { brand: 'Intel', model: 'Xeon Gold 5416S', socket: 'LGA 4677', generation: '4th Gen', ram: 'DDR5 ECC' },
    { brand: 'Intel', model: 'Xeon Gold 6426Y', socket: 'LGA 4677', generation: '4th Gen', ram: 'DDR5 ECC' },
    { brand: 'Intel', model: 'Xeon Gold 6430', socket: 'LGA 4677', generation: '4th Gen', ram: 'DDR5 ECC' },
    { brand: 'Intel', model: 'Xeon Platinum 8460Y', socket: 'LGA 4677', generation: '4th Gen', ram: 'DDR5 ECC' },
    { brand: 'Intel', model: 'Xeon Platinum 8480+', socket: 'LGA 4677', generation: '4th Gen', ram: 'DDR5 ECC' },

    // AMD EPYC 7001 (Naples)
    { brand: 'AMD', model: 'EPYC 7251', socket: 'SP3', generation: '7001', ram: 'DDR4 ECC' },
    { brand: 'AMD', model: 'EPYC 7301', socket: 'SP3', generation: '7001', ram: 'DDR4 ECC' },
    { brand: 'AMD', model: 'EPYC 7401', socket: 'SP3', generation: '7001', ram: 'DDR4 ECC' },
    { brand: 'AMD', model: 'EPYC 7501', socket: 'SP3', generation: '7001', ram: 'DDR4 ECC' },
    { brand: 'AMD', model: 'EPYC 7601', socket: 'SP3', generation: '7001', ram: 'DDR4 ECC' },

    // AMD EPYC 7002 (Rome)
    { brand: 'AMD', model: 'EPYC 7302', socket: 'SP3', generation: '7002', ram: 'DDR4 ECC' },
    { brand: 'AMD', model: 'EPYC 7402', socket: 'SP3', generation: '7002', ram: 'DDR4 ECC' },
    { brand: 'AMD', model: 'EPYC 7502', socket: 'SP3', generation: '7002', ram: 'DDR4 ECC' },
    { brand: 'AMD', model: 'EPYC 7702', socket: 'SP3', generation: '7002', ram: 'DDR4 ECC' },

    // AMD EPYC 7003 (Milan)
    { brand: 'AMD', model: 'EPYC 7313', socket: 'SP3', generation: '7003', ram: 'DDR4 ECC' },
    { brand: 'AMD', model: 'EPYC 7443', socket: 'SP3', generation: '7003', ram: 'DDR4 ECC' },
    { brand: 'AMD', model: 'EPYC 7543', socket: 'SP3', generation: '7003', ram: 'DDR4 ECC' },
    { brand: 'AMD', model: 'EPYC 7713', socket: 'SP3', generation: '7003', ram: 'DDR4 ECC' },

    // AMD EPYC 9004 (Genoa)
    { brand: 'AMD', model: 'EPYC 9124', socket: 'SP5', generation: '9004', ram: 'DDR5 ECC' },
    { brand: 'AMD', model: 'EPYC 9224', socket: 'SP5', generation: '9004', ram: 'DDR5 ECC' },
    { brand: 'AMD', model: 'EPYC 9334', socket: 'SP5', generation: '9004', ram: 'DDR5 ECC' },
    { brand: 'AMD', model: 'EPYC 9454', socket: 'SP5', generation: '9004', ram: 'DDR5 ECC' },
    { brand: 'AMD', model: 'EPYC 9654', socket: 'SP5', generation: '9004', ram: 'DDR5 ECC' },
  ]
};

export const LOCATIONS = ['Lager A', 'Lager B', 'Technikraum', 'Versand'];
export const CHANNELS = ['Lager', 'Verkauf', 'Dringend', 'Allgemein'];

export const SUGGESTIONS: Record<string, string[]> = {
  brand: ['Corsair', 'G.Skill', 'Samsung', 'Western Digital', 'Crucial', 'Kingston', 'Intel', 'AMD', 'ASUS', 'MSI', 'Gigabyte', 'EVGA'],
  capacity: ['8GB', '16GB', '32GB', '64GB', '250GB', '500GB', '1TB', '2TB', '4TB'],
  frequency: ['2400MHz', '2666MHz', '3000MHz', '3200MHz', '3600MHz', '4800MHz', '5200MHz', '5600MHz', '6000MHz'],
  socket: ['AM4', 'AM5', 'LGA1200', 'LGA1700', 'LGA1151', 'LGA 2011', 'LGA 2011-3', 'LGA 3647', 'LGA 4677', 'SP3', 'SP5'],
};
