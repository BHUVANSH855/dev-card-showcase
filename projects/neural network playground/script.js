
class Matrix {
    constructor(r, c) {
        this.rows = r;
        this.cols = c;
        this.data = Array.from({length: r}, () =>
            Array.from({length: c}, () => Math.random() * 2 - 1)
        );
    }

    static multiply(a, b) {
        let m = new Matrix(a.rows, b.cols);
        for (let i = 0; i < m.rows; i++)
            for (let j = 0; j < m.cols; j++)
                for (let k = 0; k < a.cols; k++)
                    m.data[i][j] += a.data[i][k] * b.data[k][j];
        return m;
    }

    static map(m, fn) {
        let r = new Matrix(m.rows, m.cols);
        for (let i = 0; i < m.rows; i++)
            for (let j = 0; j < m.cols; j++)
                r.data[i][j] = fn(m.data[i][j]);
        return r;
    }

    static transpose(m) {
        let r = new Matrix(m.cols, m.rows);
        for (let i = 0; i < m.rows; i++)
            for (let j = 0; j < m.cols; j++)
                r.data[j][i] = m.data[i][j];
        return r;
    }

    add(n) {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] += n.data[i][j];
    }
}

/* =========================
   ACTIVATION
========================= */
const sigmoid = x => 1 / (1 + Math.exp(-x));
const dsigmoid = y => y * (1 - y);

/* =========================
   NEURAL NETWORK
========================= */
class NeuralNetwork {
    constructor(input, hidden, output) {
        this.w1 = new Matrix(hidden, input);
        this.w2 = new Matrix(output, hidden);
        this.b1 = new Matrix(hidden, 1);
        this.b2 = new Matrix(output, 1);
        this.lr = 0.1;
    }

    predict(x, y) {
        let input = new Matrix(2,1);
        input.data = [[x],[y]];

        let h = Matrix.multiply(this.w1, input);
        h.add(this.b1);
        h = Matrix.map(h, sigmoid);

        let o = Matrix.multiply(this.w2, h);
        o.add(this.b2);
        o = Matrix.map(o, sigmoid);

        return o.data[0][0];
    }

    train(x, y, label) {
        let input = new Matrix(2,1);
        input.data = [[x],[y]];

        let h = Matrix.multiply(this.w1, input);
        h.add(this.b1);
        h = Matrix.map(h, sigmoid);

        let o = Matrix.multiply(this.w2, h);
        o.add(this.b2);
        o = Matrix.map(o, sigmoid);

        let target = new Matrix(1,1);
        target.data = [[label]];

        let error = new Matrix(1,1);
        error.data[0][0] = target.data[0][0] - o.data[0][0];

        let gradient = Matrix.map(o, dsigmoid);
        gradient.data[0][0] *= error.data[0][0] * this.lr;

        let hT = Matrix.transpose(h);
        let deltaW2 = Matrix.multiply(gradient, hT);
        this.w2.add(deltaW2);
        this.b2.add(gradient);

        let w2T = Matrix.transpose(this.w2);
        let hiddenError = Matrix.multiply(w2T, error);

        let hiddenGradient = Matrix.map(h, dsigmoid);
        for (let i = 0; i < hiddenGradient.rows; i++)
            hiddenGradient.data[i][0] *= hiddenError.data[i][0] * this.lr;

        let inputT = Matrix.transpose(input);
        let deltaW1 = Matrix.multiply(hiddenGradient, inputT);
        this.w1.add(deltaW1);
        this.b1.add(hiddenGradient);
    }
}

/* =========================
   VISUALIZATION
========================= */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let points = [];
let nn;

function reset() {
    points = [];
    nn = new NeuralNetwork(
        2,
        document.getElementById("hidden").value,
        1
    );
}

canvas.addEventListener("click", e => {
    const x = e.offsetX / canvas.width;
    const y = e.offsetY / canvas.height;
    const label = e.shiftKey ? 1 : 0;
    points.push({x, y, label});
});

function draw() {
    for (let x = 0; x < canvas.width; x += 5) {
        for (let y = 0; y < canvas.height; y += 5) {
            let p = nn.predict(x / canvas.width, y / canvas.height);
            ctx.fillStyle = `rgba(56,189,248,${p})`;
            ctx.fillRect(x, y, 5, 5);
        }
    }

    points.forEach(p => {
        ctx.fillStyle = p.label ? "#ef4444" : "#3b82f6";
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 5, 0, Math.PI * 2);
        ctx.fill();

        nn.lr = document.getElementById("lr").value;
        nn.train(p.x, p.y, p.label);
    });

    requestAnimationFrame(draw);
}

reset();
draw();