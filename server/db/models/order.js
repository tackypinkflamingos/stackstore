'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var addressSchema = require('./address.js').address;
var _ = require('lodash');

var schema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['cart', 'created', 'processing', 'cancelled', 'completed'],
    default: 'cart'
  },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    session: { type: String },
  email: String,
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    quantity: Number,
    unitPrice: Number
  }],
  billing: {
    address: [ addressSchema ],
    cardNumber: { type: Number },
    expiration: { type: Date },
    csv: { type: Number },
    nameOnCard: { type: String }
  },
  shipping: {
    name: String,
    address: [ addressSchema ]
  }
});

schema.statics.getUserCart = function(req) {
  var searches = [];
  if(req.user && req.user._id) {
    searches.push(this.model('Order').find({ user: req.user._id, status: 'cart' }))
  }
  if(req.session && req.session.id) {
    searches.push(this.model('Order').find({ session: req.session.id, status: 'cart' }))
  }
  return Promise.all(searches).then(function(vals) {
    for(var x=0; x<vals.length; x++) {
      if(vals[x][0]) {
        return vals[x][0];
      }
    }
    return null;
  })
}

// when a user logs in, update their cart with their user
schema.statics.signInCart = function(req) {
  if( !req.user || !req.session ) {
    // user or session missing
    return null;
  }
  var searches = [
    this.model('Order').find({ session: req.session.id, status: 'cart' }),
    this.model('Order').find({ user: req.user._id, status: 'cart' })
  ]
  return Promise.all(searches).then(function(carts) {
    var newCart = new this.model('Order')({
      user: req.user._id;
      status: 'cart'
    });
    var allCarts = carts[0].concat(carts[1]);
    allCarts.forEach(function(cart) {
      cart.items.forEach(function(item) {
        newCart.updateCart(item.product, item.quantity)
      });
      this.model('Order').remove({ _id: cart._id }).exec();
    })

    // varr allProducts = [];
    // var allCarts = carts[0].concat(carts[1]);
    // allCarts.reduce(function(allProducts, cart) {
    //   cart.items.reduce(function(allProducts, item) {
    //     allProducts.push(item);
    //   })
    // })
    //
    // var newCart = new this.model('Order')({
    //   user: req.user._id;
    //   status: 'cart'
    // });
    // allProducts.forEach(function(item) {
    //   newCart.updateCart(item.product, item.quantity);
    // })
    // // now remove any old carts
    // allCarts.forEach(function(cart) {
    //   this.model('Order').remove({ _id: cart._id }).exec();
    // })
    return newCart;
  })


}

schema.methods.updateCart = function(productId, quantity) {
  var index = _.pluck(this.items, 'product')
    .map(function(obj) { return obj.toString() })
    .indexOf(productId);

  if(quantity>0) {
    if(index != -1) {
      this.items[index].quantity = quantity;
    } else {
      // need to add price
      this.items.push({
        product: productId,
        quantity: quantity
      });
    }
  } else {
    if(index != -1) {
      this.items.splice(index,1);
    }
  }
  return this.save()
}

var Order = mongoose.model('Order', schema);
Order.on('error', console.log)
