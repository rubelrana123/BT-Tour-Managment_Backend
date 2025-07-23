import AppError from "../../errorHelpers/appError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
//Tour Related Service Here
const createTour = async(payload : Partial<ITour>) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }

    const tour = await Tour.create(payload)

    return tour;
 
};
//get all tour 
const getAllTours = async (query: Record<string, string>) => {
        const tours = await Tour.find({});
          const totalTours = await Tour.countDocuments();
        
        return  {
            data : tours,
              meta : {
                total : totalTours
            }
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

//  Tour Type service Here
//create tour types
const createTourType = async (payload: ITourType) => {
    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    return await TourType.create({ name : payload.name });
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

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
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
};