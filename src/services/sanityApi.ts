// // src\services\sanityApi.ts
// "use server"

// import { client } from "@/sanity/lib/client"


// export interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   image: string; 
//   category: string;
// }

// //-----------------------------------------------product Fetch Sanity
// export async function sanityFetch(query: string) {
//   const res: Product[] =  await client.fetch(`${query}{
//           _id,
//           name,
//           price,
//           category,
//           "image": image.asset->url
//         }`)

//   return res;
// }

// //-----------------------------------------------product-Image-Asset-Id

// async function uploadImageToSanity(imageUrl: string) {
//   try {
//     const response = await fetch(imageUrl);
//     if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
//     const blob = await response.blob();

//     const asset = await client.assets.upload("image", blob);
 
//     return asset;
//   } catch (error) {
//     console.error("Image upload failed:", error);
//     throw error;
//   }
// }



// export interface IReturnSanityProduct {
//   _createdAt: string;
//   _id: string;
//   _rev: string;
//   _type: string;
//   _updatedAt: string;
//   category: string;
//   colors: string[],
//   description: string;
//   image: {
//     _type: string;
//     asset: {
//       _ref: string;
//       _type: 'reference'
//     }
//   },
//   price: number;
//   name: string
// }


// //-----------------------------------------------product Update Sanity
// export async function productPostSanity(updatedProduct: Product) {
  
//   const imageAsset = await uploadImageToSanity(updatedProduct.image)
  
//   const res = await client
//   .patch(updatedProduct._id)
//   .set({
//     image: {
//       _type: 'image',
//       asset: {
//         _type: 'reference',
//         _ref: imageAsset._id,
//       },
//     },
//     productName: updatedProduct.name,
//     price: updatedProduct.price,
//     category: updatedProduct.category,
//     // description: updatedProduct.
//   })
//   .commit();

//   return res
  
// }



// //-----------------------------------------------product Delete Sanity
// export async function productDeleteSanity(updatedProduct: Product) {
    
//   const res = await client.delete(updatedProduct._id);

//   return res
  
// }



// //-----------------------------------------------product Create Sanity
// export async function productCreateSanity(updatedProduct: Product) {
//   try {
//     const res = await client.create({
//       _type: "product",
//       productName: updatedProduct.name,
//       price: updatedProduct.price,
//       category: updatedProduct.category,
//       // inventory: updatedProduct.inventory,
//       // description: updatedProduct.description,
//       status: "active",
//       colors: [],
//     });

//     console.log("✅ Product created successfully:", res._id);
//     return res;
//   } catch (error) {
//     console.error("😡 Product creation failed:", error);
//     throw error;
//   }
// }

"use server";

import { client } from "@/sanity/lib/client";

export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

//----------------------------------------------- Fetch Food Items
export async function sanityFetch(query: string): Promise<Product[]> {
  try {
    const res = await client.fetch(`${query}{
      _id,
      name,
      price,
      category,
      "image": image.asset->url
    }`);
    console.log("Fetched food items:", res); // Debugging log
    return res;
  } catch (error) {
    console.error("Error fetching food items:", error);
    throw error;
  }
}

//----------------------------------------------- Upload Image to Sanity
async function uploadImageToSanity(imageUrl: string) {
  try {
    console.log("Uploading image:", imageUrl); // Debugging log
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const blob = await response.blob();
    const asset = await client.assets.upload("image", blob);
    console.log("Image uploaded successfully:", asset); // Debugging log
    return asset;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}

//----------------------------------------------- Update Food Item
export async function productPostSanity(updatedProduct: Product) {
  try {
    console.log("Updating food item:", updatedProduct); // Debugging log
    const imageAsset = await uploadImageToSanity(updatedProduct.image);
    const res = await client
      .patch(updatedProduct._id)
      .set({
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        },
        name: updatedProduct.name,
        price: updatedProduct.price,
        category: updatedProduct.category,
      })
      .commit();
    console.log("Food item updated successfully:", res); // Debugging log
    return res;
  } catch (error) {
    console.error("Error updating food item:", error);
    throw error;
  }
}

//----------------------------------------------- Delete Food Item
export async function productDeleteSanity(product: Product) {
  try {
    console.log("Deleting food item:", product._id); // Debugging log
    const res = await client.delete(product._id);
    console.log("Food item deleted successfully:", res); // Debugging log
    return res;
  } catch (error) {
    console.error("Error deleting food item:", error);
    throw error;
  }
}

//----------------------------------------------- Create Food Item
export async function productCreateSanity(newProduct: Product) {
  try {
    console.log("Creating food item:", newProduct); // Debugging log
    const res = await client.create({
      _type: "food", // Use "food" as the document type
      name: newProduct.name,
      price: newProduct.price,
      category: newProduct.category,
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: (await uploadImageToSanity(newProduct.image))._id,
        },
      },
    });
    console.log("✅ Food item created successfully:", res._id); // Debugging log
    return res;
  } catch (error) {
    console.error("😡 Food item creation failed:", error);
    throw error;
  }
}



