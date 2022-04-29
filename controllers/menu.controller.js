/* eslint-disable object-shorthand */
const menuService = require('../services/menu.service');
const mongoose = require('mongoose');
const menuValidation = require('../validationSchemas/menuValidation.schema');

/* Menu Category */
const addCategory = async (req, res) => {
  try {
    try {
      const categoryName = req.body.name;

      addedCategory = await menuService.addCategory(categoryName);
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }

    return res.status(200).json({ message: 'Category added', addedCategory });
  } catch (err) {
    res.status(500).json({ error: true, message: 'internal server error ' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryName = req.body.name;
    try {
      updatedCategory = await menuService.updateCategory(id, categoryName);
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
    return res
      .status(200)
      .json({ error: false, message: `Category updated ${updatedCategory}` });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: 'internal server error ' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(422).json({ error: true, message: 'wrong id' });

    try {
      await menuService.deleteCategory(id);
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }

    return res.status(200).json({ error: false, message: 'Category Deleted!' });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: `internal server error ${err}` });
  }
};

const setCategoryImage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(422).json({ error: true, message: 'wrong id' });

    try {
      const updatedImage = await menuService.setCategoryImage(
        req.params.id,
        req.file.path,
      );

      return res
        .status(200)
        .json({ error: false, message: 'Category Updated', updatedImage });
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: `internal server error ${err}` });
  }
};
/* End Menu Category */

/* Menu Item */
const addItem = async (req, res) => {
  try {
    try {
      const { error } = menuValidation.addItemValidation(req.body);
      if (error)
        return res
          .status(400)
          .json({ error: true, message: error.details[0].message });

      const newItem = await menuService.addItem(req.body);

      return res
        .status(200)
        .json({ error: false, message: 'Item Added!', item: newItem });
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: `internal server error ${err}` });
  }
};

const updateItem = async (req, res) => {
  try {
    const { error } = menuValidation.updateItemValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(422).json({ error: true, message: 'wrong id' });

    try {
      const updatedItem = await menuService.updateItem(req.params.id, req.body);
      return res
        .status(200)
        .json({ error: false, message: 'Item Updated', updatedItem });
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: `internal server error ${err}` });
  }
};

const deleteItem = async (req, res) => {
  try {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(422).json({ error: true, message: 'wrong id' });

      await menuService.deleteItem(req.params.id);
      return res.status(200).json({ error: false, message: 'Item Deleted' });
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: `internal server error ${err}` });
  }
};

const setItemImage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(422).json({ error: true, message: 'wrong id' });

    try {
      const updatedImage = await menuService.setItemImage(
        req.params.id,
        req.file.path,
      );

      return res
        .status(200)
        .json({ error: false, message: 'Item Updated', updatedImage });
    } catch (e) {
      return res.status(422).json({ error: true, message: e.message });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: `internal server error ${err}` });
  }
};
const getAvailableItem = async (req, res) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perpage || 2;

    const result = await menuService.getAvailableItem(currentPage, perPage);

    return res.status(200).json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: `internal server error ${err}` });
  }
};

const filterItemByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const currentPage = req.query.page || 1;
    const perPage = req.query.perpage || 2;

    const result = await menuService.filterItemByCategory(
      id,
      currentPage,
      perPage,
    );

    return res.status(200).json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: `internal server error ${err}` });
  }
};

/* End Menu Item */
module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  setCategoryImage,

  addItem,
  updateItem,
  deleteItem,
  setItemImage,

  getAvailableItem,
  filterItemByCategory,
};
