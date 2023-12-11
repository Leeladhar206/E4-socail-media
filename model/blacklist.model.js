const mongoose= require('mongoose');

const blackListSchema= mongoose.Schema(
    {
        blackList:{type: [String]}
    },{
        versionKey:false
    }
);

const BlackListModel= mongoose.model('blacklist', blackListSchema);

module.exports={BlackListModel};