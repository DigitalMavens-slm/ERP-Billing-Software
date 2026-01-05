const Category = require("../Model/CategoryModel");

exports.getCategories = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const categories = await Category.find({ companyId });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Category name required",
    });
  }

  try {
    const category = new Category({
      name,
      companyId: req.user.companyId, // 🔥 main line
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error creating category" });
  }
};



exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Category.findOneAndDelete({
      _id: id,
      companyId: req.user.companyId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Category not found or not authorized",
      });
    }

    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Deleting error" });
  }
};