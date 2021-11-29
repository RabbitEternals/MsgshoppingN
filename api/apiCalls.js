import axios from "axios";

export const listProducts= (type) =>{
    return axios.get("/list?type="+type,{
      headers: {
        Accept:'application/json;charset=utf-8',
      },
      baseURL: process.env.apiBaseURL
    }); //BASKET,ALL
};
export const addBasket= (name) =>{
    return axios.put("/putIn?name="+name,{
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: process.env.apiBaseURL
    });
};
export const changeProduct= (type,name) =>{
    return axios.put("/change?type="+type+"&name="+name,{
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: process.env.apiBaseURL
    }); //REMOVE,INCREASE,DECREASE
};
export const clearBasket = () =>{
    return axios.put("/clear",{
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: process.env.apiBaseURL
    });
};
