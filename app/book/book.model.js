const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const ISBNDOC = require('isbn-validate');

const BookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    ISBN: {
      type: String,
      required: true,
      validate: {
        validator: function(value) {
          return ISBNDOC.Validate(value);
        }
      }
    },
    authors: {
      type: Array,
      required: true
    },
    publishing: {
      type: Object,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

BookSchema.set('collection', 'books');

BookSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.model('Book', BookSchema, 'books');
