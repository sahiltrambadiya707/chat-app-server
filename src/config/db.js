const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@mycluster.2ud6h.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("connection error", error);
  });

