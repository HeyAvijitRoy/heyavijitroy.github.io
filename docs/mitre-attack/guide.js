    const steps=[
      {name:'Identify the goal',id:'TA0001 · Initial Access',title:'Why is the adversary doing this?',body:'The adversary is trying to get into the organization. In Enterprise ATT&CK, that goal is the Initial Access tactic.',hint:'On the tactic page, scan its list of techniques. A tactic is a goal, not a chronological stage that every intrusion must follow.',url:'https://attack.mitre.org/tactics/TA0001/',cta:'Open Initial Access'},
      {name:'Name the behavior',id:'T1566 · Phishing',title:'How might they gain access?',body:'They send a phishing message to a victim. Phishing is a technique under Initial Access. Its page lists narrower variants.',hint:'Read the description and the Tactic field. If the message only seeks information for targeting, compare T1598 instead.',url:'https://attack.mitre.org/techniques/T1566/',cta:'Open Phishing'},
      {name:'Choose the specific variant',id:'T1566.002 · Spearphishing Link',title:'What makes this example specific?',body:'The targeted message contains a link. T1566.002 is a subtechnique of T1566. The decimal suffix identifies a specific variant, not an attack sequence.',hint:'Open the subtechnique page; confirm its parent, tactic, description, and platforms before mapping a real event.',url:'https://attack.mitre.org/techniques/T1566/002/',cta:'Open Spearphishing Link'},
      {name:'Read observed examples',id:'Procedure Examples',title:'Who has reportedly used it, and how?',body:'Scroll to Procedure Examples on T1566.002. Those rows describe reported use by groups or software and link to references. They illustrate implementations, not requirements for every case.',hint:'Use a cited procedure to understand a concrete case. Do not infer that seeing the technique identifies the actor.',url:'https://attack.mitre.org/techniques/T1566/002/',cta:'View procedure examples'},
      {name:'Connect to defense',id:'DET0107 · Detection Strategy',title:'What could reveal the behavior?',body:'The Detection Strategy section for T1566.002 links to DET0107 and related analytics. One analytic correlates an inbound email link with navigation and subsequent suspicious activity.',hint:'Distinguish detection from mitigation: a detection describes what to observe; a mitigation aims to reduce the chance or impact.',url:'https://attack.mitre.org/techniques/T1566/002/',cta:'View detection strategy'}
    ];
    const mapItems=[
      {name:'Title & metadata',title:'Confirm you are on the right entry',body:'Check the ID, parent technique, tactic, description, and applicable platforms. For T1566.002, the parent is T1566 and the tactic is Initial Access.',url:'https://attack.mitre.org/techniques/T1566/002/'},
      {name:'Procedure Examples',title:'See reported use in context',body:'Rows show a group or software, an account of how it used the behavior, and citations. These are examples of real-world use; a row is not proof that the same actor caused your event.',url:'https://attack.mitre.org/techniques/T1566/002/'},
      {name:'Mitigations',title:'Look for ways to reduce exposure',body:'Mitigation entries describe defensive concepts such as restricting content or training users. A mitigation is distinct from a detection signal.',url:'https://attack.mitre.org/techniques/T1566/002/'},
      {name:'Detection Strategy',title:'Move from behavior to observable signals',body:'This section lists strategy DET0107 and analytic IDs. Read the analytic descriptions, then follow the linked strategy or analytic for more detail. ATT&CK lists detection ideas; you still need to validate them in your environment.',url:'https://attack.mitre.org/techniques/T1566/002/'},
      {name:'References & version',title:'Verify source and currency',body:'References support claims on the page. Check Last Modified and the Version Permalink when recording an analysis that must stay reproducible.',url:'https://attack.mitre.org/techniques/T1566/002/'}
    ];
    const questions=[
      {q:'An adversary wants an initial foothold and sends a targeted email containing a malicious link. Which entry is the most specific match?',options:['TA0001 · Initial Access','T1566 · Phishing','T1566.002 · Spearphishing Link'],correct:2,why:'The goal is Initial Access, the broader behavior is Phishing, and the link makes T1566.002 the most specific listed variant.',url:'https://attack.mitre.org/techniques/T1566/002/'},
      {q:'A user reports “a phishing email” but deleted it. Nobody knows whether it had a link or an attachment. What is the most defensible mapping?',options:['T1566.001 · Spearphishing Attachment','T1566 · Phishing','T1566.002 · Spearphishing Link'],correct:1,why:'Map only as specific as the evidence allows. Without knowing the delivery method, the parent technique is accurate; either subtechnique would be a guess.',url:'https://attack.mitre.org/techniques/T1566/'},
      {q:'Malware creates a scheduled task so it starts again every time the computer reboots. Which tactic best describes this goal?',options:['TA0002 · Execution','TA0003 · Persistence','TA0004 · Privilege Escalation'],correct:1,why:'Surviving a reboot is about keeping a foothold, which is Persistence. T1053, Scheduled Task/Job, is listed under all three tactics, so the goal in your evidence decides which one applies.',url:'https://attack.mitre.org/techniques/T1053/005/'},
      {q:'Where on a technique page would you look for a cited account of a group using this behavior?',options:['Procedure Examples','Platforms','Mitigations'],correct:0,why:'Procedure Examples records reported implementations and links to supporting references.',url:'https://attack.mitre.org/techniques/T1566/002/'},
      {q:'Your organization saw a spearphishing link. The T1566.002 page lists a well-known group under Procedure Examples. What can you conclude?',options:['That group is behind the email','The behavior matches T1566.002; attribution needs separate evidence','The mapping is wrong unless that group is involved'],correct:1,why:'Many unrelated actors use the same technique. Procedure examples show how a technique has been used; they are not a list of suspects.',url:'https://attack.mitre.org/techniques/T1566/002/'},
      {q:'Your manager asks what the organization could do to reduce the chance that staff open malicious links. Which section should you read?',options:['Detection Strategy','Mitigations','Procedure Examples'],correct:1,why:'Mitigations describe ways to prevent a technique or limit its impact (for example M1017, User Training). A detection strategy describes how to notice it.',url:'https://attack.mitre.org/techniques/T1566/002/'},
      {q:'You need ideas for observable signals after a phishing link is clicked. Which section should you inspect?',options:['Contributors','Detection Strategy','Version Permalink'],correct:1,why:'Detection Strategy links to DET0107 and analytics describing signals and correlations. Check the linked entries for detail.',url:'https://attack.mitre.org/techniques/T1566/002/'}
    ];
    const $=s=>document.querySelector(s);
    const viewIds=['walkthrough','anatomy','navigate','lookup','practice'];
    document.documentElement.classList.add('enhanced');
    function showView(id,moveFocus=false){
      const selected=viewIds.includes(id)?id:'walkthrough';
      document.querySelectorAll('.navbtn').forEach(link=>{
        const active=link.dataset.view===selected;
        link.classList.toggle('active',active);
        if(active)link.setAttribute('aria-current','step');
        else link.removeAttribute('aria-current');
      });
      document.querySelectorAll('.view').forEach(view=>view.classList.toggle('active',view.id===selected));
      if(moveFocus){
        const heading=document.querySelector(`#${selected} h2`);
        heading.setAttribute('tabindex','-1');
        heading.focus({preventScroll:true});
        document.querySelector('.panel').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
      }
    }
    function bindViewLink(link){link.addEventListener('click',event=>{
      const id=link.getAttribute('href').slice(1);
      if(!viewIds.includes(id))return;
      event.preventDefault();
      if(location.hash!==`#${id}`)history.pushState(null,'',`#${id}`);
      showView(id,true);
    });}
    document.querySelectorAll('a[href^="#"]').forEach(bindViewLink);
    window.addEventListener('popstate',()=>showView(location.hash.slice(1)));
    window.addEventListener('hashchange',()=>showView(location.hash.slice(1)));
    // Buttons are rendered once and only restyled, so keyboard focus stays on the pressed button.
    function showStep(n,focus=false){const s=steps[n];document.querySelectorAll('[data-step]').forEach((b,i)=>{b.classList.toggle('active',i===n);b.setAttribute('aria-pressed',i===n)});$('#step-detail').innerHTML=`<div class="id">${s.id}</div><h3 tabindex="-1">${s.title}</h3><p>${s.body}</p><p class="hint"><strong>What to check:</strong> ${s.hint}</p><div class="detail-actions"><a class="action" href="${s.url}" target="_blank" rel="noopener noreferrer">${s.cta} ↗</a>${n<steps.length-1?'<button type="button" class="secondary" id="next-step">Next step →</button>':''}</div>`;document.querySelectorAll('.path span').forEach((el,i)=>el.classList.toggle('current',i===Math.min(n,3)));const next=$('#next-step');if(next)next.addEventListener('click',()=>showStep(n+1,true));if(focus)$('#step-detail h3').focus();}
    $('#steps').innerHTML=steps.map((s,i)=>`<button type="button" class="stepbtn" data-step="${i}" aria-pressed="false"><span class="stepnum">${i+1}</span><strong>${s.name}</strong></button>`).join('');
    document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>showStep(+b.dataset.step)));
    function showMap(n){const s=mapItems[n];document.querySelectorAll('[data-map]').forEach((b,i)=>{b.classList.toggle('active',i===n);b.setAttribute('aria-pressed',i===n)});$('#map-detail').innerHTML=`<div class="kicker">On the MITRE page</div><h3>${s.title}</h3><p>${s.body}</p><a class="secondary" href="${s.url}" target="_blank" rel="noopener noreferrer">Inspect official page ↗</a>`;}
    $('#map-nav').innerHTML=mapItems.map((s,i)=>`<button type="button" class="mapbtn" data-map="${i}" aria-pressed="false">${s.name}</button>`).join('');
    document.querySelectorAll('[data-map]').forEach(b=>b.addEventListener('click',()=>showMap(+b.dataset.map)));
    const known={'TA0001':'Initial Access · tactic','T1566':'Phishing · technique','T1566.002':'Spearphishing Link · subtechnique','M1017':'User Training · mitigation','G0016':'APT29 · group','S0154':'Cobalt Strike · software'};
    const idTypes=[
      {re:/^TA\d{4}$/,kind:'tactic',path:id=>`tactics/${id}/`},
      {re:/^T\d{4}$/,kind:'technique',path:id=>`techniques/${id}/`},
      {re:/^T\d{4}\.\d{3}$/,kind:'subtechnique',path:id=>`techniques/${id.replace('.','/')}/`},
      {re:/^M\d{4}$/,kind:'mitigation',path:id=>`mitigations/${id}/`},
      {re:/^G\d{4}$/,kind:'group',path:id=>`groups/${id}/`},
      {re:/^S\d{4}$/,kind:'software',path:id=>`software/${id}/`},
      {re:/^C\d{4}$/,kind:'campaign',path:id=>`campaigns/${id}/`}
    ];
    // Accept common variants such as "t1566/002", "T1566 002", or a pasted ATT&CK URL.
    function normalizeId(raw){return raw.trim().toUpperCase().replace(/\/+$/,'').replace(/^.*\/(TACTICS|TECHNIQUES|MITIGATIONS|GROUPS|SOFTWARE|CAMPAIGNS)\//,'').replace(/^(T\d{4})[\s\/._-]+(\d{3})$/,'$1.$2');}
    function findId(raw){const id=normalizeId(raw);const out=$('#lookup-result');const type=idTypes.find(t=>t.re.test(id));if(!type){out.classList.add('error');out.innerHTML='<p>Use an ATT&CK ID such as TA0001, T1566, T1566.002, M1017, G0016, or S0154. For detection strategies (DET…) and analytics (AN…), follow the links on a technique page or use MITRE’s own search.</p>';return;}const url=`https://attack.mitre.org/${type.path(id)}`;out.classList.remove('error');out.innerHTML=`<p><strong>${id}</strong> · ${known[id]||type.kind}. ${known[id]?'':'The link pattern is valid, but this entry has not been checked here. Confirm it exists on MITRE.'}</p><a class="action" href="${url}" target="_blank" rel="noopener noreferrer">Open on MITRE ATT&CK ↗</a>`;}
    $('#lookup-form').addEventListener('submit',e=>{e.preventDefault();findId($('#id-input').value)});document.querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',()=>{$('#id-input').value=b.dataset.id;findId(b.dataset.id)}));
    const copyBtn=$('#copy-template');
    if(navigator.clipboard&&copyBtn){copyBtn.hidden=false;copyBtn.addEventListener('click',()=>navigator.clipboard.writeText($('#mapping-template').textContent).then(()=>{$('#copy-status').textContent='Copied. Paste it into your notes and fill in each line.'},()=>{$('#copy-status').textContent='Copy failed. Select the text above and copy it manually.'}));}
    let qIndex=0,score=0,answered=false,finished=false;
    function setProgress(){$('#progress').textContent=finished?`Finished · ${score} of ${questions.length} correct`:`Question ${qIndex+1} of ${questions.length} · ${score} correct so far`;}
    function focusQuestion(){$('#question').setAttribute('tabindex','-1');$('#question').focus();}
    function renderQ(focus=false){answered=false;finished=false;const q=questions[qIndex];setProgress();$('#question').textContent=q.q;$('#options').hidden=false;$('#options').innerHTML=q.options.map((o,i)=>`<button type="button" class="option" data-answer="${i}">${o}</button>`).join('');$('#feedback').innerHTML='';$('#next').hidden=true;document.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>answer(+b.dataset.answer)));if(focus)focusQuestion();}
    function answer(i){if(answered)return;answered=true;const q=questions[qIndex];const right=i===q.correct;if(right)score++;document.querySelectorAll('[data-answer]').forEach((b,n)=>{b.disabled=true;b.classList.toggle('correct',n===q.correct);b.classList.toggle('wrong',n===i&&!right)});setProgress();$('#feedback').innerHTML=`<div class="feedback ${right?'':'wrong'}">${right?'Correct.':`Not quite. The answer is <strong>${q.options[q.correct]}</strong>.`} ${q.why} <a href="${q.url}" target="_blank" rel="noopener noreferrer">Verify on MITRE ↗</a></div>`;$('#next').hidden=false;$('#next').textContent=qIndex===questions.length-1?'See your result':'Next question';$('#next').focus();}
    function renderSummary(){finished=true;const all=score===questions.length;setProgress();$('#question').textContent=all?'You mapped every case correctly.':`You answered ${score} of ${questions.length} correctly.`;$('#options').hidden=true;$('#options').innerHTML='';$('#feedback').innerHTML=`<div class="feedback ${all?'':'wrong'}">${all?'Next, try a real report: choose one behavior from a public incident write-up and fill in the mapping template.':'Review <a href="#anatomy">how to read a page</a> and the <a href="#navigate">tactic cheat sheet</a>, then try again. Remember: map only as specific as the evidence allows.'}</div>`;$('#feedback').querySelectorAll('a[href^="#"]').forEach(bindViewLink);$('#next').textContent='Start again';$('#next').hidden=false;focusQuestion();}
    $('#next').addEventListener('click',()=>{if(finished){qIndex=0;score=0;renderQ(true);}else if(qIndex===questions.length-1){renderSummary();}else{qIndex++;renderQ(true);}});
    showStep(0);showMap(0);renderQ();showView(location.hash.slice(1));
