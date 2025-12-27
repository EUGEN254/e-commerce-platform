// Server-side shipping utilities (mirrors client logic)
const COUNTY_SHIPPING_RATES = {
  Nairobi: { price: 250, zone: "Nairobi Metropolitan" },
  Kiambu: { price: 280, zone: "Central" },
  "Murang'a": { price: 300, zone: "Central" },
  Nyeri: { price: 320, zone: "Central" },
  Kirinyaga: { price: 310, zone: "Central" },
  "Nyandarua": { price: 340, zone: "Central" },
  Meru: { price: 380, zone: "Eastern" },
  "Tharaka-Nithi": { price: 400, zone: "Eastern" },
  Embu: { price: 350, zone: "Eastern" },
  Mombasa: { price: 450, zone: "Coastal" },
  Kilifi: { price: 420, zone: "Coastal" },
  Kwale: { price: 460, zone: "Coastal" },
  Lamu: { price: 550, zone: "Coastal" },
  "Tana River": { price: 500, zone: "Coastal" },
  "Taita-Taveta": { price: 400, zone: "Coastal" },
  Machakos: { price: 300, zone: "Eastern" },
  Makueni: { price: 320, zone: "Eastern" },
  Kitui: { price: 350, zone: "Eastern" },
  Marsabit: { price: 620, zone: "Northern" },
  Isiolo: { price: 520, zone: "Northern" },
  Garissa: { price: 550, zone: "North Eastern" },
  Wajir: { price: 650, zone: "North Eastern" },
  Mandera: { price: 700, zone: "North Eastern" },
  Kisumu: { price: 380, zone: "Western" },
  Siaya: { price: 400, zone: "Western" },
  "Homa Bay": { price: 420, zone: "Western" },
  Migori: { price: 440, zone: "Western" },
  Kisii: { price: 390, zone: "Western" },
  Nyamira: { price: 400, zone: "Western" },
  Nakuru: { price: 320, zone: "Rift Valley" },
  Kericho: { price: 350, zone: "Rift Valley" },
  Bomet: { price: 370, zone: "Rift Valley" },
  Narok: { price: 380, zone: "Rift Valley" },
  Kajiado: { price: 300, zone: "Rift Valley" },
  Baringo: { price: 400, zone: "Rift Valley" },
  "Elgeyo-Marakwet": { price: 420, zone: "Rift Valley" },
  Laikipia: { price: 350, zone: "Rift Valley" },
  Nandi: { price: 360, zone: "Rift Valley" },
  Samburu: { price: 520, zone: "Northern" },
  "Trans-Nzoia": { price: 410, zone: "Rift Valley" },
  Turkana: { price: 600, zone: "Northern" },
  "Uasin Gishu": { price: 380, zone: "Rift Valley" },
  "West Pokot": { price: 480, zone: "Rift Valley" },
  Kakamega: { price: 400, zone: "Western" },
  Vihiga: { price: 390, zone: "Western" },
  Busia: { price: 420, zone: "Western" },
  Bungoma: { price: 410, zone: "Western" },
  Eldoret: { price: 380, zone: "Rift Valley" },
  Thika: { price: 280, zone: "Central" },
  Kitale: { price: 410, zone: "Rift Valley" },
  Malindi: { price: 460, zone: "Coastal" },
  Naivasha: { price: 310, zone: "Rift Valley" },
  Nanyuki: { price: 340, zone: "Central" },
  Kerugoya: { price: 310, zone: "Central" },
  Karatina: { price: 320, zone: "Central" },
  Kapsabet: { price: 360, zone: "Rift Valley" },
  Lodwar: { price: 600, zone: "Northern" },
  Moyale: { price: 700, zone: "Northern" },
};

const normalize = (str) => {
  if (!str) return "";
  return String(str).toLowerCase().trim().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ");
};

export const findCounty = (input) => {
  if (!input) return null;
  const n = normalize(input);
  for (const [county, data] of Object.entries(COUNTY_SHIPPING_RATES)) {
    if (normalize(county) === n) return { county, ...data };
  }
  for (const [county, data] of Object.entries(COUNTY_SHIPPING_RATES)) {
    const nc = normalize(county);
    if (nc.includes(n) || n.includes(nc)) return { county, ...data };
  }
  return null;
};

export const calculateShipping = (subtotal, county) => {
  const MIN_FREE = 5000;
  if (Number(subtotal) >= MIN_FREE) return 0;
  if (county) {
    const found = findCounty(county);
    return found ? found.price : 300;
  }
  return 300;
};

export default { COUNTY_SHIPPING_RATES, findCounty, calculateShipping };
