import { Query } from "mongoose";
import { excludeField } from "../../constant";
import AppError from "../../errorHelpers/appError";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
//Tour Related Service Here
const createTour = async (payload: Partial<ITour>) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error("A tour with this title already exists.");
  }
  // throw new Error("A tour with this title already exists.");
  // if(payload.title) {
  //   const baseSlug = payload.title.trim().toLowerCase().replace(/\s+/g, '-');
  //   let slug = `${baseSlug}-division`;

  //     let counter = 0;
  //     while (await Tour.exists({ slug })) {
  //         slug = `${slug}-${counter++}` // dhaka-division-2
  //     }
  //   payload.slug = slug;

  // }

  /* 
  {
  "_id": {
    "$oid": "6881d8206ac6575973421076"
  },
  "title": "Explore the Beauty of Singra Forest",
  "description": "Experience the world's longest natural sandy sea beach.",
  "images": [
    "singra-forest-1.jpg",
    "singra-forest-2.jpg"
  ],
  "location": "Singra Forest",
  "costFrom": 18700,
  "departureLocation": "Dhaka",
  "arrivalLocation": "Singra Forest",
  "included": [
    "Transportation",
    "Meals",
    "3-star Accommodation",
    "English Guide"
  ],
  "excluded": [
    "Personal Expenses",
    "Tips",
    "Travel Insurance"
  ],
  "amenities": [
    "Free WiFi",
    "AC Transport",
    "First Aid Kit",
    "Welcome Drink"
  ],
  "tourPlan": [
    "Day 1: Arrival & Beach Walk",
    "Day 2: Himchori Waterfall Visit",
    "Day 3: Marine Drive Tour",
    "Day 4: Free Day",
    "Day 5: Return"
  ],
  "maxGuest": 14,
  "minAge": 10,
  "division": "6880b91b2889daaf85b74abb",
  "tourType": "6880b9fe2889daaf85b74acb" 
}
  */
  const tour = await Tour.create(payload);

  return tour;
};
//get all tour
// const getAllTours = async (query: Record<string, string>) => {
//   const filter = query;
//   console.log("filter here", filter)
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query.fields?.replace(/,/g, " ") || "";
//   const limit = Number(query.limit) || 10;
//   const page  = Number(query.page) || 1;
//   const skip   = (page - 1 ) * limit;
//   //    delete filter["searchTerm"];
//   //    delete filter["sort"];
//   for (const field of excludeField) {
//     delete filter[field];
//   };
//   console.log("filter here", filter)

//   const searchObject = {
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };
//   //     // [remove][remove][remove](SKip)[][][][][][]

// //     // [][][][][](limit)[remove][remove][remove][remove]

// //     // 1 page => [1][1][1][1][1][1][1][1][1][1] skip = 0 limit =10
// //     // 2 page => [1][1][1][1][1][1][1][1][1][1]=>skip=>[2][2][2][2][2][2][2][2][2][2]<=limit skip = 10 limit =10
// //     // 3 page => [1][1][1][1][1][1][1][1][1][1]=>skip=>[2][2][2][2][2][2][2][2][2][2]<=limit skip = 20 limit = 10

// //     // skip = (page -1) * 10 = 30

// //     // ?page=3&limit=10
// //   const tours = await Tour.find(searchObject).find(filter).sort(sort).select(fields).skip(skip).limit(limit);
//       const filterQuery = Tour.find(filter)

//     const tours = filterQuery.find(searchObject)

//     const allTours = await tours.sort(sort).select(fields).skip(skip).limit(limit)
//   const totalTours = await Tour.countDocuments();
// //     // const totalPage = 21/10 = 2.1 => ceil(2.1) => 3
//     const totalPage = Math.ceil(totalTours / limit)
//     const meta = {
//         page: page,
//         limit: limit,
//         total: totalTours,
//         totalPage: totalPage,
//     }
//     return {
//         data: allTours,
//         meta: meta
//     }
// };

 
const getAllTours = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Tour.find(), query)

    const tours =  queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])

    return {
        data: data,
        meta:  meta
    }
};
//update tour
const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new Error("Tour not found.");
  }

  // if (payload.title) {
  //     const baseSlug = payload.title.toLowerCase().split(" ").join("-")
  //     let slug = `${baseSlug}`

  //     let counter = 0;
  //     while (await Tour.exists({ slug })) {
  //         slug = `${slug}-${counter++}` // dhaka-division-2
  //     }

  //     payload.slug = slug
  // }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  return updatedTour;
};

//delete tour
const deleteTour = async (id: string) => {
  return await Tour.findByIdAndDelete(id);
};
const getSingleTour = async (slug: string) => {
    const tour = await Tour.findOne({ slug });
    return {
        data: tour,
    }
};

//  Tour Type service Here
//create tour types
const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }

  return await TourType.create({ name: payload.name });
};
//get all tour type
const getAllTourTypes = async () => {
  return await TourType.find();
};
//updateTourType
const updateTourType = async (id: string, payload: ITourType) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedTourType;
};

//delete tour type
const deleteTourType = async (id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new Error("Tour type not found.");
  }

  return await TourType.findByIdAndDelete(id);
};

export const TourService = {
  createTour,
  createTourType,
  deleteTourType,
  updateTourType,
  getAllTourTypes,
  getAllTours,
  updateTour,
  deleteTour,
  getSingleTour
};
function getMeta() {
    throw new Error("Function not implemented.");
}

