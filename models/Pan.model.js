const { Schema, model } = require("mongoose");

const panSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter the name of the pan'],
            unique: true
        },
        description: {
            type: String,
            required: [true, 'Please tell us about this pan'],
            minlength: 30,
            maxlength: 150
        },
        imageUrl: {
            type: String,
            required: [true, 'An image is necessary']
        },
        owner: { type: Schema.Types.ObjectId, ref: "User" },
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]
    }, 
    {
        timestamps: true
    }
);
const Pan = model('Pan', panSchema);

module.exports = Pan;