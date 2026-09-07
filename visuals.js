let animId = null;

window.stopVisuals = function() {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
};

window.startVisual = function(type, canvas, box) {
    window.stopVisuals();
    canvas.width = box.clientWidth;
    canvas.height = box.clientHeight;
    const ctx = canvas.getContext('2d');

    if (type === "tesseract") {
        const vertices = [];
        for (let i = 0; i < 16; i++) vertices.push([(i&1)?1:-1, (i&2)?1:-1, (i&4)?1:-1, (i&8)?1:-1]);
        const edges = [];
        for (let i = 0; i < 16; i++) {
            for (let j = i + 1; j < 16; j++) {
                let d = 0; for (let k = 0; k < 4; k++) if (vertices[i][k] !== vertices[j][k]) d++;
                if (d === 1) edges.push([i, j]);
            }
        }
        let aXW = 0, aYW = 0;
        function render() {
            ctx.fillStyle = '#060606'; ctx.fillRect(0,0,canvas.width,canvas.height);
            aXW += 0.006; aYW += 0.004;
            const proj = vertices.map(v => {
                let p = [v[0]*Math.cos(aXW)-v[3]*Math.sin(aXW), v[1], v[2], v[0]*Math.sin(aXW)+v[3]*Math.cos(aXW)];
                p = [p[0], p[1]*Math.cos(aYW)-p[3]*Math.sin(aYW), p[2], p[1]*Math.sin(aYW)+p[3]*Math.cos(aYW)];
                const w = 1 / (2.6 - p[3]), p3 = [p[0]*w, p[1]*w, p[2]*w], z = 1 / (3.0 - p3[2]);
                const sc = canvas.height * 0.42;
                return [p3[0]*z*sc + canvas.width/2, p3[1]*z*sc + canvas.height/2];
            });
            ctx.strokeStyle = 'rgba(189, 147, 249, 0.7)'; ctx.lineWidth = 1.2;
            edges.forEach(([i, j]) => {
                ctx.beginPath(); ctx.moveTo(proj[i][0], proj[i][1]); ctx.lineTo(proj[j][0], proj[j][1]); ctx.stroke();
            });
            animId = requestAnimationFrame(render);
        }
        render();
    }
    else if (type === "blackhole") {
        const cx = canvas.width / 2, cy = canvas.height / 2, eh = 28;
        const parts = [];
        for (let i = 0; i < 200; i++) parts.push({ r: Math.random()*(canvas.width*0.45-eh)+eh, a: Math.random()*Math.PI*2, s: Math.random()*0.02+0.015, sz: Math.random()*2+1, h: Math.random()*40+5 });
        function render() {
            ctx.fillStyle = 'rgba(6, 6, 6, 0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
            parts.forEach(p => {
                p.a += p.s * (120/p.r); p.r -= 0.35;
                if(p.r <= eh) { p.r = canvas.width*0.45; p.a = Math.random()*Math.PI*2; }
                const x = cx + Math.cos(p.a)*p.r, y = cy + Math.sin(p.a)*(p.r*0.38);
                ctx.fillStyle = `hsl(${p.h}, 100%, 60%)`;
                ctx.beginPath(); ctx.arc(x, y, p.sz, 0, Math.PI*2); ctx.fill();
            });
            const g = ctx.createRadialGradient(cx, cy, eh*0.8, cx, cy, eh*2.2);
            g.addColorStop(0, 'rgba(255,60,0,0.9)'); g.addColorStop(0.5, 'rgba(255,0,80,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, eh*2.2, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(cx, cy, eh, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#ff3366'; ctx.lineWidth = 1.2; ctx.stroke();
            animId = requestAnimationFrame(render);
        }
        render();
    }
    else if (type === "quantum") {
        const cx = canvas.width / 2, cy = canvas.height / 2, R = canvas.height * 0.38;
        let ang = 0;
        function render() {
            ctx.fillStyle = 'rgba(6, 6, 6, 0.25)'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ang += 0.02;
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2); ctx.stroke();
            ctx.beginPath(); ctx.ellipse(cx, cy, R, R*0.35, 0, 0, Math.PI*2); ctx.stroke();
            const vx = cx + Math.sin(ang) * Math.cos(ang*0.7) * R;
            const vy = cy - Math.cos(ang*0.7) * R;
            ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(vx, vy); ctx.stroke();
            ctx.fillStyle = '#ff79c6';
            ctx.beginPath(); ctx.arc(vx, vy, 4, 0, Math.PI*2); ctx.fill();
            animId = requestAnimationFrame(render);
        }
        render();
    }
    else if (type === "hyperbolic") {
        const cx = canvas.width / 2, cy = canvas.height / 2, R = canvas.height * 0.42;
        let t = 0;
        function render() {
            ctx.fillStyle = 'rgba(6, 6, 6, 0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
            t += 0.015;
            ctx.strokeStyle = '#bd93f9'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2); ctx.stroke();
            for (let i = 0; i < 8; i++) {
                const angle = t + (i * Math.PI / 4);
                const rInner = R * Math.abs(Math.sin(t*0.5 + i));
                ctx.strokeStyle = `hsla(${260 + i*15}, 80%, 65%, 0.4)`;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.arc(cx + Math.cos(angle)*rInner*0.5, cy + Math.sin(angle)*rInner*0.5, R - rInner*0.5, 0, Math.PI*2);
                ctx.stroke();
            }
            animId = requestAnimationFrame(render);
        }
        render();
    }
    else if (type === "turing") {
        const cols = 40, rows = 20, cellW = canvas.width / cols, cellH = canvas.height / rows;
        let grid = Array.from({length: rows}, () => Array.from({length: cols}, () => Math.random() > 0.85 ? 1 : 0));
        let frame = 0;
        function render() {
            frame++;
            if (frame % 4 === 0) {
                let next = grid.map(arr => [...arr]);
                for(let r=0; r<rows; r++) {
                    for(let c=0; c<cols; c++) {
                        let n = 0;
                        for(let i=-1; i<=1; i++) for(let j=-1; j<=1; j++) {
                            if(i===0 && j===0) continue;
                            n += grid[(r+i+rows)%rows][(c+j+cols)%cols];
                        }
                        if(grid[r][c] === 1 && (n < 2 || n > 3)) next[r][c] = 0;
                        else if(grid[r][c] === 0 && n === 3) next[r][c] = 1;
                    }
                }
                grid = next;
            }
            ctx.fillStyle = '#060606'; ctx.fillRect(0,0,canvas.width,canvas.height);
            for(let r=0; r<rows; r++) {
                for(let c=0; c<cols; c++) {
                    if(grid[r][c]) {
                        ctx.fillStyle = '#ffb86c';
                        ctx.fillRect(c*cellW + 1, r*cellH + 1, cellW - 2, cellH - 2);
                    }
                }
            }
            animId = requestAnimationFrame(render);
        }
        render();
    }
};
