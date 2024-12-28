let width = 0;
let height = 0;
let ctx = 0;

window.onload = init;
window.onresize = init;
let drawId = -1;

// plotting bounds
const bounds = [[-0.8, 0.8], [-2.9, 2.9], [-3, 3]];

// projection matrix
let viewVert = 0.2;
let viewHoriz = 0.5;
let projection = calc_projection_matrix(viewVert, viewHoriz);

// calculate projection matrix (a about vertical, b about horizontal)
function calc_projection_matrix(a, b) {
    return [[Math.cos(b), 0, -Math.sin(b)],
            [Math.sin(a)*Math.sin(b), -Math.cos(a), Math.sin(a)*Math.cos(b)]];
}

// renormalize point from bounds to [-1, 1]
function norm_pt(pt) {
    return [2.0*(pt[0]-bounds[0][0]) / (bounds[0][1] - bounds[0][0]) - 1,
            2.0*(pt[1]-bounds[1][0]) / (bounds[1][1] - bounds[1][0]) - 1,
            2.0*(pt[2]-bounds[2][0]) / (bounds[2][1] - bounds[2][0]) - 1];
}

// project point to screen coordinates
function project_pt(pt) {
    const p = norm_pt(pt);
    const A = projection;

    // center plot at center of canvas, 
    const proj_coord = [
        p[0] * A[0][0] + p[1] * A[0][1] + p[2] * A[0][2],
        p[0] * A[1][0] + p[1] * A[1][1] + p[2] * A[1][2]
    ];
    

    const x = proj_coord[0] * (width/2.2) + width/2;
    const y = proj_coord[1] * (height/2.2) + height/2;

    return [x, y];
}

// plot point
function plot_pt(pt) {
    const pos = project_pt(pt);

    ctx.beginPath();
    ctx.arc(pos[0], pos[1], 1, 0, 2*Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
}

// plot line between p0 and p1
function plot_line(p0, p1) {
    p0 = project_pt(p0);
    p1 = project_pt(p1);

    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineTo(p1[0], p1[1]);
    ctx.stroke();
}

// add two vectors x0 and x1
function add_vec(x0, x1) {
    return [x0[0] + x1[0], x0[1] + x1[1], x0[2] + x1[2]];
}

// scalar multiply vector
function mul_vec(x, k) {
    return [k*x[0], k*x[1], k*x[2]];
}

// calculate the p-infinity norm of the vector
function pinf(x) {
    return Math.max(Math.abs(x[0]), Math.max(Math.abs(x[1], Math.abs(x[2]))));
}

// perform a step of 4th order Runge-Kutta on a system of the form
// dx/dt = f(x)
// h is step size, x0 is point, f is derivative
function rk4(f, x, h) {
    const v1 = f(x);
    const v2 = f(add_vec(x, mul_vec(v1, h/2)));
    const v3 = f(add_vec(x, mul_vec(v2, h/2)));
    const v4 = f(add_vec(x, mul_vec(v3, h)));

    return add_vec(x, mul_vec(add_vec(add_vec(add_vec(v1, mul_vec(v2, 2)), mul_vec(v3, 2)), v4), h/6));
}

// perform a step of adaptive rk4 to desired tolerance tol
function adaptive_rk4(f, x0, h0, tol, hmax) {
    // calculate error estimate
    const x1 = rk4(f, x0, h0);
    const x2 = rk4(f, rk4(f, x0, h0/2), h0/2);
    const delta1 = pinf(add_vec(x1, mul_vec(x2, -1)));

    h = Math.min(0.9 * h0 * Math.pow(tol / delta1, 0.2), hmax);

    const x_new = rk4(f, x0, h);
    return [x_new, h];
}

// solve the system dx/dt = f(x) with adaptive RK4 to specified time and tolerance
function solve_rk4(f, x0, h, tstart, tend, tol, hmax) {
    pts = [];
    times = [];
    t = tstart;
    let x1 = x0;
    while(t < tend) {
        [x1, h] = adaptive_rk4(f, x1, h, tol, hmax);
        t += h;
        pts.push(x1);
        times.push(t);
    }

    return [pts, times];
}

// the lorenz system
const sigma = 10;
const rho = 28;
const beta = 8.0/3.0;

function lorenz(x) {
    return [
        sigma * (x[1] - x[0]),
        x[0]*(rho - x[2]) - x[1],
        x[0]*x[1] - beta * x[2]
    ];
}

// the chua circuit system
const m00 = -0.55;
const m01 = -0.5;
const m10 = -0.8;
const m11 = -0.84;
const Bp0 = 0.9;
const Bp1 = 1;

function chua_diode(v) {
    if(v < 0){
        if(v > -Bp0) {
            return m10*v;
        } else {
            return m10*-Bp0 + m00*(v+Bp0);
        }
    } else {
        if(v < Bp1) {
            return m11*v;
        } else {
            return m11*Bp1 + m01*(v-Bp1);
        }
    }
    return m0*v + 0.5*(m1-m0)*Math.abs(v+Bp) + 0.5*(m0-m1)*Math.abs(v-Bp);
}

let R = 1/0.7;
let C1 = 1.0;
let C2 = 1.0/9.0;
let L = 1.0/7.0;


function chua(x) {
    return [
        1/(R*C1) * (-x[0] + x[1] - R*x[2]),
        1/(R*C2) * (x[0] - x[1] - R*chua_diode(x[1])),
        1/L * x[0]
    ]
}

function draw_clear() {
    ctx.clearRect(0, 0, width, height);

    //viewVert += 0.005;
    //viewHoriz -= 0.001;
    //viewVert += 0.01;
    viewHoriz += 0.001;
    projection = calc_projection_matrix(viewVert, viewHoriz);
}

function draw_axes() {
    ctx.strokeStyle = "red";
    plot_line([0, 0, 0], [2, 0, 0]);
    ctx.strokeStyle = "green";
    plot_line([0, 0, 0], [0, 2, 0]);
    ctx.strokeStyle = "blue";
    plot_line([0, 0, 0], [0, 0, 2]);
}

const sys_tol = 0.001;
const sys_h = 0.001;
const sys_max_h = 0.08;
const sys_tstep = 0.15;

const sys_max_points = 4000;

const ic = [0.1, 0, 0];

let [sys_pos, sys_times] = solve_rk4(chua, ic, sys_h, 0, 200, sys_tol, sys_max_h);

function draw_system() {
    const last_pos = sys_pos[sys_pos.length - 1];
    const last_time = sys_times[sys_times.length - 1];

    const [x, t] = solve_rk4(chua, last_pos, sys_h, last_time, last_time + sys_tstep, sys_tol, sys_max_h);

    sys_pos = sys_pos.concat(x).slice(-sys_max_points);
    sys_times = sys_times.concat(t).slice(-sys_max_points);

    for(let i = 0; i < sys_pos.length-1; i++) {
        const p = (sys_pos.length - 1 - i) / sys_max_points;

        //const h = 0.47*p+0.3;
        //const s = 0.3;
        //const l = 1-0.6*Math.sin((Math.PI-0.2)*(p+0.2));

        const h = 0.1;
        const s = 0.8;
        const l = 0.8*p+0.2;

        ctx.strokeStyle = "hsl(" + (h*360) + ", " + (s*100) + "%," + (l*100) + "%)";
        plot_line(sys_pos[i], sys_pos[i+1]);
    }
}

function draw() {
    draw_clear();
    //draw_axes();
    ctx.lineWidth = 0.5;
    draw_system();
}

function init() {
    let content = document.getElementById("content");
    let canvas = document.getElementById("attractor_canvas");
    canvas.width = 0;
    canvas.height = 0;

    if(drawId != -1) {
        window.clearInterval(drawId);
    }
    content.classList.remove("contentNoMargin");

    // make sure we have at least 200 free pixels
    width = window.innerWidth - content.offsetWidth - 130;
    height = window.innerHeight;
    if(width < 200) {
        return;
    }

    // size canvas
    content.classList.add("contentNoMargin");
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");
    drawId = window.setInterval(draw, 40);
}