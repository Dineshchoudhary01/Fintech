const Category = require('../models/Category')

async function getCategories(req,res) {
    try {
        const categories = await Category.find({
          $or: [
           { isDefault: true},
           { user: req.user._id }
          ]
        });

        res.status(200).json(categories);
        
    } catch (error) {
      res.status(500).json({ msg: 'Failed to fetch categories', error: error.message})  
    }
}

async function createCategory(req,res){
    try {
        const { name, type} = req.body;

        if(!name || !type){
            return res.status(400).json({ msg: "Name and typr are required"});
        }
        const category = new Category({
          name,
          type,
          isDefault: false,
          user: req.user._id
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ msg: 'Failed to create category', error: error.message})
    }
}

async function deleteCategory(req,res) {
   try {
     const categoryId = req.params.id;
     const category = await Category.findById(categoryId);
     if(!category){
        return res.status(404).json({ msg: "Category not found"})
     }
     if(category.isDefault){
        return res.status(403).json({ msg: "Default categories cannot be deleted"})
    }
    if(category.user.toString() !== req.user._id.toString()){
        return res.status(403).json({ msg: "Not authorized to delete this category"})
    }

    await category.deleteOne();

    res.status(200).json({ msg: "Category deleted successfully"});
   } catch (error) {
     res.status(500).json({ msg: "Failed to delete category", error: error.message});
   }
}

module.exports = { getCategories,createCategory,deleteCategory};