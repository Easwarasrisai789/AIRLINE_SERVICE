const mongoose = require('mongoose');

const ManualSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      default: '',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Ensure only one manual document exists
ManualSchema.statics.getManual = async function () {
  let manual = await this.findOne();
  if (!manual) {
    manual = await this.create({ content: '' });
  }
  return manual;
};

module.exports = mongoose.model('Manual', ManualSchema);

