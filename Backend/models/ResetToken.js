const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Tự động xóa sau khi hết hạn
  },
  used: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index để tối ưu hóa truy vấn
resetTokenSchema.index({ email: 1, used: 1 });
resetTokenSchema.index({ token: 1, used: 1, expiresAt: 1 });

// Middleware để tự động xóa token hết hạn
resetTokenSchema.pre('save', function(next) {
  if (this.isNew) {
    // Tự động xóa token cũ của cùng email khi tạo token mới
    this.constructor.deleteMany({
      email: this.email,
      _id: { $ne: this._id }
    }).exec();
  }
  next();
});

module.exports = mongoose.model('ResetToken', resetTokenSchema);