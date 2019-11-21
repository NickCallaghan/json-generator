const fs = require("fs");
const uuidv1 = require("uuid/v1");
let items = [];
let itemCount = 0;

// Business Config Data
const BusinessId = "27ced0c1-74ea-433b-8dd6-2dcf010c1cb1";
const SiteId = "27ced0c1-74ea-433b-8dd6-2dcf010c1cbe";

const riskLevels = [
  {
    RiskId: "CC181991-5E10-4F80-B38E-4570574E6D0E",
    RiskName: "High",
    RiskOrder: 1
  },
  {
    RiskId: "445399D9-7EA0-43CB-BCED-BA0481AF8C14",
    RiskName: "Medium",
    RiskOrder: 2
  },
  {
    RiskId: "6BCD2AAE-001B-4E01-B4B7-42DC33A2D4A8",
    RiskName: "Low",
    RiskOrder: 3
  },
  {
    RiskId: "1BB3184A-F5CF-4219-9EFA-E2653A0D5B9B",
    RiskName: "None",
    RiskOrder: 4
  }
];

const productGroups = [
  {
    ProductGroup: ["Bar", "Draught Beer", "Standard Draft"],
    PurchaseUnits: ["11 Gallon", "22 Gallon"],
    ItemNames: [
      "Fosters",
      "Carling",
      "Punk IPA",
      "Kronnenbourg",
      "Stella",
      "Belhaven Best",
      "Guinness"
    ]
  },
  {
    ProductGroup: ["Bar", "Soft Drinks", "Draft Minerals"],
    PurchaseUnits: ["10 Litre"],
    ItemNames: ["Coke", "Diet Coke", "Coke Zero", "Lemonade", "Irn Bru"]
  },
  {
    ProductGroup: ["Bar", "Soft Drinks", "Bottled Minerals"],
    PurchaseUnits: ["Single"],
    ItemNames: ["Coke Bottle", "RedBull", "Irn Bru", "J20"]
  },
  {
    ProductGroup: ["Bar", "Wine", "Red Wine"],
    PurchaseUnits: ["75cl Bottle"],
    ItemNames: ["Tempranillo", "Shiraz", "Pinot Noir"]
  },
  {
    ProductGroup: ["Bar", "Wine", "White Wine"],
    PurchaseUnits: ["75cl Bottle"],
    ItemNames: ["Chardonnay", "Chenin Blanc", "Pinot Grigio"]
  },
  {
    ProductGroup: ["Bar", "Spirits", "Spirits"],
    PurchaseUnits: ["70cl Bottle", "Litre", "1.5 Litre"],
    ItemNames: [
      "Smirnoff Red",
      "Edinburgh Gin",
      "Sambucca White",
      "Gordons Gin",
      "Morgans Spiced Rum",
      "OVD",
      "Amaretto",
      "Johnnie Walker",
      "Famous Grouse",
      "Baileys",
      "Crème De Menthe"
    ]
  },
  {
    ProductGroup: ["Bar", "Bottled Beers", "Bottled Beers"],
    PurchaseUnits: ["Single"],
    ItemNames: [
      "Dead Pony Club",
      "Budweiser",
      "Miller",
      "Joker IPA",
      "Corona",
      "Tiger",
      "Clockwork Tangerine",
      "5am Ale",
      "Vagabond",
      "Amstel",
      "Birra Morretti",
      "Desparados",
      "Dechars",
      "Heneken Btl"
    ]
  }
];

// Function to pass in an array of risk levels and pick one at random
function pickRandomFromArray(array) {
  const arrayLength = array.length;
  const index = Math.floor(Math.random() * arrayLength);
  return array[index];
}

// Generate the JSON for a stock item
function generateItem(productGroup, BusinessId, SiteId, PurchaseUnit, Name) {
  const Division = productGroup[0];
  const Category = productGroup[1];
  const Subcategory = productGroup[2];
  const { RiskId, RiskName, RiskOrder } = pickRandomFromArray(riskLevels);
  const StockItemId = uuidv1();

  const item = {
    _id: {
      BusinessId,
      SiteId,
      StockItemId
    },
    Name,
    Division,
    Category,
    Subcategory,
    PurchaseUnit,
    RiskId,
    RiskName,
    RiskOrder,
    ProductType: "strd.line",
    LastScheduledCountUtc: null,
    CompletedScheduledCountsThisPeriod: 0,
    Revision: 1
  };
  itemCount++;
  return item;
}

//Takes a product group, generates the JSON for an item, then pushes to the items array.
function generateItemsForProdGroup(prodObject) {
  // Get Prod Group info
  const ProductGroup = prodObject.ProductGroup;

  // Get all Purch Units
  const PurchaseUnits = prodObject.PurchaseUnits;

  // Get all items names
  const Items = prodObject.ItemNames;

  // Generate item for each name with random purchase unit
  Items.forEach(Item => {
    const PurchaseUnit = pickRandomFromArray(PurchaseUnits);
    items.push(
      generateItem(ProductGroup, BusinessId, SiteId, PurchaseUnit, Item)
    );
  });
  return items;
}

//
function generateAllItems() {
  productGroups.forEach(group => {
    generateItemsForProdGroup(group);
  });
}

// Write JSON to file
function writeFile(filename, data) {
  fs.writeFile(filename, JSON.stringify(data), function(err) {
    if (err) console.log(err);
    console.log(`Data saved to ${filename}`);
  });
}

generateAllItems();
writeFile("stock-items.json", items);
console.log(items);
console.log(`${itemCount} items generated!`);
