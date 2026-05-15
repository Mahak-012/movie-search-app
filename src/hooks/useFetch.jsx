import { useState, useEffect } from "react";
const BASE = "https://api.themoviedb.org/3";
const KEY  = import.meta.env.VITE_TMDB_API_KEY;

export function useFetch(endpoint, params={}) {
  const [data,setData]       = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError]     = useState(null);
  const qs = new URLSearchParams({api_key:KEY,...params}).toString();

  useEffect(()=>{
    let cancelled=false;
    setLoading(true);
    fetch(`${BASE}${endpoint}?${qs}`)
      .then(r=>r.json())
      .then(d=>{ if(!cancelled){setData(d);setLoading(false);} })
      .catch(e=>{ if(!cancelled){setError(e);setLoading(false);} });
    return ()=>{cancelled=true;};
  },[endpoint,qs]);

  return {data,loading,error};
}