const svg = document.getElementById('flowchart');

function generateFlowchart() {
    svg.innerHTML = `<defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5"/>
      </marker>
    </defs>`;

    const code = document.getElementById('codeInput').value.trim();
    if(!code) return alert("Please enter flowchart code!");

    const lines = code.split('\n').map(l => l.trim()).filter(l => l);
    const nodes = {};
    const edges = [];

    // Step 1: Create nodes
    let id = 0;
    lines.forEach(line => {
        if(line.startsWith('start') || line.startsWith('end') || line.startsWith('process') || line.startsWith('decision')) {
            nodes[line] = { id: id++, text: line.replace(/^(process|decision)\s+/, ''), type: line.startsWith('decision') ? 'diamond' : (line==='start'||line==='end'?'oval':'rect') };
        }
    });

    // Step 2: Create edges
    lines.forEach(line => {
        const match = line.match(/^(yes|no)\s*->\s*(.+)$/i);
        if(match) {
            const fromType = match[1].toLowerCase();
            const toNode = match[2];
            edges.push({ from: lines[lines.indexOf(line)-1], to: toNode, label: fromType });
        }
    });

    // Step 3: Layout & Draw nodes
    const spacingY = 120;
    const spacingX = 200;
    const positions = {};
    let y = 50;

    Object.keys(nodes).forEach((key, index) => {
        positions[key] = { x: 600, y: y };
        y += spacingY;
    });

    Object.keys(nodes).forEach(key => {
        const n = nodes[key];
        const pos = positions[key];
        if(n.type==='oval') createOval(pos.x, pos.y, 120, 50, n.text);
        else if(n.type==='rect') createRect(pos.x, pos.y, 160, 50, n.text);
        else if(n.type==='diamond') createDiamond(pos.x, pos.y, 140, 60, n.text);
    });

    // Step 4: Draw edges
    edges.forEach(e => {
        drawLine(positions[e.from], positions[e.to], e.label);
    });
}

// Node creators
function createRect(x,y,w,h,text){ drawNode('rect',x,y,w,h,text); }
function createOval(x,y,w,h,text){ drawNode('oval',x,y,w,h,text); }
function createDiamond(x,y,w,h,text){ drawNode('diamond',x,y,w,h,text); }

function drawNode(type,x,y,w,h,text){
    const g = document.createElementNS("http://www.w3.org/2000/svg","g"); g.classList.add('node');
    let el;
    if(type==='rect'){ el=document.createElementNS("http://www.w3.org/2000/svg","rect"); el.setAttribute('x',x-w/2); el.setAttribute('y',y); el.setAttribute('width',w); el.setAttribute('height',h); el.setAttribute('rx',8); el.setAttribute('ry',8);}
    if(type==='oval'){ el=document.createElementNS("http://www.w3.org/2000/svg","ellipse"); el.setAttribute('cx',x); el.setAttribute('cy',y+h/2); el.setAttribute('rx',w/2); el.setAttribute('ry',h/2);}
    if(type==='diamond'){ el=document.createElementNS("http://www.w3.org/2000/svg","polygon"); el.setAttribute('points',`${x},${y+h/2} ${x+w/2},${y} ${x+w},${y+h/2} ${x+w/2},${y+h}`);}
    g.appendChild(el);
    const t = document.createElementNS("http://www.w3.org/2000/svg","text"); t.setAttribute('x',x); t.setAttribute('y',y+h/2); t.textContent=text; g.appendChild(t);
    svg.appendChild(g);
}

function drawLine(from,to,label){
    const line = document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute('x1', from.x); line.setAttribute('y1', from.y+25);
    line.setAttribute('x2', to.x); line.setAttribute('y2', to.y+25);
    line.classList.add('line'); svg.appendChild(line);
    if(label){
        const t = document.createElementNS("http://www.w3.org/2000/svg","text");
        t.setAttribute('x',(from.x+to.x)/2); t.setAttribute('y',(from.y+to.y)/2 -5); t.textContent=label; t.setAttribute('fill','black'); t.setAttribute('font-size','12'); svg.appendChild(t);
    }
}
