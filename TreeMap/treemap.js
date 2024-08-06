document.addEventListener('DOMContentLoaded', () => {
    class Empresa {
        constructor(nome, valor2023, valor2024) {
            this.nome = nome;
            this.valor2023 = valor2023;
            this.valor2024 = valor2024;
        }

        getDesempenho() {
            return this.valor2024;
        }

        getMudancaPercentual() {
            return (this.valor2024 - this.valor2023) / (this.valor2023 || 1);
        }
    }

    class Treemap {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            this.empresas = [];
        }

        adicionarEmpresa(empresa) {
            this.empresas.push(empresa);
            this.render();
        }

        calcularCor(mudancaPercentual) {
            // Define o intervalo para a mudança percentual
            const maxMudanca = Math.max(...this.empresas.map(e => e.getMudancaPercentual()), 0);
            const minMudanca = Math.min(...this.empresas.map(e => e.getMudancaPercentual()), 0);

            // Normaliza a mudança percentual para o intervalo [0, 1]
            const normalizado = (mudancaPercentual - minMudanca) / (maxMudanca - minMudanca || 1);

            // Calcula a intensidade da cor verde e vermelha
            const red = Math.floor((1 - normalizado) * 255);
            const green = Math.floor(normalizado * 255);

            return `rgb(${red}, ${green}, 0)`;
        }

        render() {
            const data = this.empresas.map(e => ({
                name: e.nome,
                value: e.getDesempenho(),
                color: this.calcularCor(e.getMudancaPercentual())
            }));

            const root = d3.hierarchy({ children: data })
                .sum(d => d.value);

            d3.treemap()
                .size([this.container.clientWidth, this.container.clientHeight])
                .padding(1)
                (root);

            const nodes = d3.select(this.container)
                .selectAll('.node')
                .data(root.leaves(), d => d.data.name);

            nodes.exit().remove();

            const nodeEnter = nodes.enter().append('div')
                .attr('class', 'node')
                .style('position', 'absolute')
                .style('border', '1px solid #000')
                .style('box-sizing', 'border-box')
                .style('text-align', 'center')
                .style('line-height', '1.2')
                .style('font-size', '12px')
                .style('overflow', 'hidden')
                .style('background-color', d => d.data.color)
                .text(d => d.data.name);

            nodes.merge(nodeEnter)
                .style('left', d => `${d.x0}px`)
                .style('top', d => `${d.y0}px`)
                .style('width', d => `${d.x1 - d.x0}px`)
                .style('height', d => `${d.y1 - d.y0}px`);
        }
    }

    const form = document.getElementById('dataForm');
    const treemap = new Treemap('treemap');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('empresa').value;
        const valor2023 = parseFloat(document.getElementById('valor2023').value);
        const valor2024 = parseFloat(document.getElementById('valor2024').value);

        const empresa = new Empresa(nome, valor2023, valor2024);
        treemap.adicionarEmpresa(empresa);

        form.reset();
    });
});
