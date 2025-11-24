import { div } from "framer-motion/m";
import React , {useState} from "react";

export default function MessageInput({onSend}){
    const [text , setText] = useState("");

    const submit = ()=>{
        if(!text.trim()) return;

        onSend(text);
        setText("");
    }

    return (
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Écrire un message..."
        />

        <button
          onClick={submit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Envoyer
        </button>
      </div>
    );
}