const { Router } = require('express');
const authMiddlware = require('../middlwares/auth.middlware');
const menuController = require('../controllers/menu.controller');

const multerConf = require('../utils/multer');

const router = Router();

/* Menu Category */
router.post(
  '/category',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  menuController.addCategory,
);

router.put(
  '/category/:id',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  menuController.updateCategory,
);

router.delete(
  '/category/:id',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  menuController.deleteCategory,
);

router.post(
  '/category/:id/image',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  multerConf.single('image'),
  menuController.setCategoryImage,
);

router.get(
  '/category',
  authMiddlware.isLoggedIn,
  menuController.listCategories,
);

/* End Menu Category */

/* Menu Item */
router.post(
  '/item',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  menuController.addItem,
);

router.put(
  '/item/:id',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  menuController.updateItem,
);

router.delete(
  '/item/:id',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  menuController.deleteItem,
);

router.post(
  '/item/:id/image',
  authMiddlware.isLoggedIn,
  authMiddlware.isAdmin,
  multerConf.single('image'),
  menuController.setItemImage,
);

/* End Menu Item */

router.get(
  '/available-item',
  authMiddlware.isLoggedIn,
  menuController.getAvailableItem,
);

router.get(
  '/available-item/:id',
  authMiddlware.isLoggedIn,
  menuController.filterItemByCategory,
);

module.exports = router;
