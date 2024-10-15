import { GranjaDTOModel } from "../../types/granjasTypes/granjasSA";

export const getStatusHelper = (status: GranjaDTOModel["status"]): string  => {
    switch (status) {
        case 0:
        return "Offline";
        case 1:
        return "Alguno Offline";
        case 2:
        return "Activos";
        case 5:
        return "Indeterminado";
        default:
        return "Loading";
    }
};