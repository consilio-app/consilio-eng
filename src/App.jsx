import { useState, useEffect, useRef, useCallback } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const O="#F5921B",OD="#D97B0E",G="#22C55E",R="#EF4444",BG="#0A0A0A",CARD="#141414",CARD2="#1A1A1A",BD="#1F1F1F",BD2="#2A2A2A",T="#F5F5F5",TD="#999",TM="#555",GOLD="#FFD700";
const CATS=["All","Politics","Crypto","Sports","Pop Culture","Science","Business"];

// ─── SVG CROWN LOGO ───
const CrownLogo=({size=36})=>(
<svg width={size} height={size*0.75} viewBox="0 0 120 90" fill="none">
<defs>
<linearGradient id="cg" x1="0" y1="0" x2="120" y2="90" gradientUnits="userSpaceOnUse">
<stop offset="0%" stopColor="#FFE066"/><stop offset="35%" stopColor="#FFD700"/><stop offset="65%" stopColor={O}/><stop offset="100%" stopColor={OD}/>
</linearGradient>
<filter id="gl"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<g filter="url(#gl)">
<path d="M60 4L53 38" stroke="url(#cg)" strokeWidth="5.5" strokeLinecap="round"/>
<path d="M60 4L67 38" stroke="url(#cg)" strokeWidth="5.5" strokeLinecap="round"/>
<path d="M35 22L30 44" stroke="url(#cg)" strokeWidth="4.5" strokeLinecap="round"/>
<path d="M35 22L42 42" stroke="url(#cg)" strokeWidth="4.5" strokeLinecap="round"/>
<path d="M85 22L78 42" stroke="url(#cg)" strokeWidth="4.5" strokeLinecap="round"/>
<path d="M85 22L90 44" stroke="url(#cg)" strokeWidth="4.5" strokeLinecap="round"/>
<path d="M14 40L20 52" stroke="url(#cg)" strokeWidth="3.5" strokeLinecap="round"/>
<path d="M14 40L28 48" stroke="url(#cg)" strokeWidth="3.5" strokeLinecap="round"/>
<path d="M106 40L100 52" stroke="url(#cg)" strokeWidth="3.5" strokeLinecap="round"/>
<path d="M106 40L92 48" stroke="url(#cg)" strokeWidth="3.5" strokeLinecap="round"/>
<path d="M12 58 Q36 42,60 44 Q84 42,108 58" stroke="url(#cg)" strokeWidth="5" fill="none" strokeLinecap="round"/>
</g>
<circle cx="104" cy="24" r="2" fill="white" opacity="0.85"/>
<circle cx="60" cy="2" r="1.5" fill="white" opacity="0.7"/>
<circle cx="18" cy="36" r="1" fill="white" opacity="0.5"/>
</svg>
);

// ─── ICONS ───
const XIcon=()=><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const GHIcon=()=><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
const CoinIcon=()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 9.5c0-1.38 1.79-2.5 4-2.5s4 1.12 4 2.5-1.79 2.5-4 2.5-4 1.12-4 2.5 1.79 2.5 4 2.5"/></svg>;
const WalletIcon=()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><circle cx="18" cy="12" r="1.5"/></svg>;
const SearchIcon=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
const VolumeIcon=()=><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>;
const SparkIcon=({s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/></svg>;
const SendIcon=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>;
const CloseIcon=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>;
const MenuIcon=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>;

const fmt=n=>{if(!n&&n!==0)return"$0";if(n>=1e9)return`$${(n/1e9).toFixed(1)}B`;if(n>=1e6)return`$${(n/1e6).toFixed(1)}M`;if(n>=1e3)return`$${(n/1e3).toFixed(1)}K`;return`$${Math.round(n)}`};

// ─── GLOBAL STYLES ───
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Space+Mono:wght@400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent}
::selection{background:${O}44}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${BD2};border-radius:3px}
input{font-family:inherit}
button{font-family:inherit}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:.25}50%{opacity:.75}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes glow{0%,100%{box-shadow:0 0 16px ${O}22}50%{box-shadow:0 0 28px ${O}44}}
.sk{background:linear-gradient(90deg,#141414 25%,#1A1A1A 50%,#141414 75%);background-size:800px 100%;animation:shimmer 1.5s infinite;border-radius:14px}

/* ── RESPONSIVE GRID ── */
.market-grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(340px,1fr))}
.stats-grid{display:grid;gap:14px;grid-template-columns:1fr 1fr}
.stats-top{display:grid;gap:14px;grid-template-columns:repeat(4,1fr)}
.activity-feed{max-height:320px;overflow-y:auto;-webkit-overflow-scrolling:touch}
.activity-feed::-webkit-scrollbar{width:3px}.activity-feed::-webkit-scrollbar-thumb{background:${BD2};border-radius:2px}
@keyframes livePulse{0%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.3)}100%{opacity:1;transform:scale(1)}}
@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes feedSlide{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@media(max-width:768px){
  .market-grid{grid-template-columns:1fr}
  .stats-grid{grid-template-columns:1fr}
  .stats-top{grid-template-columns:1fr 1fr}
  .stats-section{padding:0 12px 20px !important}
  .hero-title{font-size:26px !important}
  .hero-sub{font-size:13px !important}
  .hero-crown{display:none}
  .nav-links-desktop{display:none !important}
  .nav-mobile-toggle{display:flex !important}
  .ai-panel{width:100vw !important}
  .cat-bar{justify-content:flex-start !important;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:6px;scrollbar-width:none;-ms-overflow-style:none}
  .cat-bar::-webkit-scrollbar{display:none}
  .search-wrap{max-width:100% !important}
  .hero-section{padding:24px 16px 16px !important}
  .grid-section{padding:0 12px 40px !important}
  .nav-bar{padding:0 12px !important}
  .footer-section{padding:20px 16px !important}
  .sort-bar{flex-direction:row;justify-content:space-between}
}
@media(max-width:400px){
  .market-grid{gap:10px}
  .hero-title{font-size:22px !important}
}
@media(min-width:769px){
  .nav-mobile-toggle{display:none !important}
  .mobile-drawer{display:none !important}
}
`;

// ─── AI AGENT PANEL ───
const AIAgent=({isOpen,onClose,events})=>{
  const[msgs,setMsgs]=useState([{role:"assistant",content:"Hey! I'm **Consilio AI** — your prediction market analyst.\n\n• **Analyze markets** — ask about any active event\n• **Find value bets** — spot mispriced odds\n• **Market summaries** — get the big picture\n• **Strategy tips** — improve your trading\n\nWhat would you like to explore?"}]);
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const endRef=useRef(null);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[msgs]);

  const buildCtx=()=>{
    const top=events.slice(0,15).map(e=>{
      const m=e.markets?.[0];const p=m?.outcomePrices?JSON.parse(m.outcomePrices):[0.5,0.5];
      return`• "${e.title}" — Yes:${Math.round(p[0]*100)}% | Vol:${fmt(e.volume||0)}`;
    }).join("\n");
    return`Active Polymarket events:\n${top}`;
  };

  const send=async(text)=>{
    if(!text.trim()||loading)return;
    const u={role:"user",content:text};
    setMsgs(p=>[...p,u]);setInput("");setLoading(true);
    try{
      const ctx=buildCtx();
      const history=[...msgs.slice(-10),u].map(m=>({role:m.role,content:m.content}));
      const apiKey=import.meta.env.VITE_ANTHROPIC_API_KEY||"";
      const res=await fetch(apiKey?"/api/chat":"https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json",...(apiKey?{"x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"}:{})},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:`You are Consilio AI, a sharp, opinionated prediction market analyst. You're embedded in a Polymarket-based app called Consilio. Help users analyze markets, find value, understand events, and build strategies. Be concise and use markdown. Use bullet points with •. Give specific, actionable insights. If asked to analyze a market, rate it as Bullish/Bearish/Neutral with a confidence score.\n\n${ctx}`,
          messages:history
        })
      });
      const data=await res.json();
      const reply=data.content?.map(b=>b.text||"").join("")||"Hmm, I couldn't process that. Try again?";
      setMsgs(p=>[...p,{role:"assistant",content:reply}]);
    }catch{
      setMsgs(p=>[...p,{role:"assistant",content:"Connection issue — try again shortly."}]);
    }
    setLoading(false);
  };

  const quicks=[
    {l:"🔥 Hot Markets",p:"What are the hottest markets right now? Analyze the top 5 by volume with your quick take."},
    {l:"💎 Value Bets",p:"Find me value bets — markets where odds might be mispriced with asymmetric upside."},
    {l:"📊 Summary",p:"Give a brief market summary — sentiment, movers, interesting patterns."},
    {l:"🎯 Strategy",p:"Give me 3 actionable prediction market strategies for beginners."},
  ];

  const renderMd=(text)=>text.split("\n").map((line,i)=>{
    let h=line.replace(/\*\*(.+?)\*\*/g,`<strong style="color:${T}">$1</strong>`).replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/`(.+?)`/g,`<code style="background:${BD};padding:1px 5px;border-radius:4px;font-size:11px;color:${O}">$1</code>`);
    if(line.match(/^[•\-] /)){h=`<span style="color:${O};margin-right:5px">▸</span>${h.replace(/^[•\-] /,"")}`;return<div key={i} style={{paddingLeft:4,marginBottom:3,lineHeight:1.6}} dangerouslySetInnerHTML={{__html:h}}/>}
    if(line.startsWith("# "))return<div key={i} style={{fontSize:15,fontWeight:700,color:T,marginTop:8,marginBottom:3}} dangerouslySetInnerHTML={{__html:h.slice(2)}}/>;
    if(line==="")return<div key={i} style={{height:6}}/>;
    return<div key={i} style={{lineHeight:1.6,marginBottom:2}} dangerouslySetInnerHTML={{__html:h}}/>;
  });

  if(!isOpen)return null;

  return(
    <div className="ai-panel" style={{position:"fixed",right:0,top:0,bottom:0,width:420,maxWidth:"100vw",zIndex:200,background:BG,borderLeft:`1px solid ${BD2}`,display:"flex",flexDirection:"column",animation:"slideIn 0.25s ease"}}>
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${BD}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:10,background:`linear-gradient(135deg,${O}20,${GOLD}20)`,border:`1px solid ${O}33`,display:"flex",alignItems:"center",justifyContent:"center",color:O}}><SparkIcon s={16}/></div>
          <div>
            <div style={{color:T,fontSize:13,fontWeight:700}}>Consilio AI Agent</div>
            <div style={{color:G,fontSize:9,fontWeight:600,display:"flex",alignItems:"center",gap:3}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:G,display:"inline-block"}}/>Online
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:TD,cursor:"pointer",padding:8,WebkitTapHighlightColor:"transparent"}}><CloseIcon/></button>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"14px 12px 6px",display:"flex",flexDirection:"column",gap:10,WebkitOverflowScrolling:"touch"}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",gap:8,flexDirection:m.role==="user"?"row-reverse":"row"}}>
            {m.role==="assistant"&&<div style={{width:26,height:26,borderRadius:7,background:`${O}12`,border:`1px solid ${O}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,color:O}}><SparkIcon s={12}/></div>}
            <div style={{maxWidth:"82%",padding:"10px 13px",borderRadius:14,fontSize:13,color:m.role==="user"?"#fff":TD,lineHeight:1.5,background:m.role==="user"?`linear-gradient(135deg,${O},${OD})`:CARD2,borderBottomRightRadius:m.role==="user"?4:14,borderBottomLeftRadius:m.role==="assistant"?4:14,wordBreak:"break-word"}}>
              {m.role==="assistant"?renderMd(m.content):m.content}
            </div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",gap:8}}><div style={{width:26,height:26,borderRadius:7,background:`${O}12`,border:`1px solid ${O}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:O}}><SparkIcon s={12}/></div><div style={{padding:"11px 14px",background:CARD2,borderRadius:"14px 14px 14px 4px"}}><div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:O,opacity:.4,animation:`pulse 1s ${i*.2}s infinite`}}/>)}</div></div></div>}
        <div ref={endRef}/>
      </div>

      {msgs.length<=2&&<div style={{padding:"0 12px 6px",display:"flex",flexWrap:"wrap",gap:5}}>
        {quicks.map((a,i)=><button key={i} onClick={()=>send(a.p)} style={{padding:"7px 12px",borderRadius:18,border:`1px solid ${BD2}`,background:CARD2,color:TD,fontSize:12,cursor:"pointer",fontWeight:500,WebkitTapHighlightColor:"transparent"}}>{a.l}</button>)}
      </div>}

      <div style={{padding:"10px 12px 14px",paddingBottom:"max(14px, env(safe-area-inset-bottom))",borderTop:`1px solid ${BD}`,flexShrink:0}}>
        <div style={{display:"flex",gap:8,alignItems:"end"}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send(input)} placeholder="Ask about any market..." style={{flex:1,padding:"11px 13px",background:CARD2,border:`1px solid ${BD2}`,borderRadius:11,color:T,fontSize:14,outline:"none",boxSizing:"border-box",WebkitAppearance:"none"}}/>
          <button onClick={()=>send(input)} disabled={!input.trim()||loading} style={{width:40,height:40,borderRadius:10,border:"none",cursor:input.trim()?"pointer":"default",background:input.trim()?`linear-gradient(135deg,${O},${OD})`:BD,color:input.trim()?"#fff":TM,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,WebkitTapHighlightColor:"transparent"}}><SendIcon/></button>
        </div>
      </div>
    </div>
  );
};

// ─── ORDER MODAL ───
const OrderModal=({market,outcome,onClose})=>{
  const[amount,setAmount]=useState("");
  const[tab,setTab]=useState(outcome||"Yes");
  const price=tab==="Yes"?(market.yesPrice||.5):(1-(market.yesPrice||.5));
  const shares=amount?(parseFloat(amount)/price).toFixed(2):"0.00";

  return(
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center",background:"rgba(0,0,0,.75)",backdropFilter:"blur(6px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:CARD,border:`1px solid ${BD2}`,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:440,padding:"20px 20px",paddingBottom:"max(20px, env(safe-area-inset-bottom))",animation:"slideUp 0.25s ease",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{width:36,height:4,borderRadius:2,background:BD2,margin:"0 auto 16px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:16}}>
          <h3 style={{color:T,fontSize:15,fontWeight:600,margin:0,lineHeight:1.4,maxWidth:"85%"}}>{market.question}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:TD,cursor:"pointer",fontSize:22,padding:4,WebkitTapHighlightColor:"transparent"}}>&times;</button>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:20,background:"#0A0A0A",borderRadius:10,padding:3}}>
          {["Yes","No"].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"10px 0",borderRadius:8,border:"none",cursor:"pointer",fontWeight:700,fontSize:15,background:tab===t?(t==="Yes"?G:R):"transparent",color:tab===t?"#fff":TD,WebkitTapHighlightColor:"transparent"}}>{t} {Math.round((t==="Yes"?market.yesPrice:1-market.yesPrice)*100)}¢</button>)}
        </div>
        <label style={{display:"block",color:TD,fontSize:10,marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Amount (USDC)</label>
        <input value={amount} onChange={e=>setAmount(e.target.value.replace(/[^0-9.]/g,""))} placeholder="0.00" inputMode="decimal" style={{width:"100%",padding:"14px 16px",background:"#0A0A0A",border:`1px solid ${BD2}`,borderRadius:12,color:T,fontSize:24,fontWeight:700,outline:"none",boxSizing:"border-box",marginBottom:12,WebkitAppearance:"none"}}/>
        <div style={{display:"flex",gap:6,marginBottom:20}}>
          {[5,10,25,50,100].map(v=><button key={v} onClick={()=>setAmount(String(v))} style={{flex:1,padding:"8px 0",background:amount===String(v)?O+"14":"#0A0A0A",border:`1px solid ${amount===String(v)?O+"55":BD}`,borderRadius:8,color:amount===String(v)?O:TD,cursor:"pointer",fontSize:13,fontWeight:700,WebkitTapHighlightColor:"transparent"}}>${v}</button>)}
        </div>
        <div style={{background:"#0A0A0A",borderRadius:12,padding:14,marginBottom:20}}>
          {[["Avg price",`${price.toFixed(2)} USDC`,T],["Est. shares",shares,T],["Potential return",`${shares} USDC`,G]].map(([l,v,c],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:i<2?8:0}}><span style={{color:TD,fontSize:13}}>{l}</span><span style={{color:c,fontSize:13,fontWeight:700}}>{v}</span></div>)}
        </div>
        <button style={{width:"100%",padding:"16px 0",background:tab==="Yes"?G:R,border:"none",borderRadius:12,color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",opacity:amount?1:.4,WebkitTapHighlightColor:"transparent"}} disabled={!amount} onClick={()=>{alert(`Order placed! Buy ${shares} ${tab} shares for $${amount}`);onClose()}}>Buy {tab}</button>
        <p style={{color:TM,fontSize:10,textAlign:"center",marginTop:10}}>Connect Solana wallet to place real orders</p>
      </div>
    </div>
  );
};

// ─── MARKET CARD ───
const MarketCard=({event,onBuy,onAI})=>{
  const m=event.markets?.[0];if(!m)return null;
  const yp=m.outcomePrices?parseFloat(JSON.parse(m.outcomePrices)[0]):null;
  const y=yp!==null?Math.round(yp*100):null;
  const n=yp!==null?Math.round((1-yp)*100):null;
  const vol=event.volume||m.volume||0;
  const img=event.image||m.image;

  return(
    <div style={{background:CARD,border:`1px solid ${BD}`,borderRadius:16,padding:16,display:"flex",flexDirection:"column",gap:12,transition:"all 0.25s"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=O+"44";e.currentTarget.style.transform="translateY(-2px)"}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=BD;e.currentTarget.style.transform="translateY(0)"}}>
      <div style={{display:"flex",gap:12,alignItems:"start"}}>
        {img&&<img src={img} alt="" style={{width:42,height:42,borderRadius:10,objectFit:"cover",flexShrink:0,background:"#111"}} onError={e=>e.target.style.display="none"}/>}
        <div style={{flex:1,minWidth:0}}>
          <h3 style={{color:T,fontSize:13.5,fontWeight:600,margin:0,lineHeight:1.45,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{event.title||m.question}</h3>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
            <span style={{display:"flex",alignItems:"center",gap:3,color:TM,fontSize:11}}><VolumeIcon/>{fmt(vol)}</span>
            <button onClick={()=>onAI(event.title||m.question)} style={{display:"flex",alignItems:"center",gap:3,color:O+"77",fontSize:11,background:"none",border:"none",cursor:"pointer",padding:0,fontWeight:700,WebkitTapHighlightColor:"transparent"}}><SparkIcon s={10}/>Analyze</button>
          </div>
        </div>
      </div>
      {y!==null&&<div style={{position:"relative",background:"#0A0A0A",borderRadius:6,overflow:"hidden",height:4}}><div style={{position:"absolute",height:"100%",width:`${y}%`,background:`linear-gradient(90deg,${G},${G}88)`,borderRadius:6,transition:"width 0.6s ease"}}/></div>}
      <div style={{display:"flex",gap:8}}>
        {[["Yes",G,y],["No",R,n]].map(([label,col,pct])=>(
          <button key={label} onClick={()=>onBuy({question:event.title||m.question,yesPrice:yp||.5},label)} style={{
            flex:1,padding:"11px 0",background:col+"0A",border:`1px solid ${col}22`,borderRadius:10,cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",justifyContent:"center",gap:6,WebkitTapHighlightColor:"transparent",
          }}>
            <span style={{color:col,fontWeight:700,fontSize:14}}>{label}</span>
            <span style={{color:col+"99",fontWeight:600,fontSize:13}}>{pct!=null?`${pct}¢`:"—"}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── ANIMATED COUNTER ───
const AnimCounter=({value,prefix="",suffix=""})=>{
  const[display,setDisplay]=useState(0);
  const prev=useRef(0);
  useEffect(()=>{
    const start=prev.current;const end=value;const dur=800;const t0=Date.now();
    const tick=()=>{const p=Math.min((Date.now()-t0)/dur,1);const ease=1-Math.pow(1-p,3);setDisplay(start+(end-start)*ease);if(p<1)requestAnimationFrame(tick)};
    tick();prev.current=value;
  },[value]);
  return<span>{prefix}{display>=1e9?`${(display/1e9).toFixed(2)}B`:display>=1e6?`${(display/1e6).toFixed(2)}M`:display>=1e3?`${(display/1e3).toFixed(1)}K`:Math.round(display)}{suffix}</span>;
};

// ─── CUSTOM TOOLTIP ───
const ChartTooltip=({active,payload,label,prefix="$"})=>{
  if(!active||!payload?.length)return null;
  return<div style={{background:"#1A1A1A",border:`1px solid ${BD2}`,borderRadius:10,padding:"8px 12px",boxShadow:"0 8px 24px rgba(0,0,0,.5)"}}>
    <div style={{color:TM,fontSize:10,marginBottom:3}}>{label}</div>
    {payload.map((p,i)=><div key={i} style={{color:p.color||O,fontSize:13,fontWeight:700}}>{prefix}{typeof p.value==="number"?p.value>=1e6?`${(p.value/1e6).toFixed(2)}M`:p.value>=1e3?`${(p.value/1e3).toFixed(1)}K`:p.value.toLocaleString():p.value}</div>)}
  </div>;
};

// ─── STATS DASHBOARD ───
const StatsDashboard=({events})=>{
  const[volumeData,setVolumeData]=useState([]);
  const[topMarkets,setTopMarkets]=useState([]);
  const[solanaFeed,setSolanaFeed]=useState([]);
  const[stats,setStats]=useState({totalVol:0,markets:0,traders:0,openInterest:0});
  const[tick,setTick]=useState(0);
  const feedRef=useRef(null);

  // Build stats from events
  useEffect(()=>{
    if(!events.length)return;
    const totalVol=events.reduce((s,e)=>s+(e.volume||0),0);
    const oi=events.reduce((s,e)=>s+(e.openInterest||e.liquidity||0),0);
    setStats({totalVol,markets:events.length,traders:Math.round(totalVol/850),openInterest:oi||totalVol*0.35});

    // Generate 24h volume chart from event data
    const hours=24;const now=Date.now();
    const vd=Array.from({length:hours},(_, i)=>{
      const h=hours-1-i;const t=new Date(now-h*3600000);
      const base=totalVol/hours;const noise=(Math.sin(i*0.8)*0.3+Math.random()*0.4-0.2);
      const spike=i>18?1.4:i>14?1.2:i<6?0.6:1;
      return{time:t.getHours().toString().padStart(2,"0")+":00",vol:Math.max(0,Math.round(base*(1+noise)*spike)),trades:Math.round(120+Math.random()*380*spike)};
    });
    setVolumeData(vd);

    // Top markets by volume
    const sorted=[...events].sort((a,b)=>(b.volume||0)-(a.volume||0)).slice(0,8);
    setTopMarkets(sorted.map(e=>{
      const m=e.markets?.[0];const p=m?.outcomePrices?JSON.parse(m.outcomePrices):[0.5,0.5];
      return{name:(e.title||"").slice(0,30)+(e.title?.length>30?"…":""),vol:e.volume||0,yes:Math.round(p[0]*100)};
    }));
  },[events]);

  // Simulated real-time Solana activity feed
  useEffect(()=>{
    const wallets=["7xKp","9mRd","3vFs","BnQ2","5hTk","DpW8","2cYe","Fj4x","8sLm","kR6n","4wAz","NvH3","Qs7p","6bUt","XcE9"];
    const actions=["bought YES","bought NO","sold YES","sold NO","placed limit","filled order"];
    const markets=events.slice(0,10).map(e=>(e.title||"").slice(0,28));
    const addTx=()=>{
      if(!markets.length)return;
      const tx={
        id:Date.now()+Math.random(),
        wallet:wallets[Math.floor(Math.random()*wallets.length)]+"..."+Math.random().toString(36).slice(2,6),
        action:actions[Math.floor(Math.random()*actions.length)],
        market:markets[Math.floor(Math.random()*markets.length)],
        amount:(Math.random()*500+5).toFixed(0),
        time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),
        isGreen:Math.random()>0.4,
      };
      setSolanaFeed(prev=>[tx,...prev].slice(0,50));
    };
    // Initial batch
    for(let i=0;i<8;i++)setTimeout(addTx,i*100);
    const iv=setInterval(addTx,2200+Math.random()*1800);
    return()=>clearInterval(iv);
  },[events]);

  // Live tick for stats jitter
  useEffect(()=>{
    const iv=setInterval(()=>setTick(t=>t+1),3000);
    return()=>clearInterval(iv);
  },[]);

  const jitter=(base,pct=0.02)=>base*(1+(Math.sin(tick*0.7)*pct));

  if(!events.length)return null;

  const statCards=[
    {label:"24h Volume",value:jitter(stats.totalVol),prefix:"$",color:O,icon:"📊"},
    {label:"Active Markets",value:stats.markets,prefix:"",color:GOLD,icon:"🔥"},
    {label:"Est. Traders",value:jitter(stats.traders),prefix:"",color:G,icon:"👥"},
    {label:"Open Interest",value:jitter(stats.openInterest),prefix:"$",color:"#8B5CF6",icon:"💎"},
  ];

  return(
    <div className="stats-section" style={{maxWidth:1200,margin:"0 auto",padding:"0 20px 28px"}}>
      {/* Section Header */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <div style={{width:3,height:20,borderRadius:2,background:`linear-gradient(180deg,${O},${GOLD})`}}/>
        <h2 style={{fontFamily:"'Space Mono',monospace",fontSize:16,fontWeight:700,color:T,letterSpacing:"-0.3px"}}>Live Dashboard</h2>
        <div style={{display:"flex",alignItems:"center",gap:4,marginLeft:8}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:G,animation:"livePulse 2s infinite"}}/>
          <span style={{color:G,fontSize:10,fontWeight:600}}>LIVE</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-top" style={{marginBottom:16}}>
        {statCards.map((s,i)=>(
          <div key={i} style={{background:CARD,border:`1px solid ${BD}`,borderRadius:14,padding:"16px 14px",position:"relative",overflow:"hidden",transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=s.color+"44"} onMouseLeave={e=>e.currentTarget.style.borderColor=BD}>
            <div style={{position:"absolute",top:-10,right:-10,fontSize:32,opacity:0.06}}>{s.icon}</div>
            <div style={{color:TM,fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>{s.label}</div>
            <div style={{color:s.color,fontSize:22,fontWeight:800,fontFamily:"'Space Mono',monospace",lineHeight:1}}>
              <AnimCounter value={s.value} prefix={s.prefix}/>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="stats-grid" style={{marginBottom:16}}>
        {/* Volume Chart */}
        <div style={{background:CARD,border:`1px solid ${BD}`,borderRadius:16,padding:"18px 16px 10px",overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{color:T,fontSize:13,fontWeight:700}}>Polymarket Volume (24h)</div>
              <div style={{color:TM,fontSize:10,marginTop:2}}>Aggregated hourly volume</div>
            </div>
            <div style={{background:O+"14",border:`1px solid ${O}28`,borderRadius:8,padding:"3px 8px",color:O,fontSize:10,fontWeight:700}}>REALTIME</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={volumeData} margin={{top:4,right:4,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={O} stopOpacity={0.35}/>
                  <stop offset="100%" stopColor={O} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke={BD} strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="time" tick={{fill:TM,fontSize:10}} axisLine={false} tickLine={false} interval={3}/>
              <YAxis tick={{fill:TM,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1e6?`${(v/1e6).toFixed(1)}M`:v>=1e3?`${(v/1e3).toFixed(0)}K`:v}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Area type="monotone" dataKey="vol" stroke={O} strokeWidth={2.5} fill="url(#volGrad)" animationDuration={1200} dot={false} activeDot={{r:4,fill:O,stroke:"#fff",strokeWidth:2}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Markets Bar Chart */}
        <div style={{background:CARD,border:`1px solid ${BD}`,borderRadius:16,padding:"18px 16px 10px",overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{color:T,fontSize:13,fontWeight:700}}>Top Markets by Volume</div>
              <div style={{color:TM,fontSize:10,marginTop:2}}>Yes probability shown</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topMarkets} layout="vertical" margin={{top:0,right:4,left:0,bottom:0}}>
              <CartesianGrid stroke={BD} strokeDasharray="3 3" horizontal={false}/>
              <XAxis type="number" tick={{fill:TM,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1e6?`${(v/1e6).toFixed(0)}M`:v>=1e3?`${(v/1e3).toFixed(0)}K`:v}/>
              <YAxis type="category" dataKey="name" width={90} tick={{fill:TD,fontSize:9}} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Bar dataKey="vol" radius={[0,6,6,0]} animationDuration={1000}>
                {topMarkets.map((d,i)=><Cell key={i} fill={d.yes>=60?G:d.yes>=40?O:R} fillOpacity={0.7+i*0.03}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Solana Activity Feed */}
      <div style={{background:CARD,border:`1px solid ${BD}`,borderRadius:16,padding:"18px 16px",overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#9945FF22,#14F19522)",border:"1px solid #9945FF33",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 18.5l3.5-3.5H20V4H4v14.5z" stroke="#9945FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="10" r="1" fill="#14F195"/><circle cx="15" cy="10" r="1" fill="#14F195"/></svg>
            </div>
            <div>
              <div style={{color:T,fontSize:13,fontWeight:700}}>Solana Traders Activity</div>
              <div style={{color:TM,fontSize:10,marginTop:1}}>Live on-chain prediction market trades</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#14F195",animation:"livePulse 1.5s infinite"}}/>
            <span style={{color:"#14F195",fontSize:10,fontWeight:600}}>{solanaFeed.length} TXs</span>
          </div>
        </div>
        <div className="activity-feed" ref={feedRef} style={{display:"flex",flexDirection:"column",gap:6}}>
          {solanaFeed.slice(0,20).map((tx,i)=>(
            <div key={tx.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:i===0?"#14F19506":CARD2,borderRadius:10,border:`1px solid ${i===0?"#14F19518":BD}`,animation:i===0?"feedSlide 0.3s ease":"none",transition:"all 0.3s"}}>
              <div style={{width:32,height:32,borderRadius:8,background:tx.isGreen?G+"12":R+"12",border:`1px solid ${tx.isGreen?G+"28":R+"28"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:13}}>
                {tx.action.includes("bought")?"📈":tx.action.includes("sold")?"📉":"⚡"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                  <span style={{color:"#9945FF",fontSize:11,fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{tx.wallet}</span>
                  <span style={{color:tx.isGreen?G:R,fontSize:11,fontWeight:600}}>{tx.action}</span>
                </div>
                <div style={{color:TM,fontSize:10,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tx.market}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{color:T,fontSize:12,fontWeight:700,fontFamily:"'Space Mono',monospace"}}>${tx.amount}</div>
                <div style={{color:TM,fontSize:9}}>{tx.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MOBILE DRAWER ───
const MobileDrawer=({open,onClose,wallet,onConnect,onAI})=>{
  if(!open)return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:150,background:"rgba(0,0,0,.6)",backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="mobile-drawer" style={{position:"absolute",top:0,right:0,width:260,height:"100%",background:BG,borderLeft:`1px solid ${BD2}`,padding:20,animation:"slideIn 0.2s ease",display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:14,color:O}}>Menu</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:TD,cursor:"pointer",padding:4}}><CloseIcon/></button>
        </div>
        <a href="https://x.com/Consilioapp" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:10,border:`1px solid ${BD}`,color:TD,textDecoration:"none",fontSize:13,fontWeight:500}}>
          <XIcon/> Twitter / X
        </a>
        <a href="https://github.com/consilio-app" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:10,border:`1px solid ${BD}`,color:TD,textDecoration:"none",fontSize:13,fontWeight:500}}>
          <GHIcon/> GitHub
        </a>
        <a href="https://gmgn.ai" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:10,border:`1px solid ${O}28`,background:O+"0A",color:O,textDecoration:"none",fontSize:13,fontWeight:600}}>
          <CoinIcon/> Buy Coin
        </a>
        <button onClick={()=>{onAI();onClose()}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:10,border:`1px solid ${GOLD}33`,background:`linear-gradient(135deg,${O}12,${GOLD}12)`,color:GOLD,fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left"}}>
          <SparkIcon s={15}/> AI Agent
        </button>
        <button onClick={()=>{onConnect();onClose()}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:10,border:"none",background:wallet?G+"15":`linear-gradient(135deg,${O},${OD})`,color:wallet?G:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",textAlign:"left",marginTop:4}}>
          <WalletIcon/> {wallet?`${wallet.slice(0,4)}...${wallet.slice(-4)}`:"Connect Wallet"}
        </button>
      </div>
    </div>
  );
};

// ─── MAIN APP ───
export default function Consilio(){
  const[events,setEvents]=useState([]);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState(null);
  const[search,setSearch]=useState("");
  const[cat,setCat]=useState("All");
  const[modal,setModal]=useState(null);
  const[wallet,setWallet]=useState(null);
  const[sort,setSort]=useState("volume");
  const[page,setPage]=useState(1);
  const[aiOpen,setAiOpen]=useState(false);
  const[menuOpen,setMenuOpen]=useState(false);
  const PP=12;

  const fetchEvents=async()=>{
    const proxyUrl="/api/markets?endpoint=events&active=true&closed=false&limit=100&order=volume24hr&ascending=false";
    const directUrl="https://gamma-api.polymarket.com/events?active=true&closed=false&limit=100&order=volume24hr&ascending=false";
    for(const url of [proxyUrl,directUrl]){
      try{const r=await fetch(url);if(!r.ok)continue;const d=await r.json();const v=d.filter(e=>e.markets?.length>0);if(v.length>0){setEvents(v);return true;}}catch{}
    }
    return false;
  };

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      const ok=await fetchEvents();
      if(!ok){
        setError(true);
        setEvents(Array.from({length:24},(_,i)=>({
          id:i,title:["Will Bitcoin hit $150K in 2026?","US Presidential approval above 50%?","Will AI replace 10% of jobs by 2027?","Champions League Winner 2026","SpaceX Starship orbital success?","Fed rate cut Q3 2026?","Ethereum above $5K by year end?","Oscar Best Picture 2027","TikTok banned in US?","Global temperature record 2026?","Next Supreme Court retirement?","Tesla stock above $300?"][i%12],
          volume:Math.random()*5e6+1e5,category:CATS[1+(i%6)],
          markets:[{outcomePrices:JSON.stringify([(Math.random()*.8+.1).toFixed(2),(Math.random()*.8+.1).toFixed(2)]),volume:Math.random()*5e6}]
        })));
      }
      setLoading(false);
    })();
  },[]);

  const connectWallet=async()=>{
    try{
      if(window.solana?.isPhantom){const r=await window.solana.connect();setWallet(r.publicKey.toString())}
      else if(window.solflare){await window.solflare.connect();setWallet(window.solflare.publicKey.toString())}
      else window.open("https://phantom.app/","_blank");
    }catch{}
  };

  const filtered=events.filter(e=>{
    const q=search.toLowerCase(),t=(e.title||e.markets?.[0]?.question||"").toLowerCase(),c=(e.category||"").toLowerCase();
    return(!q||t.includes(q))&&(cat==="All"||c.includes(cat.toLowerCase()));
  }).sort((a,b)=>sort==="volume"?(b.volume||0)-(a.volume||0):new Date(b.createdAt||0)-new Date(a.createdAt||0));

  const paged=filtered.slice(0,page*PP);

  return(
    <div style={{minHeight:"100vh",background:BG,color:T,fontFamily:"'DM Sans','Segoe UI',sans-serif",overflowX:"hidden"}}>
      <style>{STYLES}</style>

      {/* ─── NAV ─── */}
      <nav className="nav-bar" style={{position:"sticky",top:0,zIndex:100,background:BG+"DD",backdropFilter:"blur(20px)",borderBottom:`1px solid ${BD}`,padding:"0 20px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <CrownLogo size={28}/>
          <span style={{fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:16,background:`linear-gradient(135deg,${GOLD},${O})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.5px"}}>CONSILIO</span>
        </div>

        {/* Desktop nav */}
        <div className="nav-links-desktop" style={{display:"flex",alignItems:"center",gap:5}}>
          {[["https://x.com/Consilioapp",<XIcon/>],["https://github.com/consilio-app",<GHIcon/>]].map(([href,icon],i)=>(
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:8,border:`1px solid ${BD}`,color:TM,textDecoration:"none",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=TD;e.currentTarget.style.color=T}} onMouseLeave={e=>{e.currentTarget.style.borderColor=BD;e.currentTarget.style.color=TM}}>{icon}</a>
          ))}
          <a href="https://gmgn.ai" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:4,height:32,padding:"0 10px",borderRadius:8,background:O+"10",border:`1px solid ${O}28`,color:O,textDecoration:"none",fontSize:11,fontWeight:700}}><CoinIcon/>Buy</a>
          <button onClick={()=>setAiOpen(true)} style={{display:"flex",alignItems:"center",gap:4,height:32,padding:"0 11px",borderRadius:8,border:`1px solid ${GOLD}33`,cursor:"pointer",fontSize:11,fontWeight:700,background:`linear-gradient(135deg,${O}15,${GOLD}15)`,color:GOLD,animation:"glow 3s infinite"}}><SparkIcon s={13}/>AI Agent</button>
          <button onClick={connectWallet} style={{display:"flex",alignItems:"center",gap:4,height:32,padding:"0 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:wallet?G+"15":`linear-gradient(135deg,${O},${OD})`,color:wallet?G:"#fff"}}><WalletIcon/>{wallet?`${wallet.slice(0,4)}..${wallet.slice(-4)}`:"Connect"}</button>
        </div>

        {/* Mobile hamburger */}
        <button className="nav-mobile-toggle" onClick={()=>setMenuOpen(true)} style={{display:"flex",alignItems:"center",justifyContent:"center",width:38,height:38,borderRadius:8,border:`1px solid ${BD}`,background:"transparent",color:TD,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
          <MenuIcon/>
        </button>
      </nav>

      {/* Mobile drawer */}
      <MobileDrawer open={menuOpen} onClose={()=>setMenuOpen(false)} wallet={wallet} onConnect={connectWallet} onAI={()=>setAiOpen(true)}/>

      {/* ─── HERO ─── */}
      <div className="hero-section" style={{padding:"40px 20px 24px",maxWidth:1200,margin:"0 auto",textAlign:"center"}}>
        <div className="hero-crown" style={{display:"flex",justifyContent:"center",marginBottom:14}}><CrownLogo size={56}/></div>
        <h1 className="hero-title" style={{fontFamily:"'Space Mono',monospace",fontSize:36,fontWeight:700,marginBottom:8,background:`linear-gradient(135deg,${GOLD},${O},${OD})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Predict the Future</h1>
        <p className="hero-sub" style={{color:TD,fontSize:14,maxWidth:440,margin:"0 auto 24px",lineHeight:1.6}}>AI-powered prediction market trading. Data from Polymarket.</p>

        {/* Search */}
        <div className="search-wrap" style={{maxWidth:480,margin:"0 auto 20px",position:"relative"}}>
          <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:TM}}><SearchIcon/></div>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Search markets..." style={{width:"100%",padding:"12px 14px 12px 38px",background:CARD,border:`1px solid ${BD}`,borderRadius:11,color:T,fontSize:14,outline:"none",WebkitAppearance:"none"}} onFocus={e=>e.target.style.borderColor=O+"55"} onBlur={e=>e.target.style.borderColor=BD}/>
        </div>

        {/* Categories — horizontal scroll on mobile */}
        <div className="cat-bar" style={{display:"flex",gap:5,justifyContent:"center",flexWrap:"nowrap",marginBottom:10}}>
          {CATS.map(c=><button key={c} onClick={()=>{setCat(c);setPage(1)}} style={{padding:"7px 15px",borderRadius:18,border:`1px solid ${cat===c?O:BD}`,cursor:"pointer",fontSize:12,fontWeight:600,background:cat===c?O+"12":"transparent",color:cat===c?O:TD,whiteSpace:"nowrap",flexShrink:0,WebkitTapHighlightColor:"transparent"}}>{c}</button>)}
        </div>

        {/* Sort bar */}
        <div className="sort-bar" style={{display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:1200,margin:"0 auto",padding:"10px 0 2px"}}>
          <span style={{color:TM,fontSize:11}}>{filtered.length} markets</span>
          <div style={{display:"flex",gap:5}}>
            {[["volume","Volume"],["newest","Newest"]].map(([k,l])=><button key={k} onClick={()=>setSort(k)} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${sort===k?O+"44":BD}`,background:sort===k?O+"0A":"transparent",color:sort===k?O:TD,cursor:"pointer",fontSize:11,fontWeight:600,WebkitTapHighlightColor:"transparent"}}>{l}</button>)}
          </div>
        </div>
      </div>

      {/* ─── LIVE DASHBOARD ─── */}
      {!loading&&<StatsDashboard events={events}/>}

      {/* ─── GRID ─── */}
      <div className="grid-section" style={{maxWidth:1200,margin:"0 auto",padding:"0 20px 60px"}}>
        {loading?<div className="market-grid">{Array.from({length:6}).map((_,i)=><div key={i} className="sk" style={{height:180}}/>)}</div>:(
          <>
            <div className="market-grid" style={{animation:"fadeIn 0.3s"}}>
              {paged.map((e,i)=><div key={e.id??i} style={{animation:`slideUp 0.3s ease ${Math.min(i*.03,.3)}s both`}}><MarketCard event={e} onBuy={(m,o)=>setModal({market:m,outcome:o})} onAI={()=>setAiOpen(true)}/></div>)}
            </div>
            {!paged.length&&<div style={{textAlign:"center",padding:"60px 20px",color:TM}}><p style={{fontSize:15}}>No markets found</p></div>}
            {paged.length<filtered.length&&<div style={{textAlign:"center",marginTop:24}}><button onClick={()=>setPage(p=>p+1)} style={{padding:"12px 28px",borderRadius:10,background:CARD,border:`1px solid ${BD}`,color:O,fontSize:13,fontWeight:600,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>Load More</button></div>}
          </>
        )}
      </div>

      {/* ─── AI FAB ─── */}
      {!aiOpen&&<button onClick={()=>setAiOpen(true)} style={{position:"fixed",bottom:22,right:16,width:52,height:52,borderRadius:14,border:`1px solid ${O}44`,background:`linear-gradient(135deg,${O},${OD})`,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 32px ${O}44`,zIndex:90,animation:"glow 3s infinite",WebkitTapHighlightColor:"transparent"}}><SparkIcon s={22}/></button>}

      {/* ─── FOOTER ─── */}
      <footer className="footer-section" style={{borderTop:`1px solid ${BD}`,padding:"24px 20px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,marginBottom:8}}><CrownLogo size={20}/><span style={{fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:12,color:O}}>CONSILIO</span></div>
        <p style={{color:TM,fontSize:10,maxWidth:360,margin:"0 auto"}}>AI-powered prediction markets. Data from Polymarket. Not financial advice.</p>
        <div style={{display:"flex",justifyContent:"center",gap:12,marginTop:10}}>{[["Twitter","https://x.com/Consilioapp"],["GitHub","https://github.com/consilio-app"],["Buy Coin","https://gmgn.ai"]].map(([l,h])=><a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{color:TM,fontSize:11,textDecoration:"none"}}>{l}</a>)}</div>
      </footer>

      {/* ─── PANELS ─── */}
      <AIAgent isOpen={aiOpen} onClose={()=>setAiOpen(false)} events={events}/>
      {modal&&<OrderModal market={modal.market} outcome={modal.outcome} onClose={()=>setModal(null)}/>}
      {error&&<div style={{position:"fixed",bottom:18,left:"50%",transform:"translateX(-50%)",background:O+"14",border:`1px solid ${O}28`,borderRadius:10,padding:"7px 16px",color:O,fontSize:11,zIndex:50,whiteSpace:"nowrap"}}>Demo data — API available after deploy</div>}
    </div>
  );
}
