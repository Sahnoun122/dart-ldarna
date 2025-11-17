import { createContext , useContext , useState , useEffect } from "react";
import { apiDarna } from "../services/api";

const   PropretyContext = createContext();


export function     PropretyPrivider ({children}){
    const [properties , setProperties]= useEffect([]);
    const [loading , setLoading] = useState(false);

    const Properites = async()=>{
        setLoading(true)
        try {
            
            const res = await apiDarna.get("properties");
            setProperties(res.data)
        } catch (error) {
            console.error(error)
        }finally{
            setLoading(false)
        }
    }

const  createProperty = async(data)=>{
     setLoading(true)

     try {
        const res = await apiDarna.post("/properties" , data);
        setProperties([...properties , res.data]);
        return res.data;
     } catch (error) {
        console.error(error);
     }finally{
        setLoading(false)
     }
    }
    
    const updateProperty = async(id , data)=>{
        setLoading(true);

        try {
            const res = await apiDarna.patch(`/properties/${id}`, data);
            setProperties(properties.map((d)=> d.id === id ? res.data : d))
            return res.data
        } catch (error) {
            console.error(error)
        }finally{
            setLoading(false)
        }
    }

    const deleteProperty = async(id)=>{
        setLoading(true);

        try {
            const res = await apiDarna.delete(`/properties/${id}`);
            setProperties(properties.filter(d => d.id === id));
            
        } catch (error) {
            console.error(error)
            
        }finally{
            setProperties(false)
        }
    }

    useEffect(()=>{
        Properites();
    },[]);


  return (
    <PropretyPrivider.Provider
      value={{
        loading,
        setLoading,
        properties,
        setProperties,
      }}
    >
      {children}
    </PropretyPrivider.Provider>
  );
}

export const useProperties = ()=> useContext(PropretyContext);