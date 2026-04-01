const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"account",
       required:[true,"Leger must be associated with an account"],
       index:true,
       immutable:true
    },
    amount:{
       type:Number,
       required:[true,"amount is required for ceating a ledger entry"],
       immutable:true
    },
    transaction:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"transcation",
       required:[true,"Leger must be associated with an transcation"],
       index:true,
       immutable:true
    },
    type:{
        type:String,
        enum:{
            values:['CREDIT,DEBIT'],
            message:"Type can be credit and debit"
        },
        required:[true, "Ledger type is required" ],
        immutable:true
    }
},{timestamps:true});
//in future not modiied

function errorModified(){
    throw new Error("ledgers entries are immutable and cannot br modified or deleted");
}


ledgerSchema.pre('findOneAndUpdate',errorModified);
ledgerSchema.pre('updateOne',errorModified);
ledgerSchema.pre('deleteOne',errorModified);
ledgerSchema.pre('remove',errorModified);
ledgerSchema.pre('deleteMany',errorModified);
ledgerSchema.pre('updateMany',errorModified);
ledgerSchema.pre('findOneAndReplace',errorModified);
ledgerSchema.pre('findOneAndDelete',errorModified)

const ledgerModel  =  mongoose.model('ledger',ledgerSchema);

module.exports = ledgerModel;