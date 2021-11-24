import axios from "axios";


export const listProducts= (type) =>{
    return axios.get("/list?type="+type); //BASKET,ALL
};
export const addBasket= (name) =>{
    return axios.put("/putIn?name="+name);
};
export const changeProduct= (type,name) =>{
    return axios.put("/change?type="+type+"&name="+name); //REMOVE,INCREASE,DECREASE
};
export const clearBasket = () =>{
    return axios.put("/clear");
};
