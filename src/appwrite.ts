import { Client, Databases, ID, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const database = new Databases(client);

export interface Movie {
  id: number;
  poster_path: string;
}

export const updateSearchCount = async (searchTerm: string, movie: Movie) => {
  try {
    // 1. البحث عن المصطلح في قاعدة البيانات
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', searchTerm),
    ]);

    if (result.documents.length > 0) {
      const doc = result.documents[0];

      // 2. تحديث العدد إذا كان المصطلح موجودًا
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: (doc.count || 0) + 1, // التأكد من أن `count` موجود
      });
    } else {
      // 3. إنشاء مستند جديد إذا لم يكن المصطلح موجودًا
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};
export const getTrendingMovies = async () => {
  try {
   const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
     Query.limit(5),
     Query.orderDesc("count")
   ])
 
   return result.documents;
  } catch (error) {
   console.error(error);
  }
 }


