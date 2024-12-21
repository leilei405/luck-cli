module.exports = (app) => {
  const { mongoose } = app;
  const { Schema } = mongoose;
  const ProjectSchema = new Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    npmName: { type: String, required: true },
    version: { type: String, required: true },
  });

  // 导出模型 project 在数据库中会自动变为 projects 如果没有变在后面加上s 否则数据会查询不到
  return mongoose.model("project", ProjectSchema);
};
