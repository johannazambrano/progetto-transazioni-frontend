db = db.getSiblingDB('expense-pulse');

db.LAYOUT.deleteMany({});

var layouts = [
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9c001"),
    "isDefault": true,
    "updatedAt": "2026-02-18T12:20:00.000Z",
    "layoutItems": [
      {
        "h": 3,
        "i": "balance",
        "maxH": 3,
        "maxW": 8,
        "minH": 3,
        "minW": 8,
        "staticLayout": false,
        "w": 5,
        "x": 6,
        "y": 14
      },
      {
        "h": 9,
        "i": "expenseChart",
        "maxH": 12,
        "maxW": 6,
        "minH": 3,
        "minW": 4,
        "staticLayout": false,
        "w": 3,
        "x": 0,
        "y": 0
      },
      {
        "h": 9,
        "i": "timeChart",
        "maxH": 12,
        "maxW": 12,
        "minH": 9,
        "minW": 5,
        "staticLayout": false,
        "w": 3,
        "x": 4,
        "y": 0
      },
      {
        "h": 5,
        "i": "transactionForm",
        "maxH": 5,
        "maxW": 12,
        "minH": 5,
        "minW": 8,
        "staticLayout": false,
        "w": 5,
        "x": 5,
        "y": 9
      },
      {
        "h": 4,
        "i": "researchTable",
        "maxH": 8,
        "maxW": 12,
        "minH": 3,
        "minW": 8,
        "staticLayout": false,
        "w": 5,
        "x": 0,
        "y": 9
      },
      {
        "h": 10,
        "i": "transactionHistory",
        "maxH": 15,
        "maxW": 12,
        "minH": 4,
        "minW": 6,
        "staticLayout": false,
        "w": 6,
        "x": 0,
        "y": 14
      }
    ],
    "layoutName": "DEFAULT_LAYOUT_HOME"
  },
  {
    "_id": ObjectId("65f1a2b3c4d5e6f7a8b9c002"),
    "layoutName": "DEFAULT_LAYOUT_CATEGORIES",
    "isDefault": true,
    "updatedAt": "2026-02-18T12:20:00.000Z",
    "layoutItems": [
      {
        "i": "stats",
        "x": 0,
        "y": 6,
        "w": 12,
        "h": 5,
        "minW": 10,
        "maxW": 12,
        "minH": 4,
        "maxH": 12,
        "static": false
      },
      {
        "i": "form",
        "x": 0,
        "y": 0,
        "w": 12,
        "h": 4,
        "minW": 8,
        "maxW": 12,
        "minH": 4,
        "maxH": 10,
        "static": false
      },
      {
        "i": "table",
        "x": 0,
        "y": 6,
        "w": 12,
        "h": 10,
        "minW": 6,
        "maxW": 12,
        "minH": 8,
        "maxH": 12,
        "static": false
      }
    ]
  }
];

db.LAYOUT.insertMany(layouts);

print('Layout initialized: ' + db.LAYOUT.countDocuments() + ' documents');