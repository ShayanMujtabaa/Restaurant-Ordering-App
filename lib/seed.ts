import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface items {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    items: items[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await databases.listDocuments(
        appwriteConfig.databaseId,
        collectionId
    );

    await Promise.all(
        list.documents.map((doc) =>
            databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles(appwriteConfig.bucketId);

    await Promise.all(
        list.files.map((file) =>
            storage.deleteFile(appwriteConfig.bucketId, file.$id)
        )
    );
}

// async function uploadImageToStorage(imageUrl: string) {
//     const response = await fetch(imageUrl);
//     const blob = await response.blob();

//     const fileObj = {
//         name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
//         type: blob.type,
//         size: blob.size,
//         uri: imageUrl,
//     };

//     const file = await storage.createFile(
//         appwriteConfig.bucketId,
//         ID.unique(),
//         fileObj
//     );

//     return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
// }


async function uploadImageToStorage(imageUrl: string) {
    try {
        console.log('Uploading image:', imageUrl);
        
        // For React Native, we need to use a different approach
        // Create a file object with the URL directly (no blob conversion)
        const fileName = imageUrl.split("/").pop() || `file-${Date.now()}.png`;
        
        const fileObject = {
            name: fileName,
            type: 'image/png',
            size: 0, // Let Appwrite handle the size
            uri: imageUrl, // Direct URL - Appwrite will fetch it
        };
        
        console.log('Created file object:', fileObject);
        
        // Upload to Appwrite storage using the file object with URI
        const uploadedFile = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            fileObject // Pass the file object with URI
        );
        
        console.log('Upload successful, file ID:', uploadedFile.$id);
        
        // Return the file view URL
        return storage.getFileViewURL(appwriteConfig.bucketId, uploadedFile.$id);
        
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
}



async function seed(): Promise<void> {
    // 1. Clear all
    await clearAll(appwriteConfig.categoriesCollectionId);
    await clearAll(appwriteConfig.customizationsCollectionId);
    await clearAll(appwriteConfig.itemsCollectionId);
    await clearAll(appwriteConfig.itemsCustomizationsCollectionId);
    await clearStorage();

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
            ID.unique(),
            cat
        );
        categoryMap[cat.name] = doc.$id;
    }

    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.customizationsCollectionId,
            ID.unique(),
            {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            }
        );
        customizationMap[cus.name] = doc.$id;
    }

    // 4. Create Menu Items
    const itemsMap: Record<string, string> = {};
    for (const item of data.items) {
        const uploadedImage = await uploadImageToStorage(item.image_url);

        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.itemsCollectionId,
            ID.unique(),
            {
                name: item.name,
                description: item.description,
                image_url: uploadedImage,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            }
        );

        itemsMap[item.name] = doc.$id;

        // 5. Create items_customizations
        for (const cusName of item.customizations) {
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.itemsCustomizationsCollectionId,
                ID.unique(),
                {
                    items: doc.$id,
                    customizations: customizationMap[cusName],
                }
            );
        }
    }

    console.log("✅ Seeding complete.");
}

export default seed;