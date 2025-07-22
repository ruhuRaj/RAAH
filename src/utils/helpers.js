export const formatData = (dateString) => {
    if(!dateString) return 'N/A';
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const capitalizeFirstLetter = (str) => {
    if(!str) return '';
    return str.chartAt(0).toUpperCase() + str.slice(1);
};