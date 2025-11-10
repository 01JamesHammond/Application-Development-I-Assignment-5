// Import packages, initialize an express app, and define the port you will use
const { body, validationResult } = require('express-validator');




const express = require('express');
const app = express();
const port = 3000;


// Data for the server
const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },

  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];




// Complete validation rules for todos
const todoValidation = [
  body('name')
    .isLength({ min: 3 }).withMessage("Must be at least 3 characters long")
    .isString().withMessage('Name must be a string'),

  body('description')
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters long")
    .isString().withMessage('Description must be a string'),
  
  body('price')
    .isFloat({ min: 0})
    .withMessage('Price must be greater than 0 and a number'),
  
  body('category')
    .isIn(['appetizer', 'entree', 'dessert', 'beverage'])
    .withMessage('Category must be appetizer, entree, dessert, beverage'),
  
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('Ingredients must be an array with at least one tag'),
  
  body('available')
    .optional()
    .isBoolean().withMessage('Available must be true or false')
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
        const errorMessages =
    errors.array().map(error => error.msg);
    
        return res.status(400).json({
            error: 'Validation failed',
            messages: errorMessages
        });
    }
  
    // Set default value for completed if not provided
    if (req.body.available === undefined) {
        req.body.available = true;
    }
  
    next();
};





// Middleware to parse JSON requests
app.use(express.json());

// Start the server
app.listen(port, () => {
    console.log(`Menu API server running at http://localhost:${port}`);

});

// Root endpoint - API homepage
app.get('/', (req, res) => {
    res.json({ 
        message: "Welcome to the Menu API", 
        endpoints: { 
            "GET /menuItems": "Get all menuItems", 
            "GET /menuItems/:id": "Get a specific menu by ID" 
        } 
    }); 
});

// GET /menuItems - Return all menuItems
app.get('/menuItems', (req, res) => {
      // Sends back the menuItems as JSON as the response to the request
      res.json(menuItems);
});


// GET /menuItems/:id - Return a specific menu by ID
app.get('/menuItems/:id', (req, res) => {
    const menuId = parseInt(req.params.id);
    const menu = menuItems.find(m => m.id === menuId);
  
	// Return menu if it is found
    if (menu) {
        res.json(menu);
    } else {
        res.status(404).json({ error: 'Menu not found' });
    }
});

// POST /menuItems - Create a new menu
app.post('/menuItems', todoValidation, handleValidationErrors, (req, res) => {
    // Extract data from request body
    const { name, description, price, category, ingredients, available } = req.body;

  
  	// Create new menu with generated ID
    const newMenu = {
        id: menuItems.length + 1,
        name,
        description,
        price,
        category,
        ingredients,
        available
    };
  
    // Add to menuItems array
    menuItems.push(newMenu);
  
    // Return the created menu with 201 status
    res.status(201).json(newMenu);
});

// PUT /menuItems/:id - Update an existing menu
app.put('/menuItems/:id', todoValidation, handleValidationErrors, (req, res) => {
    const menuId = parseInt(req.params.id);
    const { name, description, price, category, ingredients, available } = req.body;
  
    // Find the menu to update
    const menuIndex = menuItems.findIndex(m => m.id === menuId);
  
    if (menuIndex === -1) {
        return res.status(404).json({ error: 'Menu not found' });
    }
  
    // Update the menu
    menuItems[menuIndex] = {
        id: menuId,
        name,
        description,
        price,
        category,
        ingredients,
        available
    };
  
    // Return the updated menu
    res.json(menuItems[menuIndex]);
});

// DELETE /menuItems/:id - Delete a menu
app.delete('/menuItems/:id', (req, res) => {
    const menuId = parseInt(req.params.id);
  
    // Find the menu index
    const menuIndex = menuItems.findIndex(b => b.id === menuId);
  
    if (menuIndex === -1) {
        return res.status(404).json({ error: 'menu not found' });
    }
  
    // Remove the menu from array
    const deletedmenu = menuItems.splice(menuIndex, 1)[0];
  
    // Return the deleted menu
    res.json({ message: 'menu deleted successfully', menu: deletedmenu });
});












