import { useState, useEffect, createContext, useContext } from 'react';

// ── Google Fonts ──────────────────────────────────────────────────────────────
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap';
document.head.appendChild(fontLink);

// ── Colour tokens ──────────────────────────────────────────────────────────────
const C = {
  burgundy: '#6B1A2A',
  burgundyDark: '#4A1020',
  burgundyLight: '#8B2A3A',
  parchment: '#F5EDD8',
  parchmentDark: '#EDE0C4',
  gold: '#C9973A',
  goldLight: '#E0B05A',
  text: '#2C1810',
  textLight: '#6B5344',
  white: '#FFFFFF',
  shadow: 'rgba(107,26,42,0.18)',
};

// ── Language context ───────────────────────────────────────────────────────────
const LangCtx = createContext('geo');

// ── localStorage helpers ───────────────────────────────────────────────────────
const ls = {
  get: (key, fallback) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

// ── Seed data ──────────────────────────────────────────────────────────────────
const SEED_MENU = [
  // Khinkali
  { id: 1, category: 'khinkali', nameGeo: 'ხინკალი ხორცით', nameEng: 'Meat Khinkali',
    descGeo: 'ხელნაკეთი ხინკალი სურნელოვანი საქონლისა და ღორის ხორცის ნაზავით, ახლად დაქუცმაცებული სანელებლებით.',
    descEng: 'Handcrafted dumplings filled with a fragrant blend of beef and pork, seasoned with freshly ground spices.',
    price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=80' },
  { id: 2, category: 'khinkali', nameGeo: 'ხინკალი სოკოთი', nameEng: 'Mushroom Khinkali',
    descGeo: 'ტყის სოკოს ნაზავი ახლად დაჭრილ მწვანილებთან ერთად — ვეგეტარიანული შედევრი.',
    descEng: 'Forest mushroom medley with freshly chopped herbs — a vegetarian masterpiece.',
    price: 2.00, imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80' },
  { id: 3, category: 'khinkali', nameGeo: 'ხინკალი ყველით', nameEng: 'Cheese Khinkali',
    descGeo: 'ქართული სულუგუნის ყველი, ოდნავ მარილიანი და გამდნარი — სიყვარულით შეკრული.',
    descEng: 'Georgian sulguni cheese, lightly salted and melted — wrapped with love.',
    price: 2.20, imageUrl: 'https://images.unsplash.com/photo-1585565804112-f201f68c48b4?w=400&q=80' },
  { id: 4, category: 'khinkali', nameGeo: 'ხინკალი კარტოფილით', nameEng: 'Potato Khinkali',
    descGeo: 'ნაზი კარტოფილი, ახალი ნიორი და მწვანილი — სარეცხი კომფორტი ჯამში.',
    descEng: 'Tender potato, fresh garlic and herbs — the ultimate comfort in a dumpling.',
    price: 1.80, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80' },
  // Appetizers
  { id: 5, category: 'appetizers', nameGeo: 'ბადრიჯანი ნიგვზით', nameEng: 'Eggplant with Walnut',
    descGeo: 'შებოლილი ბადრიჯანი, ნიგვზის მდიდარი სოუსი ახალ მწვანილებთან ერთად — ქართული სამზარეულოს კლასიკა.',
    descEng: 'Smoked eggplant rolled with rich walnut paste and fresh herbs — a Georgian classic.',
    price: 9.50, imageUrl: 'https://images.unsplash.com/photo-1601001435957-74f8cd230a91?w=400&q=80' },
  { id: 6, category: 'appetizers', nameGeo: 'ფხალი', nameEng: 'Pkhali Assortment',
    descGeo: 'ჭარხლის, ისპანახის და კომბოსტოს ბურთულები, ნიგვზის პასტითა და ბროწეულის მარცვლებით.',
    descEng: 'Beet, spinach, and cabbage balls with walnut paste, topped with pomegranate seeds.',
    price: 8.00, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  { id: 7, category: 'appetizers', nameGeo: 'ხაჭაპური', nameEng: 'Adjaruli Khachapuri',
    descGeo: 'ადჟარული ხაჭაპური — ნავისებური პური, ყველით, კვერცხითა და კარაქით.',
    descEng: 'Adjaruli bread boat filled with melted cheese, egg, and butter.',
    price: 14.00, imageUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&q=80' },
  { id: 8, category: 'appetizers', nameGeo: 'სოკო კარაქში', nameEng: 'Mushrooms in Butter',
    descGeo: 'ახლად კრეფილი ტყის სოკო, ნივრის კარაქში შემწვარი, თაზის სიამოვნება.',
    descEng: 'Freshly picked forest mushrooms sautéed in garlic butter — a simple pleasure.',
    price: 10.00, imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  // Mains
  { id: 9, category: 'mains', nameGeo: 'მწვადი', nameEng: 'Mtsvadi (Shashlik)',
    descGeo: 'ყაჩაღური ნახშირზე მომზადებული ღვინოში გამოჟღება მსხვილ ნაჭრებად, ახლად კრეფილი ბოსტნეულით.',
    descEng: 'Marinated skewered pork grilled over vine charcoal, served with fresh vegetables.',
    price: 22.00, imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80' },
  { id: 10, category: 'mains', nameGeo: 'ჩაქაფული', nameEng: 'Chakapuli',
    descGeo: 'ბატკნის ხორცი გარეული ტარხუნას, მწვანე ქლიავისა და ღვინის სოუსში — გაზაფხულის გემო.',
    descEng: 'Spring lamb stew with wild tarragon, green plums, and white wine — the taste of spring.',
    price: 26.00, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80' },
  { id: 11, category: 'mains', nameGeo: 'ოჯახური', nameEng: 'Ojakhuri',
    descGeo: 'შეწვილი ღორის ხორცი კარტოფილთან ერთად, ნიორ-ნარგიზის სოუსში, ქართულ ტრადიციებს ემყარება.',
    descEng: 'Pan-fried pork with potatoes in a garlic-herb sauce — rooted in Georgian tradition.',
    price: 18.00, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { id: 12, category: 'mains', nameGeo: 'ქათამი საწვნიანი', nameEng: 'Chicken Satsivi',
    descGeo: 'ქათმის ხორცი ნიგვზის სოუსში — ყარამელოვანი გემოთი და ქართული სანელებლებით.',
    descEng: 'Chicken in a rich walnut sauce with Georgian spices — silky, warming, unforgettable.',
    price: 20.00, imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80' },
  // Tsomeluli
  { id: 17, category: 'tsomeluli', nameGeo: 'ხაჭაპური იმერული', nameEng: 'Imeruli Khachapuri',
    descGeo: 'ტრადიციული იმერული ხაჭაპური — ბრტყელი, ყველით სავსე, ოქროსფრად გამომცხვარი.',
    descEng: 'Traditional Imeruli khachapuri — flat, cheese-filled, golden-baked to perfection.',
    price: 12.00, imageUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400&q=80' },
  { id: 18, category: 'tsomeluli', nameGeo: 'ლობიანი', nameEng: 'Lobiani',
    descGeo: 'ახლად გამომცხვარი პური, სუნელებიანი ლობიოს შიგთავსით — ქართული სოფლის გემო.',
    descEng: 'Freshly baked bread filled with spiced beans — the taste of Georgian countryside.',
    price: 10.00, imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7b?w=400&q=80' },
  { id: 19, category: 'tsomeluli', nameGeo: 'მჭადი', nameEng: 'Mchadi',
    descGeo: 'სიმინდის ფქვილის ტრადიციული კვერი, ხრიალა გარსით და ნაზი შიგნით — ყველთან გახსენება.',
    descEng: 'Traditional cornbread with a crisp crust and soft center — perfect alongside cheese.',
    price: 5.00, imageUrl: 'https://images.unsplash.com/photo-1603046891744-56b9bed75163?w=400&q=80' },
  { id: 20, category: 'tsomeluli', nameGeo: 'გოზინაყი', nameEng: 'Gozinaki',
    descGeo: 'თხილისა და ნიგვზის ნაზავი თაფლში — ტრადიციული ქართული სიტკბო.',
    descEng: 'Walnut and hazelnut brittle in honey glaze — a traditional Georgian sweet.',
    price: 7.00, imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80' },
  // Soup / წვნიანი
  { id: 21, category: 'soup', nameGeo: 'ხაშლამა', nameEng: 'Khashlama',
    descGeo: 'ნელ-ნელა მოხარშული ბატკნის ხორცი ბოსტნეულთან ერთად — მდიდარი, გამაგრებელი ბულიონი.',
    descEng: 'Slow-simmered lamb with vegetables — a rich, restorative broth.',
    price: 16.00, imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80' },
  { id: 22, category: 'soup', nameGeo: 'ჩიხირთმა', nameEng: 'Chikhirtma',
    descGeo: 'ქართული ქათმის სუპი კვერცხის გულითა და ლიმონით — მსუბუქი და სურნელოვანი.',
    descEng: 'Georgian chicken soup with egg yolk and lemon — light and aromatic.',
    price: 12.00, imageUrl: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400&q=80' },
  { id: 23, category: 'soup', nameGeo: 'ხარჩო', nameEng: 'Kharcho',
    descGeo: 'საქონლის ხორცის მდიდარი სუპი ბრინჯით, ნიგვზით და ქართული სანელებლებით.',
    descEng: 'Rich beef soup with rice, walnut, and Georgian spices — bold and warming.',
    price: 14.00, imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  { id: 24, category: 'soup', nameGeo: 'ლობიო სუპი', nameEng: 'Bean Soup',
    descGeo: 'ახლად მოხარშული ლობიო კამათ-ნარგიზის სოუსში, სათვალით მოცული.',
    descEng: 'Freshly boiled beans in a herb-rich broth, garnished with coriander.',
    price: 10.00, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  // Dessert / დესერტი
  { id: 25, category: 'dessert', nameGeo: 'ჩურჩხელა', nameEng: 'Churchkhela',
    descGeo: 'ყურძნის წვენში გახვეული თხილი — ქართული ეროვნული სიტკბო.',
    descEng: 'Walnuts dipped in thickened grape juice — Georgia\'s iconic sweet.',
    price: 6.00, imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80' },
  { id: 26, category: 'dessert', nameGeo: 'ბაკლავა', nameEng: 'Baklava',
    descGeo: 'ფენოვანი ცომი თაფლსა და ნიგვზში — ნაზი, ტკბილი, გამდნარი.',
    descEng: 'Layered filo with honey and walnuts — delicate, sweet, melting.',
    price: 8.00, imageUrl: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80' },
  { id: 27, category: 'dessert', nameGeo: 'ნამცხვარი', nameEng: 'Georgian Cake',
    descGeo: 'ახლად გამომცხვარი სეზონური ნამცხვარი — ყოველ კვირას სხვადასხვა.',
    descEng: 'Freshly baked seasonal cake — different every week.',
    price: 9.00, imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80' },
  { id: 28, category: 'dessert', nameGeo: 'თაფლი ნიგვზით', nameEng: 'Honey & Walnuts',
    descGeo: 'ქართული მთის თაფლი გახეთქილ ნიგვზთან — მარტივი სიდიადე.',
    descEng: 'Georgian mountain honey with cracked walnuts — simple greatness.',
    price: 7.00, imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80' },
  // Garnish / გარნირი
  { id: 29, category: 'garnish', nameGeo: 'შემწვარი კარტოფილი', nameEng: 'Fried Potatoes',
    descGeo: 'ოქროსფრად შემწვარი კარტოფილი ნივრითა და კამათლით.',
    descEng: 'Golden fried potatoes with garlic and fresh herbs.',
    price: 7.00, imageUrl: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&q=80' },
  { id: 30, category: 'garnish', nameGeo: 'ბრინჯი', nameEng: 'Steamed Rice',
    descGeo: 'ნაორთქლალი თეთრი ბრინჯი — ნებისმიერი კერძის შესანიშნავი თანმხლები.',
    descEng: 'Steamed white rice — the perfect companion to any dish.',
    price: 5.00, imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9c785?w=400&q=80' },
  { id: 31, category: 'garnish', nameGeo: 'გრილზე შემწვარი ბოსტნეული', nameEng: 'Grilled Vegetables',
    descGeo: 'სეზონური ბოსტნეული გრილზე — ბადრიჯანი, კიტრი, წიწაკა, პომიდორი.',
    descEng: 'Seasonal vegetables on the grill — eggplant, zucchini, pepper, tomato.',
    price: 9.00, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  { id: 32, category: 'garnish', nameGeo: 'ლობიო', nameEng: 'Lobio (Beans)',
    descGeo: 'ქართული ტრადიციული ლობიო სუნელებითა და ნიორის ზეთით.',
    descEng: 'Traditional Georgian spiced beans with garlic oil.',
    price: 8.00, imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80' },
  // Sauce / სოუსი
  { id: 33, category: 'sauce', nameGeo: 'ტყემლი', nameEng: 'Tkemali (Plum Sauce)',
    descGeo: 'ქართული გარეული ქლიავის სოუსი — მჟავე, ნიორიანი, ვიტამინებით სავსე.',
    descEng: 'Georgian wild plum sauce — tart, garlicky, full of character.',
    price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80' },
  { id: 34, category: 'sauce', nameGeo: 'საცივი სოუსი', nameEng: 'Satsivi Sauce',
    descGeo: 'ნიგვზის კრემი ქართული სანელებლებით — კერძის გვირგვინი.',
    descEng: 'Walnut cream with Georgian spices — the crown of any dish.',
    price: 4.00, imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80' },
  { id: 35, category: 'sauce', nameGeo: 'აჯიკა', nameEng: 'Adjika',
    descGeo: 'ქართულ-აფხაზური ცხარე სოუსი წიწაკით, ნიორით და სანელებლებით.',
    descEng: 'Georgian-Abkhazian spicy sauce with pepper, garlic, and herbs.',
    price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80' },
  { id: 36, category: 'sauce', nameGeo: 'ნიგვზის სოუსი', nameEng: 'Walnut Sauce',
    descGeo: 'გახეთქილი ნიგვზი, ნიორი და სანელებლები — ყველა კერძთან შესაფერი.',
    descEng: 'Ground walnut, garlic, and spices — pairs with everything.',
    price: 4.00, imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80' },
  // Makali / მაყალი
  { id: 37, category: 'makali', nameGeo: 'მაყალი (ასორტი)', nameEng: 'Pickles Assortment',
    descGeo: 'სეზონური კახური მაყალი — კიტრი, კომბოსტო, ბადრიჯანი, წიწაკა.',
    descEng: 'Seasonal Kakhetian pickles — cucumber, cabbage, eggplant, pepper.',
    price: 8.00, imageUrl: 'https://images.unsplash.com/photo-1601001435957-74f8cd230a91?w=400&q=80' },
  { id: 38, category: 'makali', nameGeo: 'მწნილი კიტრი', nameEng: 'Pickled Cucumbers',
    descGeo: 'ქვევრის ბრინჯო-მწნილი კიტრი ტარხუნასა და ნიორის ფოთლებით.',
    descEng: 'Crock-fermented cucumbers with tarragon and garlic leaves.',
    price: 5.00, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  { id: 39, category: 'makali', nameGeo: 'მწნილი ბადრიჯანი', nameEng: 'Pickled Eggplant',
    descGeo: 'ნიგვზით გაჭყლეტილი მწნილი ბადრიჯანი — მჟავე, ნიორიანი სურნელი.',
    descEng: 'Walnut-stuffed pickled eggplant — tangy, garlicky, irresistible.',
    price: 6.00, imageUrl: 'https://images.unsplash.com/photo-1601001435957-74f8cd230a91?w=400&q=80' },
  { id: 40, category: 'makali', nameGeo: 'მწნილი კომბოსტო', nameEng: 'Pickled Cabbage',
    descGeo: 'სახლში დამზადებული ჭარხლის ფერის კომბოსტოს მწნილი — ყოველი სუფრის შემამკობელი.',
    descEng: 'Home-made beet-stained cabbage pickle — a staple of every Georgian table.',
    price: 5.00, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  // Salati / სალათი
  { id: 41, category: 'salati', nameGeo: 'ქართული სალათი', nameEng: 'Georgian Salad',
    descGeo: 'ახალი პომიდორი, კიტრი, ბულგარული წიწაკა, ხახვი — მსუბუქი ზეთითა და კამათლით.',
    descEng: 'Fresh tomato, cucumber, bell pepper, onion — light oil and coriander dressing.',
    price: 8.00, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  { id: 42, category: 'salati', nameGeo: 'სალათი ბადრიჯნით', nameEng: 'Eggplant Salad',
    descGeo: 'შეწვილი ბადრიჯანი, ახალი პომიდორი, ნიორი, კამა — ზაფხულის სიახლე.',
    descEng: 'Roasted eggplant, fresh tomato, garlic and dill — a summer favourite.',
    price: 9.00, imageUrl: 'https://images.unsplash.com/photo-1601001435957-74f8cd230a91?w=400&q=80' },
  { id: 43, category: 'salati', nameGeo: 'ჭარხლის სალათი', nameEng: 'Beet Salad',
    descGeo: 'მოხარშული ჭარხალი, ნიგვზი, ნიორი — ფერადი, მდიდარი, ბროწეულით შემკული.',
    descEng: 'Boiled beet, walnut, garlic — vibrant and rich, topped with pomegranate.',
    price: 8.00, imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&q=80' },
  { id: 44, category: 'salati', nameGeo: 'კობის სალათი', nameEng: 'Cabbage Slaw',
    descGeo: 'ახალი კომბოსტო, სტაფილო, კამა — მსუბუქი, ხრიალა, გამაგრილებელი.',
    descEng: 'Fresh cabbage, carrot, dill — light, crunchy, refreshing.',
    price: 6.00, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  // Drinks
  { id: 13, category: 'drinks', nameGeo: 'ყვარელი წითელი', nameEng: 'Kvareli Red Wine',
    descGeo: 'ყახეთის ვენახებიდან, ბოლო მოსავლის საუკეთესო ყურძენი. მდიდარი, ხავერდოვანი.',
    descEng: 'From Kakheti vineyards — the finest grapes of the last harvest. Rich and velvety.',
    price: 28.00, imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80' },
  { id: 14, category: 'drinks', nameGeo: 'ლიმონათი', nameEng: 'Georgian Lemonade',
    descGeo: 'ხელნაკეთი ლიმონათი სეზონური ხილით — ნარინჯი, ბროწეული, პიტნა.',
    descEng: 'House-made lemonade with seasonal fruit — orange, pomegranate, and mint.',
    price: 6.00, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80' },
  { id: 15, category: 'drinks', nameGeo: 'ყავა ქართული', nameEng: 'Georgian Copper Coffee',
    descGeo: 'სპილენძის ყავიდან მომზადებული ახლად დაფქული ყავა, კარდამომის შეხებით.',
    descEng: 'Freshly ground coffee brewed in a copper cezve with a touch of cardamom.',
    price: 5.00, imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
  { id: 16, category: 'drinks', nameGeo: 'ვარდის ჩაი', nameEng: 'Rose Hip Tea',
    descGeo: 'გარეული ვარდის ბულბული — ივლისის შუაგულში კრეფილი, ახალი და არომატული.',
    descEng: 'Wild rosehip blend — harvested midsummer, fresh and aromatic.',
    price: 4.50, imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80' },
];

const SEED_GALLERY = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80',
  'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&q=80',
  'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=600&q=80',
];

const SEED_SETTINGS = {
  nameGeo: 'ასი ხინკალი',
  nameEng: 'Asi Khinkali',
  taglineGeo: 'სადაც ყოველი ხინკალი თხრობაა',
  taglineEng: 'Where every khinkali tells a story',
  address: 'ილია ჭავჭავაძის გამზ. 14, თბილისი / 14 Ilia Chavchavadze Ave, Tbilisi',
  phone: '+995 32 222 33 44',
  hours: 'ყოველდღე 12:00 – 23:00 / Daily 12:00 – 23:00',
};

function initStorage() {
  const existing = ls.get('asikhinkali_menu', null);
  if (!existing) {
    ls.set('asikhinkali_menu', SEED_MENU);
  } else {
    // add any seed items whose category is missing from the stored menu
    const newCats = ['tsomeluli','soup','dessert','garnish','sauce','makali','salati'];
    const missing = newCats.filter(cat => !existing.some(i => i.category === cat));
    if (missing.length > 0) {
      const newItems = SEED_MENU.filter(i => missing.includes(i.category));
      ls.set('asikhinkali_menu', [...existing, ...newItems]);
    }
  }
  if (!ls.get('asikhinkali_gallery', null)) ls.set('asikhinkali_gallery', SEED_GALLERY);
  if (!ls.get('asikhinkali_settings', null)) ls.set('asikhinkali_settings', SEED_SETTINGS);
  if (!ls.get('asikhinkali_bookings', null)) ls.set('asikhinkali_bookings', []);
}

// ── Responsive style injection ────────────────────────────────────────────────
const styleEl = document.createElement('style');
styleEl.textContent = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { background: #F5EDD8; font-family: 'Inter', sans-serif; }
  input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.6); cursor: pointer; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #1A0A0E; }
  ::-webkit-scrollbar-thumb { background: #6B1A2A; border-radius: 3px; }
  select option { background: #4A1020; color: #F5EDD8; }
  .nav-desktop { display: flex !important; }
  .hamburger-btn { display: none !important; }
  @media (max-width: 768px) {
    .nav-desktop { display: none !important; }
    .hamburger-btn { display: flex !important; }
    .hero-title { font-size: 36px !important; }
    .about-grid { grid-template-columns: 1fr !important; }
    .footer-grid { grid-template-columns: 1fr !important; }
    .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .res-form { grid-template-columns: 1fr !important; }
    .res-form .full-col { grid-column: auto !important; }
    .admin-form-grid { grid-template-columns: 1fr !important; }
    .admin-form-grid .full-col { grid-column: auto !important; }
    .menu-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important; }
  }
  .menu-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(107,26,42,0.22) !important; }
  .cat-tabs::-webkit-scrollbar { display: none; }
  .gallery-img:hover { transform: scale(1.04); }
  .hero-btn:hover { transform: translateY(-2px); background-color: #E0B05A !important; }
  .nav-link:hover { background-color: rgba(255,255,255,0.12) !important; }
  .float-btn:hover { background-color: #C9973A !important; color: #6B1A2A !important; }
`;
document.head.appendChild(styleEl);

// ── Time options ───────────────────────────────────────────────────────────────
function timeOptions() {
  const opts = [];
  for (let h = 12; h <= 22; h++) {
    opts.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 22) opts.push(`${String(h).padStart(2, '0')}:30`);
  }
  return opts;
}

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ message, show }) {
  return (
    <div style={{
      position: 'fixed', bottom: 100, left: '50%',
      transform: `translateX(-50%) translateY(${show ? 0 : 16}px)`,
      backgroundColor: '#276749', color: '#fff',
      padding: '14px 32px', borderRadius: 40, fontSize: 15, fontWeight: 600,
      boxShadow: '0 8px 32px rgba(0,0,0,0.35)', opacity: show ? 1 : 0,
      transition: 'all 0.4s cubic-bezier(.4,0,.2,1)', zIndex: 9999,
      pointerEvents: 'none', whiteSpace: 'nowrap',
    }}>
      {message}
    </div>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────────
function Header({ lang, setLang, settings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goto = (id) => { setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  const navItems = [
    { id: 'menu',         geo: 'მენიუ',       eng: 'Menu' },
    { id: 'reservations', geo: 'დაჯავშნა',    eng: 'Reservations' },
    { id: 'about',        geo: 'ჩვენ შესახებ', eng: 'About' },
    { id: 'gallery',      geo: 'გალერეა',     eng: 'Gallery' },
  ];

  const hdr = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    backgroundColor: C.burgundy,
    boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.35)' : '0 2px 16px rgba(0,0,0,0.2)',
    transition: 'box-shadow 0.3s',
  };

  return (
    <header style={hdr}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <img src="/logo.svg" alt="logo" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
          <div style={{ fontFamily: "'Playfair Display', serif", color: C.gold, fontSize: 21, fontWeight: 700, lineHeight: 1.2 }}>
            {lang === 'geo' ? settings.nameGeo : settings.nameEng}
            <span style={{ color: 'rgba(245,237,216,0.65)', fontSize: 12, fontFamily: "'Inter', sans-serif", fontWeight: 400, display: 'block', marginTop: 1 }}>
              {lang === 'geo' ? settings.nameEng : settings.nameGeo}
            </span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navItems.map(n => (
            <button key={n.id} className="nav-link"
              style={{ background: 'none', border: 'none', color: C.parchment, fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '8px 14px', borderRadius: 8, transition: 'background 0.2s', letterSpacing: '0.02em' }}
              onClick={() => goto(n.id)}>
              {lang === 'geo' ? n.geo : n.eng}
            </button>
          ))}
          {/* Lang toggle */}
          <div style={{ display: 'flex', border: `1px solid ${C.gold}`, borderRadius: 20, overflow: 'hidden', marginLeft: 8 }}>
            {['geo', 'eng'].map(l => (
              <button key={l} onClick={() => setLang(l)}
                style={{ background: lang === l ? C.gold : 'transparent', color: lang === l ? C.burgundy : C.gold, border: 'none', padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all 0.2s', letterSpacing: '0.05em' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>

        {/* Hamburger */}
        <button className="hamburger-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}
          onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
          {[0,1,2].map(i => <div key={i} style={{ width: 24, height: 2, background: C.parchment, borderRadius: 2 }} />)}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ backgroundColor: C.burgundyDark, padding: '12px 24px 24px' }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => goto(n.id)}
              style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)', color: C.parchment, fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 500, padding: '13px 0', cursor: 'pointer' }}>
              {lang === 'geo' ? n.geo : n.eng}
            </button>
          ))}
          <div style={{ display: 'flex', border: `1px solid ${C.gold}`, borderRadius: 20, overflow: 'hidden', marginTop: 16, width: 'fit-content' }}>
            {['geo', 'eng'].map(l => (
              <button key={l} onClick={() => setLang(l)}
                style={{ background: lang === l ? C.gold : 'transparent', color: lang === l ? C.burgundy : C.gold, border: 'none', padding: '8px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function Hero({ lang, settings }) {
  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: 580, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(107,26,42,0.88) 0%, rgba(74,16,32,0.72) 55%, rgba(201,151,58,0.28) 100%)' }} />
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 820 }}>
        <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(38px, 8vw, 82px)', fontWeight: 700, color: C.white, lineHeight: 1.12, marginBottom: 12, textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>
          {lang === 'geo' ? settings.nameGeo : settings.nameEng}
        </h1>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(17px, 3vw, 27px)', fontStyle: 'italic', color: C.goldLight, marginBottom: 44, textShadow: '0 2px 12px rgba(0,0,0,0.4)', lineHeight: 1.4 }}>
          {lang === 'geo' ? settings.taglineGeo : settings.taglineEng}
        </p>
        <button className="hero-btn"
          style={{ backgroundColor: C.gold, color: C.burgundy, border: 'none', padding: '17px 44px', fontSize: 16, fontWeight: 700, borderRadius: 40, cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.3s', boxShadow: '0 4px 24px rgba(201,151,58,0.55)' }}
          onClick={() => document.getElementById('reservations')?.scrollIntoView({ behavior: 'smooth' })}>
          {lang === 'geo' ? 'დაჯავშნე მაგიდა' : 'Reserve a Table'}
        </button>
      </div>
    </section>
  );
}

// ── Lightbox ────────────────────────────────────────────────────────────────────
function Lightbox({ item, lang, onClose }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div onClick={onClose}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()}
        style={{ position: 'relative', maxWidth: 780, width: '100%', backgroundColor: C.burgundyDark, borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
        <img src={item.imageUrl} alt={lang === 'geo' ? item.nameGeo : item.nameEng}
          style={{ width: '100%', maxHeight: '65vh', objectFit: 'cover', display: 'block' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'; }} />
        <div style={{ padding: '20px 28px 28px' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.gold, marginBottom: 8 }}>
            {lang === 'geo' ? item.nameGeo : item.nameEng}
          </div>
          <div style={{ fontSize: 15, color: 'rgba(245,237,216,0.75)', lineHeight: 1.7, marginBottom: 16 }}>
            {lang === 'geo' ? item.descGeo : item.descEng}
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.gold }}>
            ₾ {Number(item.price).toFixed(2)}
          </div>
        </div>
        <button onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', border: `1px solid rgba(255,255,255,0.3)`, color: C.white, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
          ✕
        </button>
      </div>
    </div>
  );
}

// ── Menu Section ───────────────────────────────────────────────────────────────
function MenuSection({ lang, menuItems }) {
  const cats = [
    { key: 'khinkali',   geo: 'ხინკალი',  eng: 'Khinkali' },
    { key: 'appetizers', geo: 'მადა',      eng: 'Appetizers' },
    { key: 'mains',      geo: 'მთავარი',   eng: 'Mains' },
    { key: 'tsomeluli',  geo: 'ცომეული',   eng: 'Pastries' },
    { key: 'soup',       geo: 'წვნიანი',   eng: 'Soups' },
    { key: 'dessert',    geo: 'დესერტი',   eng: 'Desserts' },
    { key: 'garnish',    geo: 'გარნირი',   eng: 'Sides' },
    { key: 'sauce',      geo: 'სოუსი',     eng: 'Sauces' },
    { key: 'makali',     geo: 'მაყალი',    eng: 'Pickles' },
    { key: 'salati',     geo: 'სალათი',    eng: 'Salads' },
    { key: 'drinks',     geo: 'სასმელი',   eng: 'Drinks' },
  ];
  const [active, setActive] = useState('khinkali');
  const [lightbox, setLightbox] = useState(null);
  const filtered = menuItems.filter(i => i.category === active);

  return (
    <div style={{ backgroundColor: C.parchment, overflow: 'hidden' }}>
      <section id="menu" style={{ padding: '88px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.burgundy, textAlign: 'center', marginBottom: 12 }}>
          {lang === 'geo' ? 'მენიუ' : 'Our Menu'}
        </h2>
        <div style={{ width: 56, height: 3, backgroundColor: C.gold, margin: '0 auto 12px', borderRadius: 2 }} />
        <p style={{ textAlign: 'center', color: C.textLight, fontSize: 16, fontStyle: 'italic', marginBottom: 44 }}>
          {lang === 'geo' ? 'ქართული სამზარეულო გულისხმიერებით' : 'Georgian cuisine crafted with heart'}
        </p>

        {/* Tabs */}
        <div className="cat-tabs" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 44 }}>
          {cats.map(c => (
            <button key={c.key} onClick={() => setActive(c.key)}
              style={{ backgroundColor: active === c.key ? C.burgundy : 'transparent', color: active === c.key ? C.white : C.burgundy, border: `2px solid ${C.burgundy}`, padding: '9px 20px', borderRadius: 30, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.25s', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>
              {lang === 'geo' ? c.geo : c.eng}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {filtered.map(item => (
            <div key={item.id} className="menu-card"
              style={{ backgroundColor: C.white, borderRadius: 16, overflow: 'hidden', boxShadow: `0 4px 20px ${C.shadow}`, transition: 'transform 0.25s, box-shadow 0.25s' }}>
              <img src={item.imageUrl} alt={item.nameEng}
                style={{ width: '100%', height: 184, objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                onClick={() => setLightbox(item)}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80'; }} />
              <div style={{ padding: '16px 20px 22px' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: C.burgundy, marginBottom: 6 }}>
                  {lang === 'geo' ? item.nameGeo : item.nameEng}
                </div>
                <div style={{ fontSize: 13, color: C.textLight, lineHeight: 1.65, marginBottom: 14 }}>
                  {lang === 'geo' ? item.descGeo : item.descEng}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.gold }}>
                  ₾ {Number(item.price).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {lightbox && <Lightbox item={lightbox} lang={lang} onClose={() => setLightbox(null)} />}
      </section>
    </div>
  );
}

// ── Reservations ───────────────────────────────────────────────────────────────
function ReservationsSection({ lang, showToast }) {
  const blank = { name: '', phone: '', date: '', time: '12:00', guests: '2', notes: '' };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.date) e.date = true;
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const bookings = ls.get('asikhinkali_bookings', []);
    bookings.unshift({ id: Date.now(), ...form, status: 'pending', createdAt: new Date().toISOString() });
    ls.set('asikhinkali_bookings', bookings);
    setForm(blank);
    setErrors({});
    showToast(lang === 'geo' ? 'დაჯავშვნა დადასტურებულია! ✓' : 'Reservation confirmed! ✓');
  };

  const inp = (field) => ({
    width: '100%', padding: '12px 16px', borderRadius: 10, fontSize: 14, fontFamily: "'Inter', sans-serif",
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
    backgroundColor: 'rgba(255,255,255,0.1)', color: C.white,
    border: `1px solid ${errors[field] ? '#FF6B6B' : 'rgba(255,255,255,0.22)'}`,
  });
  const sel = { ...inp(''), border: '1px solid rgba(255,255,255,0.22)' };
  const lbl = { display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(245,237,216,0.75)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' };

  return (
    <div id="reservations" style={{ backgroundColor: C.burgundy, padding: '88px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,44px)', color: C.parchment, textAlign: 'center', marginBottom: 12 }}>
          {lang === 'geo' ? 'მაგიდის დაჯავშნა' : 'Table Reservations'}
        </h2>
        <div style={{ width: 56, height: 3, backgroundColor: C.gold, margin: '0 auto 12px', borderRadius: 2 }} />
        <p style={{ textAlign: 'center', color: 'rgba(245,237,216,0.65)', fontSize: 16, fontStyle: 'italic', marginBottom: 52 }}>
          {lang === 'geo' ? 'გაგვაცანით, ვინ ნახულობს ჩვენ' : "Let us know you're coming"}
        </p>

        <form onSubmit={submit} className="res-form" style={{ maxWidth: 720, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          <div>
            <label style={lbl}>{lang === 'geo' ? 'სახელი და გვარი *' : 'Full Name *'}</label>
            <input style={inp('name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder={lang === 'geo' ? 'გიორგი კვირიკაშვილი' : 'John Smith'} />
          </div>
          <div>
            <label style={lbl}>{lang === 'geo' ? 'ტელეფონი *' : 'Phone *'}</label>
            <input style={inp('phone')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+995 5XX XXX XXX" />
          </div>
          <div>
            <label style={lbl}>{lang === 'geo' ? 'თარიღი *' : 'Date *'}</label>
            <input type="date" style={inp('date')} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label style={lbl}>{lang === 'geo' ? 'დრო' : 'Time'}</label>
            <select style={sel} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
              {timeOptions().map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>{lang === 'geo' ? 'სტუმართა რაოდენობა' : 'Number of Guests'}</label>
            <select style={sel} value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n} {lang === 'geo' ? 'სტუმარი' : n === 1 ? 'guest' : 'guests'}</option>
              ))}
            </select>
          </div>
          <div className="full-col" style={{ gridColumn: '1 / -1' }}>
            <label style={lbl}>{lang === 'geo' ? 'სპეციალური სურვილი' : 'Special Requests'}</label>
            <textarea style={{ ...inp(''), border: '1px solid rgba(255,255,255,0.22)', resize: 'vertical', minHeight: 96 }}
              value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder={lang === 'geo' ? 'ალერგიები, განსაკუთრებული დასხდომა...' : 'Allergies, special seating...'} />
          </div>
          <div className="full-col" style={{ gridColumn: '1 / -1' }}>
            <button type="submit"
              style={{ width: '100%', backgroundColor: C.gold, color: C.burgundy, border: 'none', padding: '16px', fontSize: 16, fontWeight: 700, borderRadius: 10, cursor: 'pointer', letterSpacing: '0.04em', transition: 'background 0.2s', fontFamily: "'Inter', sans-serif" }}>
              {lang === 'geo' ? 'მაგიდის დაჯავშნა' : 'Book a Table'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── About Section ──────────────────────────────────────────────────────────────
function AboutSection({ lang }) {
  return (
    <div style={{ backgroundColor: C.parchment }}>
      <section id="about" style={{ padding: '88px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.burgundy, textAlign: 'center', marginBottom: 12 }}>
          {lang === 'geo' ? 'ჩვენ შესახებ' : 'About Us'}
        </h2>
        <div style={{ width: 56, height: 3, backgroundColor: C.gold, margin: '0 auto 52px', borderRadius: 2 }} />

        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Text */}
          <div>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: C.textLight, marginBottom: 20 }}>
              {lang === 'geo'
                ? '2014 წელს, თბილისის გულში, გაიხსნა ასი ხინკალი — ადგილი, სადაც ქართული სამზარეულოს ტრადიციები შეხვდა თანამედროვე გემოვნებას. ჩვენი ხელოსანი მზარეულები ყოველდღე ამზადებენ ხინკალს ოჯახური რეცეპტებით, ახალი, ადგილობრივი პროდუქტებით — ისე, როგორც ეს საუკუნეების წინ კეთდებოდა.'
                : 'Founded in 2014 in the heart of Tbilisi, Asi Khinkali was born from a simple conviction: that Georgian culinary tradition deserves a home where it can breathe, evolve, and be shared. Our artisan chefs prepare every dumpling by hand, using family recipes passed through generations — the way it has always been done.'}
            </p>
            <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontStyle: 'italic', color: C.burgundy, borderLeft: `4px solid ${C.gold}`, paddingLeft: 20, margin: '28px 0', lineHeight: 1.5 }}>
              {lang === 'geo'
                ? '"ყოველი ხინკალი — ეს პატარა სამყაროა, ყოველი ნაკბენი — მოგზაურობა."'
                : '"Every khinkali is a small universe. Every bite — a journey."'}
            </blockquote>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: C.textLight, marginBottom: 20 }}>
              {lang === 'geo'
                ? 'ჩვენ გვჯერა, რომ კარგი საჭმელი ადამიანებს აახლოებს. ჩვენი სუფრა ღიაა ყველასთვის — ოჯახისთვის, მეგობრებისთვის, სტუმრებისთვის. მოდი, იჯდე ჩვენს გვერდით და ნება მიეც საჭმელს, ილაპარაკოს.'
                : 'We believe that great food draws people closer. Our table is open to all — families, friends, and strangers who leave as friends. Come, sit beside us, and let the food do the talking.'}
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.burgundy }}>
              {lang === 'geo' ? '— ნინო და დავით ბერიძე, დამფუძნებლები' : '— Nino & Davit Beridze, Founders'}
            </p>
          </div>

          {/* Decorative card */}
          <div style={{ backgroundColor: C.burgundy, borderRadius: 24, padding: 48, textAlign: 'center', color: C.parchment }}>
            <div style={{ fontSize: 72, marginBottom: 12 }}>🥟</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: C.gold, marginBottom: 4 }}>2014</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 36, letterSpacing: '0.08em' }}>
              {lang === 'geo' ? 'დაარსდა' : 'FOUNDED'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { num: '100+', lbl: lang === 'geo' ? 'ხინკლის სახეობა' : 'Khinkali varieties' },
                { num: '10K+', lbl: lang === 'geo' ? 'ბედნიერი სტუმარი' : 'Happy guests' },
                { num: '3',    lbl: lang === 'geo' ? 'ჯილდო' : 'Awards' },
                { num: '∞',    lbl: lang === 'geo' ? 'სიყვარული' : 'Love' },
              ].map(s => (
                <div key={s.num} style={{ padding: 12, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: C.gold }}>{s.num}</div>
                  <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Gallery Section ────────────────────────────────────────────────────────────
function GallerySection({ lang, gallery }) {
  return (
    <div id="gallery" style={{ backgroundColor: C.parchmentDark, padding: '88px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.burgundy, textAlign: 'center', marginBottom: 12 }}>
          {lang === 'geo' ? 'გალერეა' : 'Gallery'}
        </h2>
        <div style={{ width: 56, height: 3, backgroundColor: C.gold, margin: '0 auto 12px', borderRadius: 2 }} />
        <p style={{ textAlign: 'center', color: C.textLight, fontSize: 16, fontStyle: 'italic', marginBottom: 48 }}>
          {lang === 'geo' ? 'ჩვენი სამყარო სურათებში' : 'Our world in images'}
        </p>
        <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {gallery.slice(0, 6).map((url, i) => (
            <img key={i} src={url} alt={`gallery-${i}`} className="gallery-img"
              style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 14, display: 'block', transition: 'transform 0.3s' }}
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80'; }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ lang, settings }) {
  return (
    <footer style={{ backgroundColor: C.burgundyDark, color: C.parchment, padding: '56px 24px 28px' }}>
      <div className="footer-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 44, marginBottom: 40 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.gold, marginBottom: 14 }}>
            {lang === 'geo' ? settings.nameGeo : settings.nameEng}
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.75 }}>
            {lang === 'geo' ? 'ქართული სამზარეულოს სიყვარულით.' : 'With love for Georgian cuisine.'}
          </p>
        </div>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.gold, marginBottom: 14 }}>
            {lang === 'geo' ? 'კონტაქტი' : 'Contact'}
          </div>
          <p style={{ fontSize: 14, lineHeight: 2, opacity: 0.8 }}>
            📍 {settings.address}<br />
            📞 {settings.phone}<br />
            🕐 {settings.hours}
          </p>
        </div>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.gold, marginBottom: 14 }}>
            {lang === 'geo' ? 'სოციალური მედია' : 'Social Media'}
          </div>
          {[
            { label: '📸 Instagram', href: 'https://www.instagram.com/asikhinkali/' },
            { label: '👥 Facebook',  href: 'https://www.facebook.com/asikhinkali/?locale=ka_GE' },
          ].map(s => (
            s.href
              ? <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', marginBottom: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '9px 18px', color: C.parchment, fontSize: 14, fontFamily: "'Inter', sans-serif", textDecoration: 'none' }}>
                  {s.label}
                </a>
              : <button key={s.label} style={{ display: 'block', marginBottom: 8, backgroundColor: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: '9px 18px', color: C.parchment, cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif" }}>
                  {s.label}
                </button>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, textAlign: 'center', fontSize: 13, opacity: 0.5 }}>
        © {new Date().getFullYear()} {lang === 'geo' ? settings.nameGeo : settings.nameEng}. {lang === 'geo' ? 'ყველა უფლება დაცულია.' : 'All rights reserved.'}
      </div>
    </footer>
  );
}

// ── Admin: Menu Manager ────────────────────────────────────────────────────────
function AdminMenu({ menuItems, setMenuItems }) {
  const blank = { nameGeo: '', nameEng: '', descGeo: '', descEng: '', category: 'khinkali', price: '', imageUrl: '' };
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);

  const save = () => {
    if (!form.nameGeo || !form.nameEng || !form.price) return;
    const entry = { ...form, price: Number(form.price) };
    let updated;
    if (editId) {
      updated = menuItems.map(i => i.id === editId ? { ...entry, id: editId } : i);
    } else {
      updated = [...menuItems, { ...entry, id: Date.now() }];
    }
    ls.set('asikhinkali_menu', updated);
    setMenuItems(updated);
    setForm(blank); setShowForm(false); setEditId(null);
  };

  const del = (id) => {
    const updated = menuItems.filter(i => i.id !== id);
    ls.set('asikhinkali_menu', updated); setMenuItems(updated);
  };

  const startEdit = (item) => { setForm({ ...item }); setEditId(item.id); setShowForm(true); };

  const ai = (k) => ({
    backgroundColor: '#120508', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
    padding: '10px 14px', color: C.white, fontSize: 14, fontFamily: "'Inter', sans-serif",
    outline: 'none', width: '100%', boxSizing: 'border-box',
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ color: C.gold, fontFamily: "'Playfair Display', serif", fontSize: 22 }}>Menu Manager</h3>
        <button style={{ backgroundColor: C.gold, color: C.burgundy, border: 'none', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
          onClick={() => { setShowForm(s => !s); setForm(blank); setEditId(null); }}>
          {showForm ? '✕ Cancel' : '+ Add Item'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#1E0A10', borderRadius: 14, padding: 24, marginBottom: 20 }}>
          <div style={{ color: C.gold, fontFamily: "'Playfair Display', serif", fontSize: 17, marginBottom: 18 }}>{editId ? 'Edit Item' : 'New Menu Item'}</div>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { k: 'nameGeo', l: 'Name (Georgian)' }, { k: 'nameEng', l: 'Name (English)' },
              { k: 'descGeo', l: 'Description (Georgian)' }, { k: 'descEng', l: 'Description (English)' },
            ].map(f => (
              <div key={f.k}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>{f.l}</label>
                <input style={ai()} value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} />
              </div>
            ))}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Category</label>
              <select style={ai()} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {['khinkali','appetizers','mains','tsomeluli','soup','salati','dessert','garnish','sauce','makali','drinks'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Price (₾)</label>
              <input style={ai()} type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="full-col" style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>Image</label>
              {/* URL input + upload button side by side */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input style={{ ...ai(), flex: 1 }} value={form.imageUrl.startsWith('data:') ? '(ატვირთული ფაილი)' : form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://... ან ატვირთე ქვემოდან"
                  readOnly={form.imageUrl.startsWith('data:')} />
                <label style={{ backgroundColor: C.burgundyLight, color: C.parchment, border: `1px solid ${C.gold}`, borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  📁 კომპიუტერიდან
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = ev => setForm(f => ({ ...f, imageUrl: ev.target.result }));
                      reader.readAsDataURL(file);
                    }} />
                </label>
              </div>
              {/* Preview */}
              {form.imageUrl && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={form.imageUrl} alt="preview"
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: `1px solid rgba(255,255,255,0.15)` }}
                    onError={e => e.target.style.display = 'none'} />
                  <button onClick={() => setForm(f => ({ ...f, imageUrl: '' }))}
                    style={{ background: 'none', border: '1px solid #FF6B6B', color: '#FF6B6B', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12 }}>
                    ✕ წაშლა
                  </button>
                </div>
              )}
            </div>
          </div>
          <button style={{ backgroundColor: C.gold, color: C.burgundy, border: 'none', padding: '11px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14, marginTop: 18 }} onClick={save}>
            {editId ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      )}

      <div style={{ backgroundColor: '#1E0A10', borderRadius: 14, padding: 20, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['', 'Georgian', 'English', 'Category', 'Price', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.id}>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <img src={item.imageUrl} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, display: 'block' }} onError={e => e.target.style.display = 'none'} />
                </td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.85)' }}>{item.nameGeo}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.85)' }}>{item.nameEng}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)' }}>{item.category}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: C.gold, fontWeight: 600 }}>₾{Number(item.price).toFixed(2)}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                  <button onClick={() => startEdit(item)} style={{ background: 'none', border: `1px solid ${C.gold}`, color: C.gold, padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 13, marginRight: 6 }}>✏</button>
                  <button onClick={() => del(item.id)} style={{ background: 'none', border: '1px solid #FF6B6B', color: '#FF6B6B', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Admin: Reservations ────────────────────────────────────────────────────────
function AdminReservations() {
  const [bookings, setBookings] = useState(() => ls.get('asikhinkali_bookings', []));

  const cycleStatus = (id) => {
    const order = ['pending', 'confirmed', 'cancelled'];
    const updated = bookings.map(b => b.id === id
      ? { ...b, status: order[(order.indexOf(b.status) + 1) % order.length] }
      : b);
    ls.set('asikhinkali_bookings', updated);
    setBookings(updated);
  };

  const clearAll = () => {
    if (window.confirm('Delete all reservations? This cannot be undone.')) {
      ls.set('asikhinkali_bookings', []);
      setBookings([]);
    }
  };

  const badgeStyle = (status) => {
    const map = { pending: ['#6B5B00','#FFE44D'], confirmed: ['#1B4A2E','#69F0AE'], cancelled: ['#6B0000','#FF8A80'] };
    const [bg, fg] = map[status] || map.pending;
    return { backgroundColor: bg, color: fg, padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ color: C.gold, fontFamily: "'Playfair Display', serif", fontSize: 22 }}>Reservations ({bookings.length})</h3>
        <button onClick={clearAll} style={{ backgroundColor: '#6B0000', color: '#FF8A80', border: 'none', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Clear All</button>
      </div>
      <div style={{ backgroundColor: '#1E0A10', borderRadius: 14, padding: 20, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Name','Phone','Date','Time','Guests','Notes','Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '28px 12px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>No reservations yet</td></tr>
            )}
            {bookings.map(b => (
              <tr key={b.id}>
                {[b.name, b.phone, b.date, b.time, b.guests].map((v, i) => (
                  <td key={i} style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>{v}</td>
                ))}
                <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.notes || '—'}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <button style={badgeStyle(b.status)} onClick={() => cycleStatus(b.id)}>
                    {(b.status || 'pending').charAt(0).toUpperCase() + (b.status || 'pending').slice(1)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Admin: Gallery ─────────────────────────────────────────────────────────────
function AdminGallery({ gallery, setGallery }) {
  const [newUrl, setNewUrl] = useState('');

  const add = () => {
    if (!newUrl.trim()) return;
    const updated = [...gallery, newUrl.trim()];
    ls.set('asikhinkali_gallery', updated); setGallery(updated); setNewUrl('');
  };

  const del = (i) => {
    const updated = gallery.filter((_, idx) => idx !== i);
    ls.set('asikhinkali_gallery', updated); setGallery(updated);
  };

  const ai = { backgroundColor: '#120508', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 14px', color: C.white, fontSize: 14, fontFamily: "'Inter', sans-serif", outline: 'none', flex: 1, boxSizing: 'border-box' };

  return (
    <div>
      <h3 style={{ color: C.gold, fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 20 }}>Gallery Manager</h3>
      <div style={{ backgroundColor: '#1E0A10', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <div style={{ color: C.gold, fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 14 }}>Add Image</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input style={ai} value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://... image URL"
            onKeyDown={e => e.key === 'Enter' && add()} />
          <button style={{ backgroundColor: C.gold, color: C.burgundy, border: 'none', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }} onClick={add}>Add</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {gallery.map((url, i) => (
          <div key={i} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
            <img src={url} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} onError={e => { e.target.alt = '(error)'; }} />
            <button onClick={() => del(i)}
              style={{ position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(107,0,0,0.9)', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 9px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Admin: Settings ────────────────────────────────────────────────────────────
function AdminSettings({ settings, setSettings }) {
  const [form, setForm] = useState({ ...settings });

  const save = () => { ls.set('asikhinkali_settings', form); setSettings(form); };

  const ai = { backgroundColor: '#120508', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 14px', color: C.white, fontSize: 14, fontFamily: "'Inter', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' };
  const lbl = { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', display: 'block', marginBottom: 6 };

  const fields = [
    { k: 'nameGeo',    l: 'Restaurant Name (Georgian)',    full: false },
    { k: 'nameEng',    l: 'Restaurant Name (English)',     full: false },
    { k: 'taglineGeo', l: 'Hero Tagline (Georgian)',       full: false },
    { k: 'taglineEng', l: 'Hero Tagline (English)',        full: false },
    { k: 'address',    l: 'Address',                       full: true  },
    { k: 'phone',      l: 'Phone',                         full: false },
    { k: 'hours',      l: 'Working Hours',                 full: false },
  ];

  return (
    <div>
      <h3 style={{ color: C.gold, fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 20 }}>Settings</h3>
      <div style={{ backgroundColor: '#1E0A10', borderRadius: 14, padding: 28 }}>
        <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {fields.map(f => (
            <div key={f.k} className={f.full ? 'full-col' : ''} style={f.full ? { gridColumn: '1 / -1' } : {}}>
              <label style={lbl}>{f.l}</label>
              <input style={ai} value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} />
            </div>
          ))}
        </div>
        <button onClick={save}
          style={{ backgroundColor: C.gold, color: C.burgundy, border: 'none', padding: '12px 28px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15, marginTop: 24 }}>
          Save Settings
        </button>
      </div>
    </div>
  );
}

// ── Admin Panel ────────────────────────────────────────────────────────────────
function AdminPanel({ onClose, menuItems, setMenuItems, gallery, setGallery, settings, setSettings }) {
  const [tab, setTab] = useState('menu');
  const tabs = [
    { key: 'menu',         label: '🍽 Menu' },
    { key: 'reservations', label: '📅 Reservations' },
    { key: 'gallery',      label: '🖼 Gallery' },
    { key: 'settings',     label: '⚙ Settings' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#140609', zIndex: 1200, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Admin header */}
      <div style={{ backgroundColor: C.burgundy, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", color: C.gold, fontSize: 20 }}>ასი ხინკალი — Admin</div>
        <button onClick={onClose} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: C.parchment, padding: '7px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif" }}>✕ Close</button>
      </div>
      {/* Tabs */}
      <div style={{ display: 'flex', backgroundColor: '#1A0810', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ background: 'none', border: 'none', borderBottom: tab === t.key ? `3px solid ${C.gold}` : '3px solid transparent', color: tab === t.key ? C.gold : 'rgba(255,255,255,0.5)', padding: '16px 26px', cursor: 'pointer', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' }}>
            {t.label}
          </button>
        ))}
      </div>
      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        {tab === 'menu'         && <AdminMenu menuItems={menuItems} setMenuItems={setMenuItems} />}
        {tab === 'reservations' && <AdminReservations />}
        {tab === 'gallery'      && <AdminGallery gallery={gallery} setGallery={setGallery} />}
        {tab === 'settings'     && <AdminSettings settings={settings} setSettings={setSettings} />}
      </div>
    </div>
  );
}

// ── Password Modal ─────────────────────────────────────────────────────────────
function PasswordModal({ onSuccess, onClose }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);

  const attempt = () => {
    if (pw === 'admin123') { onSuccess(); }
    else { setErr(true); setPw(''); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.72)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}>
      <div style={{ backgroundColor: C.white, borderRadius: 22, padding: 44, maxWidth: 400, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 44, textAlign: 'center', marginBottom: 10 }}>🔐</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: C.burgundy, textAlign: 'center', marginBottom: 6 }}>Admin Access</h2>
        <p style={{ textAlign: 'center', color: C.textLight, fontSize: 14, marginBottom: 28 }}>Enter password to continue</p>
        <input autoFocus type="password" value={pw} placeholder="Password"
          style={{ width: '100%', padding: '14px 18px', border: `2px solid ${err ? '#e53e3e' : C.parchmentDark}`, borderRadius: 12, fontSize: 15, fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: 8, transition: 'border-color 0.2s' }}
          onChange={e => { setPw(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === 'Enter' && attempt()} />
        {err && <p style={{ color: '#e53e3e', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>Incorrect password. Try again.</p>}
        <button onClick={attempt}
          style={{ width: '100%', backgroundColor: C.burgundy, color: C.white, border: 'none', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>
          Enter
        </button>
        <button onClick={onClose}
          style={{ width: '100%', background: 'none', border: `1px solid ${C.parchmentDark}`, padding: '12px', borderRadius: 12, fontSize: 14, cursor: 'pointer', color: C.textLight, fontFamily: "'Inter', sans-serif" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState('geo');
  const [menuItems, setMenuItems] = useState(() => { initStorage(); return ls.get('asikhinkali_menu', SEED_MENU); });
  const [gallery,   setGallery]   = useState(() => ls.get('asikhinkali_gallery', SEED_GALLERY));
  const [settings,  setSettings]  = useState(() => ls.get('asikhinkali_settings', SEED_SETTINGS));
  const [showPwModal, setShowPwModal] = useState(false);
  const [showAdmin,   setShowAdmin]   = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3600);
  };

  return (
    <LangCtx.Provider value={lang}>
      <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: C.parchment, color: C.text, minHeight: '100vh' }}>
        <Header lang={lang} setLang={setLang} settings={settings} />

        <main style={{ paddingTop: 72 }}>
          <Hero lang={lang} settings={settings} />
          <MenuSection lang={lang} menuItems={menuItems} />
          <ReservationsSection lang={lang} showToast={showToast} />
          <AboutSection lang={lang} />
          <GallerySection lang={lang} gallery={gallery} />
        </main>

        <Footer lang={lang} settings={settings} />

        {/* Floating admin button */}
        <button className="float-btn" onClick={() => setShowPwModal(true)} title="Admin Panel"
          style={{ position: 'fixed', bottom: 28, right: 28, width: 54, height: 54, borderRadius: '50%', backgroundColor: C.burgundy, border: `2px solid ${C.gold}`, color: C.gold, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 24px rgba(0,0,0,0.35)', zIndex: 998, transition: 'all 0.25s' }}>
          🔒
        </button>

        {showPwModal && (
          <PasswordModal
            onSuccess={() => { setShowPwModal(false); setShowAdmin(true); }}
            onClose={() => setShowPwModal(false)}
          />
        )}

        {showAdmin && (
          <AdminPanel
            onClose={() => setShowAdmin(false)}
            menuItems={menuItems} setMenuItems={setMenuItems}
            gallery={gallery}    setGallery={setGallery}
            settings={settings}  setSettings={setSettings}
          />
        )}

        <Toast show={toast.show} message={toast.msg} />
      </div>
    </LangCtx.Provider>
  );
}
