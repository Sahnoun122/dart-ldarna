export default function ChoixPlateforme  ({choix , setChoix}){
       return (
         <div className="flex justify-center space-x-4 mb-4">
           <button
             onClick={() => setChoix("darna")}
             className={`px-4 py-2 rounded ${
               choix === "darna" ? "bg-blue-600 text-white" : "bg-gray-200"
             }`}
           >
             Darna
           </button>

           <button
             onClick={() => setChoix("tirelire")}
             className={`px-4 py-2 rounded ${
               choix === "tirelire" ? "bg-green-600 text-white" : "bg-gray-200"
             }`}
           >
             Tirelire
           </button>
         </div>
       );
}