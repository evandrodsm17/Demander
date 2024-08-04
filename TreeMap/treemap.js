class Goleador {
    constructor(name, gols2022, gols2023) {
        this.name = name;
        this.gols2022 = gols2022;
        this.gols2023 = gols2023;
    }

    getGols2023() {
        return this.gols2023;
    }

    getColor() {
        if (this.gols2023 > this.gols2022) {
            return '#00FF00'; // Verde (melhorou)
        } else if (this.gols2023 < this.gols2022) {
            return '#FF0000'; // Vermelho (piorou)
        } else {
            return '#0000FF'; // Azul (neutro)
        }
    }
}

class Treemap {
    constructor(containerId) {
        this.goleadores = [];
        this.container = document.getElementById(containerId);
        this.totalGols = 0;
    }

    addGoleador(goleador) {
        this.goleadores.push(goleador);
        this.totalGols += goleador.getGols2023();
        this.render();
    }

    render() {
        this.container.innerHTML = ''; // Limpa o container

        if (this.totalGols === 0) return;

        const { offsetWidth: width, offsetHeight: height } = this.container;
        const totalArea = width * height;
        const sortedGoleadores = this.goleadores.sort((a, b) => b.getGols2023() - a.getGols2023());
        const areas = sortedGoleadores.map(goleador => ({
            goleador,
            area: (goleador.getGols2023() / this.totalGols) * totalArea
        }));

        const rects = this.squarify(areas, width, height);
        
        rects.forEach(({ goleador, x, y, w, h }) => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.style.left = `${x}px`;
            tile.style.top = `${y}px`;
            tile.style.width = `${w}px`;
            tile.style.height = `${h}px`;
            tile.style.backgroundColor = goleador.getColor();
            tile.innerText = `${goleador.name}\n(${goleador.getGols2023()} gols)`;

            this.container.appendChild(tile);
        });

        const totalTile = document.createElement('div');
        totalTile.className = 'tile';
        totalTile.style.left = '0';
        totalTile.style.bottom = '0';
        totalTile.style.width = '100%';
        totalTile.style.height = '20px';
        totalTile.style.backgroundColor = '#FFFFFF';
        totalTile.innerText = `TOTAL: ${this.totalGols} gols`;
        this.container.appendChild(totalTile);
    }

    squarify(areas, width, height) {
        let row = [];
        let rects = [];
        let x = 0;
        let y = 0;
        let w = width;
        let h = height;

        while (areas.length > 0) {
            let area = areas[0].area;
            let rect = this.layout(row, area, x, y, w, h);
            let newRatio = this.worst(row, w, h);
            let newRow = row.slice();
            newRow.push(areas[0]);

            if (rect === null || this.worst(newRow, w, h) < newRatio) {
                rects = rects.concat(row.map(r => ({
                    goleador: r.goleador,
                    x: r.x,
                    y: r.y,
                    w: r.w,
                    h: r.h
                })));
                row = [];
                x = rect ? rect.x : x;
                y = rect ? rect.y : y;
                w = rect ? rect.w : w;
                h = rect ? rect.h : h;
            } else {
                areas.shift();
                row.push(rect);
            }
        }

        return rects.concat(row.map(r => ({
            goleador: r.goleador,
            x: r.x,
            y: r.y,
            w: r.w,
            h: r.h
        })));
    }

    layout(row, area, x, y, w, h) {
        if (w >= h) {
            let width = area / h;
            return {
                x: x + width,
                y: y,
                w: width,
                h: h
            };
        } else {
            let height = area / w;
            return {
                x: x,
                y: y + height,
                w: w,
                h: height
            };
        }
    }

    worst(row, w, h) {
        if (row.length === 0) return 1;
        let areas = row.map(r => r.area);
        let min = Math.min.apply(Math, areas);
        let max = Math.max.apply(Math, areas);
        let s = areas.reduce((a, b) => a + b, 0);
        let squarified = Math.max((w * w * max) / (s * s), (h * h * max) / (s * s)) / (Math.min((w * w * min) / (s * s), (h * h * min) / (s * s)));
        return squarified;
    }
}

document.getElementById('goleador-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('goleador-name').value.trim();
    const gols2022 = parseInt(document.getElementById('gols2022').value);
    const gols2023 = parseInt(document.getElementById('gols2023').value);

    const goleador = new Goleador(name, gols2022, gols2023);
    treemap.addGoleador(goleador);

    document.getElementById('goleador-form').reset();
});

const treemap = new Treemap('treemap');
