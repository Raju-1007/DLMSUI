import React from 'react'
import { useParams } from 'react-router-dom'
export default function FeedbackForm(){ 
    const { id } = useParams(); 
    const [stars,setStars]=React.useState(0); 
    const [text,setText]=React.useState(''); return (<div style={{padding:16}}><h2>Feedback for Chapter {id}</h2><div className='card'><div>Rating: {[1,2,3,4,5].map(s=> (<button key={s} className='btn' onClick={()=> setStars(s)}>{s<=stars?'★':'☆'}</button>))}</div><textarea rows={4} style={{width:'100%',marginTop:8}} value={text} onChange={e=> setText(e.target.value)} placeholder='Your suggestions...' /><button className='btn' style={{marginTop:8}}>Submit</button></div></div>) }
9