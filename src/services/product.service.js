const mongoose = require("mongoose");
const Category = require("../models/catagory.model");
const Product = require("../models/product.model");

// Create a new product
async function createProduct(reqData) {
  try {
    let topLevel = await Category.findOneAndUpdate(
      { name: reqData.topLevelCategory },
      { $setOnInsert: { level: 1 } },
      { new: true, upsert: true }
    );

    let secondLevel = await Category.findOneAndUpdate(
      { name: reqData.secondLevelCategory, parentCategory: topLevel._id },
      { $setOnInsert: { level: 2, parentCategory: topLevel._id } },
      { new: true, upsert: true }
    );

    let thirdLevel = await Category.findOneAndUpdate(
      { name: reqData.thirdLevelCategory, parentCategory: secondLevel._id },
      { $setOnInsert: { level: 3, parentCategory: secondLevel._id } },
      { new: true, upsert: true }
    );

    const product = new Product({
      title: reqData.title,
      color: reqData.color,
      description: reqData.description,
      discountedPrice: reqData.discountedPrice,
      discountPercent: reqData.discountPercent,
      imageUrl: reqData.imageUrl,
      brand: reqData.brand,
      price: reqData.price,
      sizes: reqData.size,
      quantity: reqData.quantity,
      category: thirdLevel._id,
    });

    const savedProduct = await product.save();
    return savedProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Product creation failed.");
  }
}

// Delete a product by ID
async function deleteProduct(productId) {
  const product = await findProductById(productId);
  if (!product) {
    throw new Error("Product not found with id: " + productId);
  }
  await Product.findByIdAndDelete(productId);
  return "Product deleted successfully";
}

// Update a product by ID
async function updateProduct(productId, reqData) {
  return await Product.findByIdAndUpdate(productId, reqData, { new: true });
}

// Find a product by ID
async function findProductById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }
  const product = await Product.findById(id).populate("category").exec();
  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
}

// Get all products with filtering, sorting, and pagination
async function getAllProducts(reqQuery) {
  console.log("========Request Query:==========", reqQuery);

  let {
    category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize,
  } = reqQuery;

  pageSize = Math.max(parseInt(pageSize) || 10, 1);
  pageNumber = Math.max(parseInt(pageNumber) || 1, 1);

  let query = Product.find().populate("category");

  // Category filtering — fixed bug here
  // -------------------------------------
  // if (category) {
  //   const existCategory = await Category.findOne({ name: category });
  //   console.log("Category:", existCategory);
  //   if (existCategory) {
  //     query = query.where("====category").equals(existCategory._id);
  //   } else {
  //     console.log(`Category "${category}" not found.`);
  //     return { content: [], currentPage: pageNumber, totalPages: 1 };
  //   }
  // }

  if (category) {
    // Check if the category matches the third-level category
    const categoryMatch = await Product.findOne({ thirdLavelCategory: category });
  
    if (categoryMatch) {
      // If category exists in thirdLavelCategory, filter products by it
      query = query.where("thirdLavelCategory").equals(category);
    } else {
      // If category doesn't exist in thirdLavelCategory
      console.log(`Category "${category}" not found in thirdLavelCategory.`);
      return { content: [], currentPage: pageNumber, totalPages: 1 }; // Returning empty array for no match
    }
  } else {
    // If no category is provided, you can add an optional handling (e.g., return all products or log something)
    console.log("No category filter applied.");
    // You can also add some default action or behavior if no category is specified
  }
  



  // Color filtering
  if (color) {
    const colorSet = new Set(color.split(",").map((c) => c.trim().toLowerCase()));
    const colorRegex = new RegExp([...colorSet].join("|"), "i");
    query = query.where("color").regex(colorRegex);
  }

  // Sizes filtering
  if (sizes) {
    const sizesSet = new Set(sizes.split(",").map((s) => s.trim()));
    query = query.where("sizes").elemMatch({ name: { $in: [...sizesSet] } });
  }

  // Price filtering
  if (minPrice) {
    query = query.where("discountedPrice").gte(minPrice);
  }
  if (maxPrice) {
    query = query.where("discountedPrice").lte(maxPrice);
  }

  // Discount filtering
  if (minDiscount) {
    query = query.where("discountPersent").gt(minDiscount);
  }

  // Stock filtering
  if (stock) {
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    } else {
      console.log(`Invalid stock filter: ${stock}`);
    }
  }

  // Sorting
  if (sort) {
    const sortDirection = sort === "price_high" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  } else {
    query = query.sort({ discountedPrice: 1 });
  }

  // Total count before pagination
  const totalProducts = await query.clone().countDocuments();
  const totalPages = Math.ceil(totalProducts / pageSize);

  // Pagination
  const skip = (pageNumber - 1) * pageSize;
  query = query.skip(skip).limit(pageSize);

  // Fetch products
  const products = await query.exec();
  console.log("Fetched Products:", products.length);

  return {
    content: products,
    currentPage: pageNumber,
    totalPages,
    totalProducts,
  };
}

// Create multiple products
async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  findProductById,
  getAllProducts,
  createMultipleProduct,
};
