import React from 'react'

export default function Homepage(){
  const sample = [
    {id:1,name:'Classic Runner',price:'$79'},
    {id:2,name:'Street Sneaks',price:'$89'},
    {id:3,name:'Trail Blazer',price:'$99'},
    {id:4,name:'Comfy Walks',price:'$69'}
  ]
  return (
    <div>
      <h1>Welcome to ShoeStore</h1>
      <p className="card">Find your perfect pair — curated selection, fast checkout.</p>
      <h2>Featured</h2>
      <div className="grid">
        {sample.map(p=> (
          <div key={p.id} className="product card">
            <div style={{height:100,background:'#fafafa',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:8}}>Image</div>
            <strong>{p.name}</strong>
            <div style={{marginTop:8}}>{p.price}</div>
            <div style={{marginTop:10}}><a className="btn" href="#">Buy</a></div>
          </div>
        ))}
      </div>
    </div>
  )
}
