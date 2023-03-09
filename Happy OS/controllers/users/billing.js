const db = require('../../generics/db/db');
var Secret_Key = 'sk_test_51LIsINGUrGkAh6wY99wzu0jAS2zcujLuQuiBwrU8W35713FatSCGkL81mZQWdwzz4vx85R64wdIKXajpFgQsjbXN00HnvvthTj'
const stripe = require('stripe')(Secret_Key);

exports.checkPaymentStatus = async (req, page_res) => {
    if (req.session.already_logged === 'false' || req.session.already_logged === undefined) {
        page_res.render('login')
    }
    else {
        var Email = req.session.Email;
        await db.select('Id').from('register').where({ Email }).then(async (Id_res) => {
            await db.select('Payment_Status').from('Billing_Details').where({ UserId: Id_res[0].Id }).then((res) => {
                if (res.length > 0) {
                    if (res[0].Payment_Status == 'UnPaid') {
                        page_res.render('billing', {
                            name: req.session.name
                        });
                    }
                    else {
                        page_res.redirect('/view_policy');
                    }
                }
                else {
                    page_res.render('billing', {
                        name: req.session.name
                    });
                }
            })
                .catch((err) => {
                    page_res.send('Something went wrong while getting Payment Status');
                })
        }).catch((err) => {
            page_res.send('Something went wrong while getting UserId');
        })
    }
}


exports.BuySubscription = (req, page_res) => {
    if (req.session.already_logged === 'false' || req.session.already_logged === undefined) {
        page_res.render('login')
    }
    else {
        page_res.render('buy-subscription', { name: req.session.name });
    }
}


exports.Subscription_Details = async (req, page_res) => {
    try {
        
        stripe.customers.create({
            source: req.body.stripeToken
        }).then(customer => stripe.charges.create({
            amount: 2000,
            currency: 'usd',
            customer: customer.id,
            description: 'Paid Successfully!'
        })).then(async () => {
            var Email = req.session.Email;
            await db.select('Id').from('register').where({ Email }).returning('Id').then(async (res) => {
                var UserId = res[0].Id;
                const { fname, lname, city, state, country, numberstart, numberend, street, address } = req.body;
                await db('Billing_Details').insert({ FirstName: fname, LastName: lname, City: city, State: state, Country: country, PhoneNo: numberstart + numberend, StreetAddress: street, BillingAddress: address, UserId, Payment_Status: 'Paid' }).then((res) => {
                    page_res.send('<script>alert("Paid Successfully!");window.location.href = "/view_policy" </script>');
                })
                    .catch((err) => {
                        page_res.render('buy-subscription',{
                             error: 'Something went wrong while inserting Billing Details'
                        })
                    })
            }).catch((err) => {
                page_res.render('buy-subscription', {
                     error: 'Something went wrong while getting UserId'
                })       
            })
        })
    } catch (err) { 
       // page_res.render('buy-subscription', {
       // error: err
    //})
 }
}
