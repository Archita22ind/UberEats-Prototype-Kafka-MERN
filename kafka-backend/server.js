const { mongoDB } = require("./kafka/config");
const mongoose = require("mongoose");

//topics files
//var signin = require('./services/signin.js');
var connection = new require("./kafka/Connection");
var LoginCustomer = require("./services/customer/login.js");
var RegisterCustomer = require("./services/customer/customerSignUpInfo");
var LoginRestaurant = require("./services/restaurant/restaurantLoginInfo");
var RegisterRestaurant = require("./services/restaurant/restaurantSignUpInfo");
var RestaurantDetails = require("./services/restaurant/restaurantDetailsInfo");
var FoodDetails = require("./services/restaurant/foodItemsDisplay");
var RestaurantDetailsUpdate = require("./services/restaurant/restaurantDetailsInfoUpdate");
var AddDish = require("./services/restaurant/addFoodDishes");
var EditDish = require("./services/restaurant/editFoodDishes");
var ShowCustomerProfile = require("./services/restaurant/showCustomerProfile");
var RestaurantOrders = require("./services/restaurant/getRestaurantOrders");
var RestaurantOrderDetails = require("./services/restaurant/showRestaurantOrderDetails");
var OrderStatusUpdate = require("./services/restaurant/updateOrderStatus");
var ReceiptDetails = require("./services/customer/getReceiptDetails");
var CustomerLocation = require("./services/customer/getCustomerLocation");

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 500,
  wtimeoutMS: 2500,
};

mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log("MongoDB connection failed");
  } else {
    console.log("MongoDB connected!!");
  }
});

function handleTopicRequest(topic_name, fname) {
  //var topic_name = 'root_topic';
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function (message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    fname.handle_request(data.data, (err, res) => {
      console.log("after handle", res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];
      // console.log("messagegesgsgddgdg", payloads[0].messages);
      producer.send(payloads, function (err, data) {
        console.log(data);
      });
      return;
    });
  });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("signInCustomer", LoginCustomer);

handleTopicRequest("registerCustomer", RegisterCustomer);

handleTopicRequest("signInRestaurant", LoginRestaurant);

handleTopicRequest("registerRestaurant", RegisterRestaurant);

handleTopicRequest("restaurantDetails", RestaurantDetails);

handleTopicRequest("foodDetails", FoodDetails);

handleTopicRequest("restaurantDetailsUpdate", RestaurantDetailsUpdate);

handleTopicRequest("addDish", AddDish);

handleTopicRequest("editDish", EditDish);

handleTopicRequest("showCustomerProfile", ShowCustomerProfile);

handleTopicRequest("restaurantOrders", RestaurantOrders);

handleTopicRequest("restaurantOrderDetails", RestaurantOrderDetails);

handleTopicRequest("orderStatusUpdate", OrderStatusUpdate);

handleTopicRequest("receiptDetails", ReceiptDetails);

handleTopicRequest("customerLocation", CustomerLocation);
