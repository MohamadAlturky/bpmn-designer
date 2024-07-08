import { useState } from "react";
import Designer from "./components/Designer";
import apiUrl from "./configurations/apiConfiguration.json";
import axios from "axios";

export default function App() {
  const [process, setProcess] = useState<string>("")
  const [pools, setPools] = useState<Pools>()

  const handleSubmit = () => {
    if (process == "") {
      alert("please fill the process")
      return;
    }
    const data = {
      process_description: process
    }
    const axiosInstance = axios.create();
    axiosInstance.post<Pools>(apiUrl.baseUrl + "/pools_and_swimlanes/extract", data)
      .then(res => {
        setPools(res.data)
        console.log(res.data);
        console.log(pools);
        setTimeout(() => {
          fitView({ duration: 1200, padding: 0.3 })
        }, 100);
      }).catch(err => console.log(err));
  }

  return (
    <>

      {pools ? (
        <Designer poolsInput={pools} processInput={process} />
      ) : (
        <div className="submit-process">
          <textarea className="text-process" onChange={e => setProcess(e.target.value)}></textarea>
          <button className="submit-process-btn" onClick={handleSubmit}>api</button>
        </div>
      )}
    </>
  )
}
