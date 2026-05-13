db = db.getSiblingDB('expense-pulse');

// ── CATEGORIES ────────────────────────────────────────────────────────────────

db.CATEGORY.deleteMany({});

var categories = [
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9d001"),
    "descrizione": "Stipendio",
    "codice": "001",
    "budget": 0.0,
    "colore": "#4CAF50"
  },
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9d002"),
    "descrizione": "Alimentari",
    "codice": "002",
    "budget": 400.0,
    "colore": "#FF9800"
  },
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9d003"),
    "descrizione": "Trasporti",
    "codice": "003",
    "budget": 150.0,
    "colore": "#2196F3"
  },
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9d004"),
    "descrizione": "Svago",
    "codice": "004",
    "budget": 200.0,
    "colore": "#9C27B0"
  },
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9d005"),
    "descrizione": "Utenze",
    "codice": "005",
    "budget": 250.0,
    "colore": "#F44336"
  }
];

db.CATEGORY.insertMany(categories);
print('Categories initialized: ' + db.CATEGORY.countDocuments() + ' documents');

// ── TRANSACTIONS ──────────────────────────────────────────────────────────────

db.TRANSACTION.deleteMany({});

var transactions = [
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9e001"),
    "title": "Stipendio maggio",
    "amount": 2500.0,
    "date": new Date("2026-05-01"),
    "category": {
      "_id": ObjectId("65f1a2b3c4d5e6f7a8b9d001"),
      "descrizione": "Stipendio",
      "codice": "001",
      "budget": 0.0,
      "colore": "#4CAF50"
    }
  },
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9e002"),
    "title": "Spesa supermercato",
    "amount": -85.50,
    "date": new Date("2026-05-05"),
    "category": {
      "_id": ObjectId("65f1a2b3c4d5e6f7a8b9d002"),
      "descrizione": "Alimentari",
      "codice": "002",
      "budget": 400.0,
      "colore": "#FF9800"
    }
  },
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9e003"),
    "title": "Abbonamento palestra",
    "amount": -49.90,
    "date": new Date("2026-05-03"),
    "category": {
      "_id": ObjectId("65f1a2b3c4d5e6f7a8b9d004"),
      "descrizione": "Svago",
      "codice": "004",
      "budget": 200.0,
      "colore": "#9C27B0"
    }
  },
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9e004"),
    "title": "Bolletta luce",
    "amount": -67.20,
    "date": new Date("2026-05-07"),
    "category": {
      "_id": ObjectId("65f1a2b3c4d5e6f7a8b9d005"),
      "descrizione": "Utenze",
      "codice": "005",
      "budget": 250.0,
      "colore": "#F44336"
    }
  },
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9e005"),
    "title": "Biglietto treno",
    "amount": -12.50,
    "date": new Date("2026-05-10"),
    "category": {
      "_id": ObjectId("65f1a2b3c4d5e6f7a8b9d003"),
      "descrizione": "Trasporti",
      "codice": "003",
      "budget": 150.0,
      "colore": "#2196F3"
    }
  }
];

db.TRANSACTION.insertMany(transactions);
print('Transactions initialized: ' + db.TRANSACTION.countDocuments() + ' documents');

// ── LAYOUTS ───────────────────────────────────────────────────────────────────

db.LAYOUT.deleteMany({});

var layouts = [
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9c001"),
    "layoutName": "DEFAULT_LAYOUT_HOME",
    "isDefault": true,
    "updatedAt": new Date("2026-02-18T12:20:00.000Z"),
    "layoutItems": [
      { "h": 3,  "i": "balance",            "maxH": 3,  "maxW": 8,  "minH": 3, "minW": 4, "staticLayout": false, "w": 4, "x": 3, "y": 0  },
      { "h": 9,  "i": "expenseChart",       "maxH": 12, "maxW": 6,  "minH": 5, "minW": 4, "staticLayout": false, "w": 4, "x": 2, "y": 22 },
      { "h": 9,  "i": "timeChart",          "maxH": 12, "maxW": 12, "minH": 9, "minW": 5, "staticLayout": false, "w": 5, "x": 6, "y": 22 },
      { "h": 5,  "i": "transactionForm",    "maxH": 5,  "maxW": 12, "minH": 5, "minW": 8, "staticLayout": false, "w": 8, "x": 3, "y": 3  },
      { "h": 4,  "i": "researchTable",      "maxH": 8,  "maxW": 12, "minH": 3, "minW": 8, "staticLayout": false, "w": 8, "x": 3, "y": 8  },
      { "h": 10, "i": "transactionHistory", "maxH": 15, "maxW": 12, "minH": 4, "minW": 6, "staticLayout": false, "w": 8, "x": 3, "y": 12 }
    ]
  },
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9c002"),
    "layoutName": "DEFAULT_LAYOUT_CATEGORIES",
    "isDefault": true,
    "updatedAt": new Date("2026-02-18T12:20:00.000Z"),
    "layoutItems": [
      { "h": 4,  "i": "stats", "maxH": 12, "maxW": 12, "minH": 4, "minW": 10, "staticLayout": false, "w": 10, "x": 2, "y": 4 },
      { "h": 4,  "i": "form",  "maxH": 10, "maxW": 12, "minH": 4, "minW": 8,  "staticLayout": false, "w": 8,  "x": 4, "y": 0 },
      { "h": 10, "i": "table", "maxH": 12, "maxW": 12, "minH": 8, "minW": 6,  "staticLayout": false, "w": 12, "x": 0, "y": 8 }
    ]
  },
  {
    "_id": ObjectId("69d8fe591c3184e9c0409fca"),
    "layoutName": "HomeView",
    "isDefault": false,
    "updatedAt": new Date("2026-02-18T12:20:00.000Z"),
    "layoutItems": [
      { "h": 3,  "i": "balance",            "maxH": 3,  "maxW": 8,  "minH": 3, "minW": 4, "staticLayout": false, "w": 8, "x": 2, "y": 0  },
      { "h": 9,  "i": "expenseChart",       "maxH": 12, "maxW": 6,  "minH": 5, "minW": 4, "staticLayout": false, "w": 4, "x": 2, "y": 3  },
      { "h": 9,  "i": "timeChart",          "maxH": 12, "maxW": 12, "minH": 9, "minW": 4, "staticLayout": false, "w": 4, "x": 6, "y": 3  },
      { "h": 6,  "i": "transactionForm",    "maxH": 7,  "maxW": 12, "minH": 5, "minW": 5, "staticLayout": false, "w": 8, "x": 2, "y": 12 },
      { "h": 6,  "i": "researchTable",      "maxH": 8,  "maxW": 12, "minH": 4, "minW": 5, "staticLayout": false, "w": 8, "x": 2, "y": 18 },
      { "h": 15, "i": "transactionHistory", "maxH": 15, "maxW": 12, "minH": 8, "minW": 4, "staticLayout": false, "w": 8, "x": 2, "y": 24 }
    ]
  },
  {
    "_id": ObjectId("69d8fe681c3184e9c0409fcc"),
    "layoutName": "CategoriesView",
    "isDefault": false,
    "updatedAt": new Date("2026-02-18T12:20:00.000Z"),
    "layoutItems": [
      { "h": 3,  "i": "stats", "maxH": 12, "maxW": 12, "minH": 3, "minW": 5, "staticLayout": false, "w": 6, "x": 3, "y": 0 },
      { "h": 5,  "i": "form",  "maxH": 10, "maxW": 12, "minH": 4, "minW": 5, "staticLayout": false, "w": 6, "x": 3, "y": 3 },
      { "h": 12, "i": "table", "maxH": 12, "maxW": 12, "minH": 8, "minW": 5, "staticLayout": false, "w": 6, "x": 3, "y": 8 }
    ]
  }
];

db.LAYOUT.insertMany(layouts);

print('Layout initialized: ' + db.LAYOUT.countDocuments() + ' documents');