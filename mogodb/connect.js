const { connect } = require("mongoose");

function ConnectToMongo(initializeServer) {
  connect(
    `mongodb+srv://admin:admin@cluster0.1gzacw8.mongodb.net/?retryWrites=true&w=majority`
  )
    .then(() => {
        initializeServer();
    })
    .catch((error) => {
      throw(error);
    });
}


module.exports = ConnectToMongo;