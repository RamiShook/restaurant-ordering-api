const Category = require('../models/category.model');
const Item = require('../models/items.model');
const fs = require('fs');
const restaurantService = require('./restaurant.service');

/* Menu Category */

const addCategory = async (categoryName) => {
  try {
    const category = await Category.findOne({ name: categoryName });

    if (category) {
      return Promise.reject(
        Error(`Category with same name already exist with id: ${category.id}`),
      );
    }

    const result = await Category.create({ name: categoryName });

    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};

const updateCategory = async (id, categoryName) => {
  try {
    const category = await Category.findById(id);

    if (!category) return Promise.reject(Error('Cannot find category'));

    const result = await Category.findByIdAndUpdate(
      id,
      { name: categoryName },
      {
        returnOriginal: false,
      },
    );

    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};

const deleteCategory = async (id) => {
  try {
    const category = await Category.findById(id);

    if (!category) {
      return Promise.reject(Error('Cannot find category'));
    }
    return await Category.findByIdAndDelete(id);
  } catch (err) {
    return Promise.reject(err);
  }
};

const setCategoryImage = async (id, path) => {
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { image: path },
      { returnOriginal: false },
    );
    if (!category) {
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
        }
      });

      return Promise.reject(Error('Category not found'));
    }
    return category;
  } catch (err) {
    return Promise.reject(err);
  }
};

const listCategories = async (currentPage, perPage) => {
  try {
    const categories = await Category.find({}, { __v: 0 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    return categories;
  } catch (err) {
    return Promise.reject(err);
  }
};

/* End Menu Category */

/* Menu Item */

const addItem = async (item) => {
  try {
    if (!(await restaurantService.findById(item.restaurant)))
      return Promise.reject(Error('No restaurant with given id!'));

    const duplicateItem = await Item.findOne(item);
    if (duplicateItem)
      return Promise.reject(
        Error(`Item Already Exist with id: ${duplicateItem._id}`),
      );

    const category = await Category.findById(item.category);

    if (!category) return Promise.reject(Error('Category not exist'));

    const newItem = await Item.create(item);
    await restaurantService.addItem(item.restaurant, newItem);

    return newItem;
  } catch (err) {
    return Promise.reject(err);
  }
};

const updateItem = async (id, item) => {
  try {
    const updateItem = await Item.findById(id);
    if (!updateItem) return Promise.reject(Error('Item not found'));
    const updatedItem = await Item.findByIdAndUpdate(id, item, {
      returnOriginal: false,
    });

    return updatedItem;
  } catch (err) {
    return Promise.reject(err);
  }
};

const deleteItem = async (id) => {
  try {
    const item = await Item.findByIdAndDelete(id);
    if (!item) return Promise.reject(Error('Item not found'));

    if (item.image)
      fs.unlink(item.image, (err) => {
        if (err) {
          console.error(err);
        }
      });

    return item;
  } catch (err) {
    return Promise.reject(err);
  }
};

const setItemImage = async (id, path) => {
  try {
    const item = await Item.findByIdAndUpdate(
      id,
      { image: path },
      { returnOriginal: false },
    );
    if (!item) {
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
        }
      });

      return Promise.reject(Error('Item not found'));
    }
    return item;
  } catch (err) {
    return Promise.reject(err);
  }
};

const getAvailableItem = async (currentPage, perPage) => {
  try {
    const result = await Item.find({ available: true }, { __v: 0 })
      .populate('category', '-__v')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};

const filterItemByCategory = async (id, currentPage, perPage) => {
  try {
    const result = await Item.find(
      { category: id, available: true },
      { __v: 0 },
    )
      .populate('category', '-__v')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};

/* End Menu Item */

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  setCategoryImage,
  listCategories,

  addItem,
  updateItem,
  deleteItem,
  setItemImage,

  getAvailableItem,
  filterItemByCategory,
};
