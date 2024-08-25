const cors = require('cors'); 
const express = require ('express');
const stripe = require("stripe")("sk_test_51Kb3jnSDwXbsOnZOQ4FuUW2Tw44ygW4hAJ11yx57i7Hze0CB5eYsOlcoodwThlZyzAAa3k0BXG41HwRBQ7dw1GYf00bJuew2St")
const uuid = require("uuid/v4");



const app = express();
//middleware

app.use(express.json());
app.use(cors());




//routes
app.get("/",(req,res)=>{
    res.send("It works At My Website");  
});

app.post("/payment", (req,res)=>{
    const {product,token} = req.body;
    console.log("product",product);
    console.log("Price",product.price);
    const idempotencyKey = uuid();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                }
            }
        }, {idempotencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(err=>console.log(err));
    
})

//listen
app.listen(8282, ()=>console.log('Listening on port 8282'));



