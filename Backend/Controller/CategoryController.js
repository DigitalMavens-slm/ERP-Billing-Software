const Category = require("../Model/CategoryModel");

// GET all categories
exports.getCategories = async (req, res) => {
  try {

    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// POST create category
exports.createCategory = async (req, res) => {
   
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Category name required" });

  try {
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error creating category" });
  }
};

exports.deleteCategory = async (req, res) => {
    const{id}=req.params;
  try{
   const category=await Category.findByIdAndDelete(id)
   res.status(200).json({message:"Category deleted"})
  }
  catch(err){
    res.status(500).json({messaage:"deleting error"})
  }
  
};

