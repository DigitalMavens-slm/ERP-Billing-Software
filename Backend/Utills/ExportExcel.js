const XLSX = require("xlsx");

const exportModelToExcel = async (Model, res, sheetName = "Sheet1", fileName = "export.xlsx") => {
  try {
    const docs = await Model.find().lean();

    const cleanData = docs.map(doc => {
  const newDoc = {};

  for (let key in doc) {
    if (doc.hasOwnProperty(key) && key !== "_id" &&key!=="createdAt" &&key!=="updatedAt"&&key!=="__v"){
      
      newDoc[key] = doc[key]?._bsontype === "ObjectID" ? doc[key].toString() : doc[key];
         }
  }
  return newDoc;
});

    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.header(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.attachment(fileName);
    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export data" });
  }
};

module.exports = exportModelToExcel;
