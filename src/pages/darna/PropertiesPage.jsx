import { useState } from "react";
import { useProperties } from "../../context/PropertyContext";

export default function PropertiesPage(){
    const {
      properties,
      createProperty,
      deleteProperty,
      updateProperty,
      loading,
    } = useProperties();

    const [title , setTitle]= useState("");
    const [descriptions , setDescriptions] = useState("");
    const [price , setPrice] = useState("");

    


}