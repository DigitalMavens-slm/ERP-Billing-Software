const XLSX = require("xlsx");

const ImportExcel = async (Model, filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert Excel sheet → JSON
    const data = XLSX.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      throw new Error("Excel file is empty");
    }

    // Insert into DB (bulk insert)
    await Model.insertMany(data);
    return { success: true, count: data.length };
  } catch (err) {
    console.error("Import error:", err);
    throw new Error("Failed to import Excel");
  }
};

module.exports = ImportExcel;
