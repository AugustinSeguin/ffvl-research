const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const websitesContentModel = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  date: Date
});
