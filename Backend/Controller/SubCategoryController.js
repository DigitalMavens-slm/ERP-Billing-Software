const SubCategory = require("../Model/SubCategoryModel");

// GET all subcategories
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find();
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subcategories" });
  }
};

// POST create subcategory
exports.createSubCategory = async (req, res) => {
  const { name, categoryId } = req.body;
  if (!name || !categoryId) 
    return res.status(400).json({ message: "Name and categoryId required" });

  try {
    const subCategory = new SubCategory({ name, categoryId });
    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (err) {
    res.status(500).json({ message: "Error creating subcategory" });
  }
};

// DELETE subcategory
exports.deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Subcategory deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting subcategory" });
  }
};
