const SubCategory = require("../Model/SubCategoryModel");




exports.getSubCategories = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const subCategories = await SubCategory.find({ companyId });

    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subcategories" });
  }
};


exports.createSubCategory = async (req, res) => {
  const { name, categoryId } = req.body;

  if (!name || !categoryId) {
    return res.status(400).json({
      message: "Name and categoryId required",
    });
  }

  try {
    const subCategory = new SubCategory({
      name,
      categoryId,
      companyId: req.user.companyId, // 🔥 important
    });

    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (err) {
    res.status(500).json({ message: "Error creating subcategory" });
  }
};



exports.deleteSubCategory = async (req, res) => {
  try {
    const deleted = await SubCategory.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Subcategory not found or not authorized",
      });
    }

    res.json({ message: "Subcategory deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting subcategory" });
  }
};

