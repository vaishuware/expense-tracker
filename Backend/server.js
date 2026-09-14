const express = require("express"); 
const dotenv = require("dotenv"); 
const cors = require("cors"); 
const connectDB = require("./config/db"); 
const expenseRoutes = require("./routes/expenseRoutes"); 
dotenv.config(); connectDB(); const app = express();
 
// Middleware 
 app.use(cors()); app.use(express.json()); 
 
 // Expense routes  
 app.use("/api/expenses", expenseRoutes); 
 
 // Home route
  app.get("/", (req, res) =>{
    res.send("Expense Tracker Backend is Working!" );
    });
  const PORT = process.env.PORT || 5000; 
    app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
   });