const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema(
  {
    tag: [{ type: String, required: [true, 'Tag Is Required'] }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tag', TagSchema);
