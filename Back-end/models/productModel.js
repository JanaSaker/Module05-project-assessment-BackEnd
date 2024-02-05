import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
    imageUrl:{ 
    type: String,
    required:true,
    
},
title:{
    type:String,
    required: true,

},
    price: {
        type: Number,
        required: true,
        validate: {
          validator: (value) => value >= 0, // Enforce non-negative prices
          message: "Price must be non-negative",
        },
},
description: {
      //description text for the product
      type: String,
    },


});
export default productSchema;


const Product = mongoose.model('Product', productSchema);
