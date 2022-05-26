"use strict"

function convertToRupiah(price){
    return price.toLocaleString('id', {
        style : "currency", 
        currency: "IDR"
    });
}

module.exports = convertToRupiah;