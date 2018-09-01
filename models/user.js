const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const DaoConfiguration = require('../DaoConfiguration');

const userSchema = new mongoose.Schema({
    [DaoConfiguration.USER.FIELDS.EMAIL]: {
        type: String,
        required: true,
    },
    [DaoConfiguration.USER.FIELDS.PASSWORD]: {
        type: String,
        required: true,
    },
}, {timestamps: true});

userSchema.pre('save', function save(next) {
    const user = this;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;

            next();
        });
    });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};

module.exports = mongoose.model(DaoConfiguration.USER.MODEL_NAME, userSchema);