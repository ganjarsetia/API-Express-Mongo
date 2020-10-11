const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const AuthorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    birth: {
      type: Date,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    },
    sponsor: {
      type: String,
      required: false
    },
    books: [mongoose.Schema.Types.Mixed]
  },
  {
    timestamps: true
  }
);

AuthorSchema.set('collection', 'authors');

AuthorSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.model('Author', AuthorSchema, 'authors');
