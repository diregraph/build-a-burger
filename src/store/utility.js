export const updateObject = (object, updates) => {
    return {
        ...object,
        ...updates
    }
};