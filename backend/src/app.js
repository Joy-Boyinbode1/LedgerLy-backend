import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import loginroutes from './routers/loginRouter.js';
import V1 from './routers/businessRouter.js';
import V2 from './routers/saleRouter.js';
import V3 from './routers/insightsRouter.js'
import cors from "cors"

dotenv.config();


const app = express();
app.use(express.json());

//allow front end  to run
app.use(cors({
  origin: "http://localhost:5173", // or 3000
  credentials: true
}));


async function connect(){
   await  sequelize.authenticate()
   await sequelize.sync();
    console.log("database connected")
}
connect()

app.use('/api/auth', loginroutes);
// 🔹 Sync database
sequelize.sync({ alter: true }) // <-- this updates the DB with new columns
  .then(() => {
    console.log("Database synced successfully");

    // Start the server AFTER DB is synced
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });

//business and products
app.use('/api/v1', V1);

//sales and expenses end points
app.use('/api/v2', V2);

//
app.use('/api/v3', V3)

app.listen(5000, () => console.log("Server running on port 5000"));